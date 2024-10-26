import React from "react";
import FeatureItem from "./FeatureItem";
import {
  BookOpen,
  CheckCircle,
  Globe,
  Layers,
  PlusCircle,
  Settings,
} from "lucide-react";
import { interFont } from "@/lib/fonts";

function Features() {
  return (
    <section className='text-center mb-48 pt-20' id='features'>
      <h1
        className={`text-3xl xs:text-4xl lg:text-7xl font-bold text-white ${interFont.className}`}
      >
        Features
      </h1>
      <div className='lg:w-2/3 px-10 mx-auto grid grid-cols-1 max-w-[450px] sm:max-w-max sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10'>
        {features.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}

export default Features;

const features = [
  {
    title: "Customizable Plans",
    description: "Adapt Bible reading plans to your schedule and preferences.",
    icon: <Settings />,
  },
  {
    title: "Popular Reading Plans",
    description: "Choose from a selection of popular Bible reading plans.",
    icon: <BookOpen />,
  },
  {
    title: "Create Your Own Plan",
    description: "Make a personalized plan that suits your pace and goals.",
    icon: <PlusCircle />,
  },
  {
    title: "Track Your Schedule",
    description: "Easily check off chapters and track your progress every day.",
    icon: <CheckCircle />,
  },
  {
    title: "Built-in Bible Tracker",
    description: "See which Bible books you’ve read and track all 66 books.",
    icon: <Layers />,
  },
  {
    title: "Accessible Anywhere",
    description:
      "Access your reading plan on any device with an internet connection.",
    icon: <Globe />,
  },
];
