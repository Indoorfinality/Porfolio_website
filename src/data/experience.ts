export type Experience = {
  id: string;
  role: string;
  org: string;
  period: string;
  bullets: string[];
  current?: boolean;
};

export const experience: Experience[] = [
  {
    id: "bitskraft",
    role: "Software Developer",
    org: "Bitskraft Pvt. Ltd.",
    period: "March 2025 – Present",
    current: true,
    bullets: [
      "Building production services and features with FastAPI.",
      "Shipping React frontends for internal and client-facing workflows.",
      "Automating browser flows and regression checks with Playwright.",
      "Integrated email automation and document pipelines using Unstract.",
    ],
  },
  {
    id: "ssf",
    role: "RPA Developer",
    org: "Social Security Fund (SSF)",
    period: "Recent",
    current: true,
    bullets: [
      "Automating operational workflows with production-minded RPA.",
      "Browser and system automation with Playwright and Selenium.",
      "Backend capability across Django and FastAPI for service integration.",
    ],
  },
  {
    id: "iimi",
    role: "Supervisor",
    org: "Intelligent Image Management (IIMI)",
    period: "March 2023 – January 2024",
    bullets: [
      "Led data entry operators for accuracy and throughput.",
      "Ran quality control for data integrity under tight deadlines.",
      "Scheduled teams, delegated work, and trained members.",
    ],
  },
  {
    id: "brainycube",
    role: "Research Intern",
    org: "Brainycube Research Organisation",
    period: "October 2021 – April 2023",
    bullets: [
      "Designed IoT devices for automation and control.",
      "Wrote technical documentation and competed in robotics events.",
      "Organised Nepal Youth Science Summit.",
    ],
  },
];

