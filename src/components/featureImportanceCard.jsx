"use client";
import React from "react";
import NotImplementedCard from "./NotImplementedCard";
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

  const sortedFeatures = continuousFeatures
    .map((feature) => ({
      name: feature.name,
      label: feature.label,
      importance: featureImportances[feature.name],
    }))
    .sort((a, b) => b.importance - a.importance);

  const paragraph =
    `According to the AI, on a scale from 0 to 100, ` +
    `${sortedFeatures[0].label} weighs ${sortedFeatures[0].importance}, ` +
    `${sortedFeatures[1].label} weighs ${sortedFeatures[1].importance}, and ` +
    `${sortedFeatures[2].label} weighs ${sortedFeatures[2].importance}. ` +
    `This is followed by ${sortedFeatures[3].label} with a weight of ${sortedFeatures[3].importance} ` +
    `and ${sortedFeatures[4].label} with a weight of ${sortedFeatures[4].importance}. ` +
    `${sortedFeatures[5].label} (weight ${sortedFeatures[5].importance}) ` +
    `and ${sortedFeatures[6].label} (weight ${sortedFeatures[6].importance}) ` +
    `had the least impact on the prediction.`;

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Feature importances</h2>
        <p>{paragraph}</p>
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

  const aiDescText =
    "The explanation shows the importance of each feature towards the AI's prediction from 0 to 100.";

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Feature importances</h2>
        <p>{aiDescText}</p>
        <table className="table w-full text-base">
          <thead>
            <tr>
              <th className="text-base">Feature</th>
              <th className="text-base">Importance</th>
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

  const aiDescText =
    "The explanation shows the importance of each feature towards the AIs prediction from 0 to 100.";

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Feature importances</h2>
        <p>{aiDescText}</p>
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
