"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAnswers } from "../context/AnswersContext";

export default function ExperimentIntroduction() {
  const router = useRouter();

  const handleContinue = () => {
    // Assuming you have some introduction data to submit or just navigating to the experiment page

    router.push("/task");
  };

  return (
    <div className="container mx-auto text-xl p-10 mt-10">
      <h1 className="text-4xl font-bold mb-4 dark:text-gray-300">
        Experiment Introduction
      </h1>
      <div className="space-y-8">
        <div className="form-control">
          <p className="text-base mb-4">[Experiment description...]</p>
        </div>
        <div className="form-control">
          <button onClick={handleContinue} className="btn btn-primary mt-4">
            Okay! Start the experiment!
          </button>
        </div>
      </div>
    </div>
  );
}
