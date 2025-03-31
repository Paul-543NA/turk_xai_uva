"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAnswers } from "./context/AnswersContext";

const Page = () => {
  const router = useRouter();
  const { didCompleteForm, didGiveConsent } = useAnswers();

  const handleClick = () => {
    if (!didGiveConsent) {
      router.push("/consent");
    } else if (didCompleteForm) {
      router.push("/task");
    } else {
      router.push("/form");
    }
  };

  // return (
  //   <div className="hero bg-base-200 min-h-screen">
  //     <div className="hero-content text-center">
  //       <div className="max-w-lg">
  //         <h1 className="text-5xl font-bold dark:text-gray-300">
  //           Hello there!
  //         </h1>
  //         <p className="py-8 text-xl">
  //           You are about to take part in a study of human AI collaboration. We
  //           are very excited to count you as one of our participants! It will
  //           take about 30 minutes and if you do well you might even win a gift
  //           card!
  //         </p>
  //         <button className="btn btn-primary text-lg" onClick={handleClick}>
  //           {didCompleteForm ? "Continue" : "Get started"}
  //         </button>
  //       </div>
  //     </div>
  //     <div className="fixed bottom-4 w-full flex justify-center">
  //       <p className="text-center text-sm text-gray-500 max-w-6xl px-4">
  //         To receive financial compensation for participating in this study, you
  //         must complete the survey fully, sensibly, and truthfully. We have
  //         quality criteria in place to assess this. If these criteria are not met,
  //         you will not receive credit for participation (via Amazon Mechanical Turk) and will not be eligible
  //         to win a gift card.
  //       </p>
  //     </div>
  //   </div>
  // );
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold dark:text-gray-300">
            Hello there!
          </h1>
          <p className="py-8 text-xl">
            This study has been terminated. Thank you for your interest.
          </p>
        </div>
      </div>
      <div className="fixed bottom-4 w-full flex justify-center">
        <p className="text-center text-sm text-gray-500 max-w-6xl px-4">
           To receive financial compensation for participating in this study, you
           must complete the survey fully, sensibly, and truthfully. We have
           quality criteria in place to assess this. If these criteria are not met,
           you will not receive credit for participation (via Amazon Mechanical Turk) and will not be eligible
           to win a gift card.
         </p>
      </div>
    </div>
  );
};

export default Page;
