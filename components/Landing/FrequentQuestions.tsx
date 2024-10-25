import React from "react";
import FrequentQuestionItem from "./FrequentQuestionItem";

function FrequentQuestions() {
  return (
    <section className='xl:w-2/3 mx-auto h-full mt-40'>
      <h1
        className={`text-3xl xs:text-4xl lg:text-7xl font-bold text-white text-center mb-10`}
      >
        Frequently Asked Questions
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
    question: "How do I reset my password?",
    answer:
      "To reset your password, go to the login page and click on 'Forgot Password?'. Follow the instructions in the email you receive to set a new password.",
  },
  {
    question: "Can I create my own reading plan?",
    answer:
      "Yes! You can customize your own Bible reading plan based on your schedule and preferences within the app.",
  },
  {
    question: "Is the app available offline?",
    answer:
      "Yes, as a Progressive Web App (PWA), you can install it and access your reading plans even without an internet connection.",
  },
  {
    question: "How do I track my reading progress?",
    answer:
      "You can mark chapters as read directly in the app, which will update your progress and show you how much you have completed.",
  },
  {
    question: "What should I do if I encounter a bug?",
    answer:
      "If you find a bug, please report it through the support section in the app, and we'll work to resolve it as soon as possible.",
  },
  {
    question: "Can I access the app on multiple devices?",
    answer:
      "Yes, you can access your account on any device with an internet connection, allowing you to keep up with your reading from anywhere.",
  },
  {
    question: "Are there any costs associated with using the app?",
    answer:
      "The app is free to use, but some premium features may require a subscription in the future.",
  },
];
