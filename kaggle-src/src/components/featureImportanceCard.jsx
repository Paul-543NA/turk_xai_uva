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

const FeatureImportanceSentencesCard = ({ featureImportances }) => {
  /*

    featureImportances: object with feature names as keys and feature importances as values

    */
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  const displayedText = continuousFeatures.map((feature, index) => {
    const importance = featureImportances[feature.name];
    if (index === continuousFeatures.length - 1) {
      return `and ${feature.label} weighs ${importance}.`;
    }
    return `${feature.label} weighs ${importance}, `;
  });

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Feature importances</h2>
        <p>According to the model, on a scale of 0 to 100, {displayedText}</p>
      </div>
    </div>
  );
};

const FeatureImportanceTableCard = ({ featureImportances }) => {
  /*
        featureImportances: object with feature names as keys and feature importances as values
        */
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Feature importances</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Importance</th>
            </tr>
          </thead>
          <tbody>
            {continuousFeatures.map((feature, index) => (
              <tr key={index}>
                <td>{feature.label}</td>
                <td>{featureImportances[feature.name]}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="card bg-base-300 shadow-xl m-4">
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
  const { getCurrentFeatureImportances, userExplanationViewMode } =
    useAnswers();
  const featureImportances = getCurrentFeatureImportances();
  const mode = userExplanationViewMode;

  // If the mode is "sentences", return the interval explanation as sentences
  if (mode === "sentences") {
    return (
      <FeatureImportanceSentencesCard featureImportances={featureImportances} />
    );
  }
  if (mode === "graph") {
    return (
      <FeatureImportanceGraphCard featureImportances={featureImportances} />
    );
  }
  if (mode === "table") {
    return (
      <FeatureImportanceTableCard featureImportances={featureImportances} />
    );
  }
  // Otherwise, return an error box with the message "Not implemented yet"
  return (
    <NotImplementedCard
      message={`Feature importance card mode "${mode}" is not implemented yet`}
    />
  );
};

export default FeatureImportanceCard;
