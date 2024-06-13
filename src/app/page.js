"use client";
import Image from "next/image";
import React, { useState } from "react";
import PropertyCard from "../components/PropertyCard";
import PointCounterfactualCard from "@/components/PointCounterfactualCard";
import UserInputCard from "@/components/UserInputCard";

import properties from "../../public/london_10.json";
import point_counterfactuals from "../../public/london_10.json";
import interval_counterfactuals from "../../public/interval_counterfactuals.json";
import { useAnswers } from "./context/AnswersContext";
import AddItem from "@/components/AddItem";
import IntervalCard from "@/components/IntervalCard";

// TODO: Add a modal to show the actual price of the house (or make it an input thing)

export default function Home() {
  const { userId, resetUserID, currentQuestion, goToNextQuestion } =
    useAnswers();
  const [explanationViewMode, setExplanationViewMode] = useState("sentences");
  const [explanationType, setExplanationType] = useState("point");
  const [currentPhase, setCurrentPhase] = useState("0");

  const handleNext = () => {
    goToNextQuestion();
  };

  const progressValue = (currentQuestion / properties.length) * 100;

  const ExplanationSelector = (
    <select
      className="select select-bordered bg-warning text-warning-content"
      onChange={(e) => setExplanationViewMode(e.target.value)}
    >
      <option value="sentences">Sentences</option>
      <option value="graph">Graph</option>
      <option value="table">Table</option>
    </select>
  );
  const ExplanationTypeSelector = (
    <select
      className="select select-bordered bg-warning text-warning-content"
      onChange={(e) => setExplanationType(e.target.value)}
    >
      <option value="point">Point explanation</option>
      <option value="interval">Interval explanation</option>
      <option value="both">Both explanations</option>
    </select>
  );
  const CurrentPhaseSelector = (
    <select
      className="select select-bordered bg-warning text-warning-content"
      onChange={(e) => setCurrentPhase(e.target.value)}
    >
      <option value="0">Phase 0</option>
      <option value="1">Phase 1</option>
      <option value="2">Phase 2</option>
    </select>
  );

  return (
    <main className="flex min-h-screen flex-col items-leading justify-between p-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-center mb-0">This is a title</h1>
        {/* Explanation view selection dropdown */}
        <div className="flex flex-row gap-4">
          {CurrentPhaseSelector}
          {ExplanationTypeSelector}
          {ExplanationSelector}
        </div>

        {/* <button className="btn btn-secondary px-2 py-1" onClick={resetUserID}>
          Reset user ID
        </button> */}
      </div>
      <p>
        {currentQuestion}/{properties.length} completed
      </p>
      {/* <p> User id: {userId}</p> */}

      {/* Progress bar */}
      <div className="flex justify-center py-4">
        <progress className="progress w-full" value={progressValue} max={100} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Property features card */}
        <div className="flex-grow space-y-2">
          <PropertyCard property={properties[currentQuestion]} />
        </div>

        {/* Counterfactual explanation card */}
        {explanationType === "interval" || explanationType === "both" ? (
          <div className="flex-grow space-y-2">
            <IntervalCard
              property={properties[currentQuestion]}
              intervalExplanation={interval_counterfactuals[currentQuestion]}
              mode={explanationViewMode}
            />
          </div>
        ) : null}

        {/* Counterfactual explanation card */}
        {/* Counterfactual explanation card */}
        {explanationType === "point" || explanationType === "both" ? (
          <div className="flex-grow space-y-2">
            <PointCounterfactualCard
              property={properties[currentQuestion]}
              pointCounterfactual={point_counterfactuals[currentQuestion]}
              mode={explanationViewMode}
            />
          </div>
        ) : null}

        {/* Inputs for user answers */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1">
          <UserInputCard onClickNext={handleNext} phase={currentPhase} />
        </div>
      </div>
    </main>
  );
}
