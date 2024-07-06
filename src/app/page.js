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

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold dark:text-gray-300">
            Hello there!
          </h1>
          <p className="py-8 text-xl">
            You are about to take part in a study of human AI collaboration. We
            are very excited to count you as one of our participants! It will
            only take a few minutes and if you do well you might even win a gift
            card!
          </p>
          <button className="btn btn-primary text-lg" onClick={handleClick}>
            {didCompleteForm ? "Continue" : "Get started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
