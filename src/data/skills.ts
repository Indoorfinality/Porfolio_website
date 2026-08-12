export type SkillGroup = {
  id: string;
  label: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "web",
    label: "Web & frontend",
    skills: ["React", "HTML", "CSS", "JavaScript", "Git", "GitHub"],
  },
  {
    id: "automation",
    label: "Backend & automation",
    skills: [
      "FastAPI",
      "Django",
      "Celery",
      "Playwright",
      "Selenium",
      "RPA",
    ],
  },
  {
    id: "ai",
    label: "AI / LLMs",
    skills: [
      "LangChain",
      "LangGraph",
      "OpenAI",
      "Gemini",
      "Google ADK",
      "RAG",
      "ChromaDB",
    ],
  },
  {
    id: "data",
    label: "Data",
    skills: [
      "Python",
      "R",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "MySQL",
      "PostgreSQL",
      "Power BI",
    ],
  },
  {
    id: "iot",
    label: "IoT / robotics",
    skills: ["Raspberry Pi", "Arduino", "ESP", "Robotics"],
  },
];
