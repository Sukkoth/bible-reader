import { interFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

function Benefits() {
  return (
    <section className='xl:w-2/3 mx-auto min-h-full pt-20' id='benefits'>
      <h1
        className={`text-3xl xs:text-4xl lg:text-7xl font-bold text-white text-center mb-10 ${interFont.className}`}
      >
        Benefits
      </h1>
      {benefits.map((benefit, index) => (
        <div
          className={cn("flex md:h-[20rem] ", {
            "flex-row-reverse": index % 2 !== 0,
          })}
          key={benefit.title}
        >
          <div className='w-1/2 md:w-1/2 p-3 flex justify-center flex-col'>
            <h1
              className={`text-xl sm:text-3xl lg:text-5xl md:w-2/3  ${interFont.className}`}
            >
              {benefit.title}
            </h1>
            <p className={`text-stone-400 md:w-2/3 mt-5 text-sm`}>
              {benefit.description}
            </p>
          </div>
          <div className='flex-grow relative object-cover w-1/2 md:w-2/3 overflow-hidden'>
            <Image
              src={benefit.img}
              alt='handl-on-bible'
              fill
              objectFit='cover'
              className='hover:scale-110 transition-transform duration-700'
            />
          </div>
        </div>
      ))}
    </section>
  );
}

export default Benefits;
const benefits = [
  {
    title: "Strengthen Your Spiritual Journey",
    description:
      "With guided progress tracking, stay motivated and focused on completing your reading goals, fostering spiritual growth along the way.",
    img: "/landing-images/open-bible.jpg",
  },
  {
    title: "Build Consistent Habits",
    description:
      "Develop a daily reading habit that’s easy to follow, helping you make Bible study a natural part of your life and routine.",
    img: "/landing-images/note.jpg",
  },
  {
    title: "Get Encouragement and Accountability",
    description:
      "Feel accomplished as you track each completed chapter, and stay accountable to your goals with clear progress indicators.",
    img: "/landing-images/on-bible.jpg",
  },
  {
    title: "Flexible to Your Schedule",
    description:
      "Whether your time is limited or flexible, customize your reading to fit seamlessly into your daily life at a pace that suits you.",
    img: "/landing-images/reading-bible.jpg",
  },
  {
    title: "Accessible Anytime, Anywhere",
    description:
      "With cross-device compatibility, you’ll have the freedom to keep up with your journey no matter where you are.",
    img: "/landing-images/taking-note.jpg",
  },
];
