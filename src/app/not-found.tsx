import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-32 text-center">
        <p className="text-sm tracking-[0.18em] text-[var(--accent)] uppercase">404</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--cream)]">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-[var(--muted)]">
          That route doesn&apos;t exist. Head back to selected work.
        </p>
        <Link
          href="/"
          className="btn-spell mt-8 inline-flex px-6 py-3 text-sm font-medium"
        >
          Back home
        </Link>
      </main>
      <Footer />
    </>
  );
}
