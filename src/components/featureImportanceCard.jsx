"use client";
import React from "react";
import IntervalBar from "./IntervalBar";
import NotImplementedCard from "./NotImplementedCard";
import { formatFeatureForUI, getFeatureBounds } from "@/utils/featureProcessor";
import featureInfos from "../../public/data/feature_infos.json";
import { useAnswers } from "@/app/context/AnswersContext";

const FeatureImportanceBar = ({ actual, featureMax = 100 }) => {
  const FIHighlightBar = ({ end }) => (
    <div
      className="absolute bg-secondary bg-opacity-100 h-4 w-4 z-10 rounded-full"
      style={{
        left: `${0}%`,
        width: `${end}%`,
        top: "0",
      }}
    />
  );

  const FIEndLabel = ({ position, label }) => (
    <p
      className="absolute text-secondary opacity-100 z-10"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-50%)",
      }}
    >
      {label}
    </p>
  );

  const scaledActual = (actual / featureMax) * 100;

  // Case values to string and add the label suffix
  const actualLabel = actual.toString();

  return (
    <div className="w-full p-2">
      {/* Progress labels */}
      <div className="relative w-full bg-transparent rounded-full py-3">
        <FIEndLabel position={scaledActual} label={actualLabel} />
      </div>

      {/* Progress bar itself */}
      <div className="relative w-full bg-base-content bg-opacity-50 rounded-full h-4">
        <FIHighlightBar end={scaledActual} />
      </div>
    </div>
  );
};

const FeatureImportanceGraphCard = ({ featureImportances }) => {
  /*
    featureImportances: object with feature names as keys and feature importances as values
    */
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  const FeatureImportanceLine = ({ featureInfo }) => {
    const importance = featureImportances[featureInfo.name];

    return (
      <div className="py-2">
        <p>{featureInfo.label}</p>
        <FeatureImportanceBar actual={importance} />
      </div>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Feature importances</h2>
        {continuousFeatures.map((feature, index) => (
          <FeatureImportanceLine key={index} featureInfo={feature} />
        ))}
      </div>
    </div>
  );
};

const FeatureImportanceCard = () => {
  const { getCurrentFeatureImportances } = useAnswers();
  const featureImportances = getCurrentFeatureImportances();

  return <FeatureImportanceGraphCard featureImportances={featureImportances} />;
};

export default FeatureImportanceCard;
