import { Feature, Testimonial } from "@/types";

export const features: Feature[] = [
  {
    id: "f1",
    title: "AI-Powered Diagnostics",
    description:
      "Deep-learning models trained on millions of dental images detect cavities, bone loss, and pathologies with > 94 % accuracy.",
    icon: "brain",
  },
  {
    id: "f2",
    title: "Real-Time Analysis",
    description:
      "Results in seconds — not days. Our edge-AI pipeline processes scans and X-rays instantly, right inside the clinic.",
    icon: "zap",
  },
  {
    id: "f3",
    title: "Seamless Integration",
    description:
      "Plug into Dentrix, Eaglesoft, Curve, and 30+ other practice management systems without changing your workflow.",
    icon: "plug",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Dr. Sarah Mitchell",
    role: "Principal Dentist",
    company: "Bright Smiles Clinic, London",
    content:
      "InnoDent AI has cut our diagnostic time in half. The cavity detection accuracy is remarkable — I now catch things I would have easily missed on a manual review.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Dr. Ahmed Al-Rashid",
    role: "Oral Surgeon",
    company: "Al-Rashid Dental Centre, Dubai",
    content:
      "The AI Implant Guide is a game-changer. My surgical precision has improved, and I can share beautiful visual plans with patients that actually convert.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Dr. Priya Nair",
    role: "Dental Practice Owner",
    company: "Nair Family Dentistry, Toronto",
    content:
      "Patient-facing reports from the Treatment Planner increased my case acceptance by 35 % in the first month. Worth every penny.",
    rating: 5,
  },
];

export const stats = [
  { label: "Clinics", value: "+876" },
  { label: "Professionals", value: "+987" },
  { label: "Products", value: "+129" },
  { label: "AI Models", value: "+387" },
];

