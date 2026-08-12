"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import {
  AnimationMixer,
  LoopRepeat,
  MathUtils,
  Vector3,
  type AnimationAction,
  type AnimationClip,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
} from "three";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

/** LasquetiSpice — Animated Dragon Three Motion Loops (CC-BY) */
const DRAGON_URL = "/models/sky-dragon.glb";

/** Keep wing/body flap tracks; drop root travel so we steer the flight path. */
function flyingInPlaceClip(_source: Object3D, animations: AnimationClip[]) {
  const base =
    animations.find((a) => /fly/i.test(a.name)) || animations[0] || null;
  if (!base) return null;
  const clip = base.clone();
  clip.name = "FlyingInPlace";
  clip.tracks = clip.tracks.filter((track) => {
    const isPos = track.name.endsWith(".position");
    if (!isPos) return true;
    return !/(^|[/.])(root\.4_4|pelvis\.5_5|GLTF_created_0_rootJoint|skeletal\.3_3|RootNode)(\.|$)/i.test(
      track.name,
    );
  });
  return clip;
}

function prepareDragon(source: Object3D) {
  const model = SkeletonUtils.clone(source);
  model.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.frustumCulled = false;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((raw) => {
      const m = raw as MeshStandardMaterial;
      if (!m?.isMaterial) return;
      m.side = 2;
      m.needsUpdate = true;
    });
  });
  return model;
}

function FlyingDragon({ reduced }: { reduced: boolean }) {
  const root = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const actionRef = useRef<AnimationAction | null>(null);
  const prev = useRef(new Vector3(0, 0, 0));
  const primed = useRef(false);
  const tmp = useRef(new Vector3());
  const phase = useRef(0);
  const smoothSpeed = useRef(0.35);
  const { scene, animations } = useGLTF(DRAGON_URL);
  const model = useMemo(() => prepareDragon(scene), [scene]);
  const { skyTheme } = useTheme();
  const isDark = skyTheme === "dark";

  useEffect(() => {
    const clip = flyingInPlaceClip(model, animations);
    if (!clip) {
      console.warn("[SkyDragon] No Flying clip on GLB");
      return;
    }
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(LoopRepeat, Infinity);
    action.clampWhenFinished = false;
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(reduced ? 0.7 : 1.15);
    action.play();
    mixerRef.current = mixer;
    actionRef.current = action;
    return () => {
      action.stop();
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      mixerRef.current = null;
      actionRef.current = null;
    };
  }, [model, animations, reduced]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    const g = root.current;
    if (!g) return;

    if (reduced) {
      g.position.set(0.6, -0.55, 0);
      g.rotation.set(0.05, Math.PI * 0.55, 0);
      g.scale.setScalar(0.38);
      return;
    }

    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    const glide = 0.5 + 0.5 * Math.sin(t * 0.09);
    const surge = 0.5 + 0.5 * Math.sin(t * 0.22 + 1.7);
    const dash = Math.pow(0.5 + 0.5 * Math.sin(t * 0.13 + 0.4), 3);
    const targetPace = 0.24 + 0.41 * glide * surge + 0.45 * dash;
    smoothSpeed.current = MathUtils.damp(smoothSpeed.current, targetPace, 1.6, dt);
    const pace = smoothSpeed.current;

    phase.current += dt * pace * 0.78;
    const p = phase.current;

    const x =
      Math.sin(p * 0.55) * 2.05 +
      Math.sin(p * 0.82 + 0.6) * 0.45 +
      Math.sin(p * 0.25) * 0.3;
    const y = MathUtils.clamp(
      Math.sin(p * 0.7) * 0.09 +
        Math.cos(p * 0.4) * 0.05 +
        Math.sin(p * 1.05) * 0.02 -
        0.58,
      -0.85,
      -0.28,
    );
    const z =
      Math.sin(p * 0.36 + 0.9) * 1.25 +
      Math.cos(p * 0.2) * 0.4 +
      Math.sin(p * 0.7) * 0.18;

    const next = tmp.current.set(x, y, z);
    if (!primed.current) {
      prev.current.copy(next);
      primed.current = true;
    }
    const velX = next.x - prev.current.x;
    const velY = next.y - prev.current.y;
    const velZ = next.z - prev.current.z;
    prev.current.copy(next);

    g.position.copy(next);

    const speedSq = velX * velX + velY * velY + velZ * velZ;
    const speed = Math.sqrt(speedSq);
    if (speedSq > 1e-8) {
      const yaw = Math.atan2(velX, velZ);
      const lean = MathUtils.clamp(pace, 0.2, 0.95);
      const pitch = MathUtils.clamp(-velY * 2.1 * lean, -0.32, 0.32);
      const bank = MathUtils.clamp(-velX * 0.55 * lean - velZ * 0.12, -0.4, 0.4);
      g.rotation.set(pitch + 0.03, yaw + Math.PI, bank);
    }

    const depthScale = MathUtils.clamp(0.26 + (z + 2.1) * 0.07, 0.26, 0.48);
    g.scale.setScalar(depthScale);

    const flap = MathUtils.clamp(0.7 + pace * 0.55 + speed * 5, 0.65, 1.35);
    actionRef.current?.setEffectiveTimeScale(flap);
  });

  return (
    <group ref={root} dispose={null}>
      <primitive object={model} rotation={[0, Math.PI, 0]} />
      <pointLight
        intensity={isDark ? 0.35 : 0.5}
        distance={8}
        color={isDark ? "#9eb6ff" : "#ffe0c0"}
        position={[0, -0.4, 0.8]}
      />
    </group>
  );
}

export default function SkyDragon() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { skyTheme } = useTheme();
  const isDark = skyTheme === "dark";

  useEffect(() => {
    setMounted(true);
    void useGLTF.preload(DRAGON_URL);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[62%] sm:h-[64%]"
      aria-hidden
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.6], fov: 32, near: 0.1, far: 40 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={isDark ? 0.45 : 0.85} />
        <hemisphereLight
          intensity={isDark ? 0.65 : 1.05}
          color={isDark ? "#c5d4ff" : "#fff0de"}
          groundColor={isDark ? "#1a1424" : "#8a5538"}
        />
        <directionalLight
          position={[4, 5, 4]}
          intensity={isDark ? 1.35 : 1.9}
          color={isDark ? "#e8eeff" : "#fff7ec"}
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={isDark ? 0.45 : 0.55}
          color={isDark ? "#ff9a6a" : "#ffc09a"}
        />
        <Suspense fallback={null}>
          <FlyingDragon reduced={!!reduce} />
        </Suspense>
      </Canvas>
      <span className="sr-only">
        Animated dragon by LasquetiSpice, Creative Commons Attribution
      </span>
    </div>
  );
}
