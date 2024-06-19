"use client";
import Image from "next/image";
import React, { useState } from "react";
import PropertyCard from "../components/PropertyCard";
import PointCounterfactualCard from "@/components/PointCounterfactualCard";
import UserInputCard from "@/components/UserInputCard";
import { PhaseInstructions } from "../components/instructions";

import { useAnswers } from "./context/AnswersContext";
import AddItem from "@/components/AddItem";
import IntervalCard from "@/components/IntervalCard";
import FeatureImportanceCard from "@/components/featureImportanceCard";

// TODO: Implement the feedback logic
// TODO: Fix the page reload bug
// TODO: Implement sentences and tables for feature importances
// TODO: Fix the counterfactual out of bounds bug

export default function Home() {
  const answersContext = useAnswers();
  const { userExplanationType: explanationType, currentPhase } = answersContext;
  const progressValue = answersContext.getCurrentPhaseProgress() * 100;

  const handleNext = () => {
    // HACK: This is a temporary function, should be in the submit card eventually
  };

  const ExplanationSelector = (
    <select
      className="select select-bordered bg-warning text-warning-content"
      onChange={(e) =>
        answersContext.setUserExplanationViewMode(e.target.value)
      }
    >
      <option value="sentences">Sentences</option>
      <option value="graph">Graph</option>
      <option value="table">Table</option>
    </select>
  );
  const ExplanationTypeSelector = (
    <select
      className="select select-bordered bg-warning text-warning-content"
      onChange={(e) => answersContext.setUserExplanationType(e.target.value)}
    >
      <option value="point">Point explanation</option>
      <option value="interval">Interval explanation</option>
      <option value="both">Both explanations</option>
    </select>
  );
  const CurrentPhaseSelector = (
    <select
      className="select select-bordered bg-warning text-warning-content"
      onChange={(e) => answersContext.updatePhase(e.target.value)}
    >
      <option value="0">Phase 0</option>
      <option value="1">Phase 1</option>
      <option value="2">Phase 2</option>
    </select>
  );
  // Button that resets the user
  const resetUserButton = (
    <button
      className="btn btn-secondary px-2 py-1"
      onClick={answersContext.resetUser}
    >
      Reset user ID
    </button>
  );

  return (
    <main className="flex min-h-screen flex-col items-leading justify-start p-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-center mb-0">This is a title</h1>
        {/* Explanation view selection dropdown */}
        <div className="flex flex-row gap-4">
          {resetUserButton}
          {CurrentPhaseSelector}
          {ExplanationTypeSelector}
          {ExplanationSelector}
        </div>

        {/* <button className="btn btn-secondary px-2 py-1" onClick={resetUserID}>
          Reset user ID
        </button> */}
      </div>
      <p>Explanation type {answersContext.userExplanationType}</p>
      <p>
        Phase {answersContext.currentPhase} -{answersContext.currentQuestion}
        cases completed
        {/* HACK: Fix the above if need be */}
      </p>
      {/* <p> User id: {userId}</p> */}

      {/* Progress bar */}
      <div className="flex justify-center py-4">
        <progress className="progress w-full" value={progressValue} max={100} />
      </div>

      {/* Instructions dropdown */}
      <div className="collapse bg-base-200 py-4">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium bg-neutral text-neutral-content">
          Show instructions
        </div>
        <div className="collapse-content flex justify-center">
          <PhaseInstructions />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Property features card */}
        <div className="flex-grow space-y-2">
          <PropertyCard className="flex mx-4" />
        </div>

        {/* Counterfactual explanation card */}
        {explanationType === "point" || explanationType === "both" ? (
          <div className="flex-grow space-y-2">
            <PointCounterfactualCard />
          </div>
        ) : null}

        {/* Counterfactual explanation card */}
        {explanationType === "interval" || explanationType === "both" ? (
          <div className="flex-grow space-y-2">
            <IntervalCard />
          </div>
        ) : null}

        {/* Feature importance card */}
        {explanationType === "featureImportance" ? (
          <div className="flex-grow space-y-2">
            <FeatureImportanceCard />
          </div>
        ) : null}

        {/* Add item card */}

        {/* Inputs for user answers */}
        {explanationType === "none" ? (
          <div className="col-span-1">
            <UserInputCard />
          </div>
        ) : (
          <div className="col-span-1 md:col-span-2 xl:col-span-1">
            <UserInputCard />
          </div>
        )}
      </div>
    </main>
  );
}
