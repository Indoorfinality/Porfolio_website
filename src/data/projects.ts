import { slugify, projectPath } from "@/lib/slug";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  featured: boolean;
  href?: string;
  year: string;
};

export const projects: Project[] = [
  {
    slug: slugify("Automated Data Extraction System"),
    title: "Automated Data Extraction System",
    summary:
      "Email-driven pipelines that turn PDFs, links, and messages into structured data.",
    description:
      "Built an automated email-based system with FastAPI, Celery, and SQLite to extract structured data from PDFs, emails, and links—with client-specific workflows and filtering for accurate processing. Extended at Bitskraft as a Software Developer with React interfaces and Playwright coverage around the pipeline.",
    tags: ["FastAPI", "React", "Playwright", "Celery", "Unstract"],
    featured: true,
    year: "2025",
  },
  {
    slug: slugify("CricChat Cricket Chatbot"),
    title: "CricChat — Cricket Chatbot",
    summary:
      "Agentic RAG chatbot for cricket rules and live-adjacent queries.",
    description:
      "Developed an agentic AI cricket chatbot with LangGraph, a RAG layer, and ChromaDB for rule-based answers from a vector store. Integrated Google Search for dynamic cricket queries beyond static knowledge.",
    tags: ["LangGraph", "RAG", "ChromaDB", "LLMs"],
    featured: true,
    year: "2025",
  },
  {
    slug: slugify("Social Security Fund RPA"),
    title: "RPA at Social Security Fund",
    summary:
      "Robotic process automation for SSF workflows—repeatable, auditable, production-minded.",
    description:
      "RPA developer at Social Security Fund (SSF), automating operational workflows with browser and desktop automation. Capable across Playwright and Selenium for resilient UI automation, alongside backend services in Django and FastAPI where systems need APIs and orchestration.",
    tags: ["RPA", "Playwright", "Selenium", "Django", "FastAPI"],
    featured: true,
    year: "2025",
  },
  {
    slug: slugify("Bank Customer Churn Prediction"),
    title: "Bank Customer Churn Prediction",
    summary:
      "ML model to flag customers at risk of leaving—preprocessing to evaluation.",
    description:
      "Built a churn prediction model with Python, Scikit-learn, and Pandas, focusing on preprocessing and evaluation to support retention strategies.",
    tags: ["Python", "Scikit-learn", "Pandas", "ML"],
    featured: true,
    year: "2024",
  },
  {
    slug: slugify("Line Following Waiter Robot"),
    title: "Line Following Waiter Robot",
    summary:
      "Arduino robot that follows a path and serves—hardware meets software.",
    description:
      "Engineered a line-following waiter robot with Arduino and a custom companion app for navigation and service tasks. Built on a foundation of IoT and robotics competition experience.",
    tags: ["Arduino", "IoT", "Robotics"],
    featured: true,
    year: "2023",
  },
  {
    slug: slugify("Udemy Courses Data Analysis"),
    title: "Udemy Courses Data Analysis",
    summary:
      "R analysis of pricing, ratings, and enrollments for actionable course insights.",
    description:
      "Analyzed Udemy course data with R, dplyr, and ggplot2 to uncover trends in pricing, ratings, and enrollments.",
    tags: ["R", "dplyr", "ggplot2"],
    featured: false,
    year: "2024",
  },
];

/** Old short paths → current slugs (for redirects). */
export const projectSlugAliases: Record<string, string> = {
  "automated-data-extraction": "automated-data-extraction-system",
  cricchat: "cricchat-cricket-chatbot",
  "ssf-rpa": "social-security-fund-rpa",
  "bank-churn-prediction": "bank-customer-churn-prediction",
  "udemy-data-analysis": "udemy-courses-data-analysis",
};

export function getProject(slug: string) {
  const resolved = projectSlugAliases[slug] || slug;
  return projects.find((p) => p.slug === resolved);
}

export function getProjectHref(project: Project) {
  return projectPath(project.slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
