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
      <div className="space-y-2">
        <div className="form-control">
          <p className="text-lg mb-4">
            In this experiment we are looking at how good humans and AI are at <strong>predicting the sales price of houses</strong>. 
          </p>
          <p className="text-lg mb-4">
            The <strong>data</strong> we are using stems from Utrecht, which is a city in the Netherlands. 
            Utrecht has a population of roughly 370,000 people and with that is one of the biggest cities in the country. 
            It is located approximately 30 min travel time to the Netherland's capital city. <strong>An AI was trained to predict a house's sales price based on eleven characteristics of the property:</strong> 
            <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
            <li>length of the lot</li>
            <li>width of the lot</li>
            <li>living area of the house</li>
            <li>size of the garden</li>
            <li>construction year</li>
            <li>number of bathrooms</li>
            <li>number of balconies</li>
            <li>zipcode</li>
            <li>whether or not the house is classified as energy efficient</li>
            <li>whether or not the house is a registered as a monument</li>
            </ul>
          </p>
          <p className="text-base mb-4">
            The set-up of this experiment is as follows: you will go through <strong>three phases</strong>, each with their own instructions. 
            The instructions will be shown to you at the start of each phase. <strong>You can revisit the instructions</strong> for the respective phase at any time during
            the experiment by clicking on the "Show instructions"-tab.
          </p>
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
