import React from "react";
import FrequentQuestionItem from "./FrequentQuestionItem";
import { interFont } from "@/lib/fonts";

function FrequentQuestions() {
  return (
    <section className='xl:w-2/3 mx-auto mt-40 pt-20' id='faqs'>
      <h1
        className={`${interFont.className} text-3xl xs:text-4xl lg:text-7xl font-bold text-white text-center mb-10`}
      >
        FAQs
      </h1>
      <div className='px-5 mx-auto md:w-2/3 space-y-4'>
        {faqs.map((question) => (
          <FrequentQuestionItem {...question} key={question.question} />
        ))}
      </div>
    </section>
  );
}

export default FrequentQuestions;

const faqs = [
  {
    question: "Can I create my own reading plan?",
    answer:
      "Yes! You can customize your own Bible reading plan based on your schedule and preferences within the app.",
  },
  {
    question: "Can I create customized plans?",
    answer:
      "Yes, you can customize the plans provided within the app. But there are plans which should not be customized because customizing them would potentially ruin the very purpose of the plans.",
  },
  {
    question: "Are there any costs associated with using the app?",
    answer: "The app is free to use, there is nothing you need to pay.",
  },
  {
    question:
      "What should I do if I already have plans I started on my own or on other apps?",
    answer:
      "When you create your reading schedule, you can set the date to the date you started in the past and the schedule will be calculated accordingly. So you do not have to worry about starting all over again just to use this app.",
  },
  {
    question: "Does it have integrated bible?",
    answer:
      "No, This is only for plans and tracking them. You should use your hard copy bible book or your favourite bible apps.",
  },
  {
    question: "How do I track my reading progress?",
    answer:
      "You can mark chapters as read directly in the app, which will update your progress and show you how much you have completed.",
  },

  {
    question: "Can I access the app on multiple devices?",
    answer:
      "Yes, you can access your account on any device with an internet connection, allowing you to keep up with your reading from anywhere.",
  },
  {
    question: "What should I do if I encounter a bug?",
    answer:
      "If you find a bug, please report it through 'contact us' section in the app, and we'll work to resolve it as soon as possible.",
  },

  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, go to the login page and click on 'Forgot Password?'. Follow the instructions in the email you receive to set a new password.",
  },
];
