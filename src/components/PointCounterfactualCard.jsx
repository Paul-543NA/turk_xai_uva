import React from "react";
import PointBar from "./PointBar";
import featureInfos from "../../public/data/feature_infos.json";
import { formatFeatureForUI, getFeatureBounds } from "@/utils/featureProcessor";
import { useAnswers } from "@/app/context/AnswersContext";

const SentencesPointCounterfactualCard = ({ pointCounterfactual }) => {
  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <p>
          The property is a {pointCounterfactual["BldgType"]} on a{" "}
          {pointCounterfactual["Street"]} street. It is{" "}
          {pointCounterfactual["LotArea"]} sq ft big built in{" "}
          {pointCounterfactual["YearBuilt"]} with{" "}
          {pointCounterfactual["TotRmsAbvGrd"]} rooms in total including{" "}
          {pointCounterfactual["BedroomAbvGr"]} bedrooms and{" "}
          {pointCounterfactual["FullBath"]} bathrooms. The property has{" "}
          {pointCounterfactual["Fireplaces"]} fireplaces and{" "}
          {pointCounterfactual["CentralAir"] === "Y" ? "" : "no"} central air
          conditioning. The floors are divided into{" "}
          {pointCounterfactual["1stFlrSF"]} sq ft on the first floor and{" "}
          {pointCounterfactual["2ndFlrSF"]} sq ft on the second floor.
        </p>
      </div>
    </div>
  );
};

const GraphPointCounterfactualCard = ({ house, pointCounterfactual }) => {
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  const FeatureBar = ({ feature }) => {
    const [min, max] = getFeatureBounds(
      feature,
      house[feature.name],
      pointCounterfactual[feature.name]
    );

    return (
      <div className="py-2">
        <p>{feature.label}</p>
        <PointBar
          counterfactual={pointCounterfactual[feature.name]}
          actual={house[feature.name]}
          featureMin={min}
          featureMax={max}
        />
      </div>
    );
  };

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        {continuousFeatures.map((feature, index) => (
          <FeatureBar key={index} feature={feature} />
        ))}
        {/* A div to explain the meaning of the colors */}
        <div className="py-2">
          <div className="flex flex-row gap-2 align-middle">
            <div className="bg-base-content w-6 h-6 rounded-full"></div>
            <p className="text-base-content">Actual value</p>
            <div className="bg-secondary w-6 h-6 rounded-full"></div>
            <p className="text-secondary">Counterfactual</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TablePointCounterfactualCard = ({ pointCounterfactual }) => {
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  const tableRows = continuousFeatures.map((feature, index) => (
    <tr key={index}>
      <td>{feature.label}</td>
      <td>{formatFeatureForUI(feature, pointCounterfactual[feature.name])}</td>
    </tr>
  ));

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <table className="table table-zebra pt-3">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
};

const PointCounterfactualCard = () => {
  const {
    getCurrentHouse,
    getCurrentPointCounterfactual,
    userExplanationViewMode,
  } = useAnswers();
  const house = getCurrentHouse();
  const pointCounterfactual = getCurrentPointCounterfactual();
  const mode = userExplanationViewMode;

  // Raise an error is the mode is not "sentences", "graph", or "table"
  if (!["sentences", "graph", "table"].includes(mode)) {
    throw new Error(
      `Invalid mode: ${mode} not in ["sentences", "graph", "chat"]`
    );
  }

  if (mode === "sentences") {
    return (
      <SentencesPointCounterfactualCard
        pointCounterfactual={pointCounterfactual}
      />
    );
  } else if (mode === "graph") {
    return (
      <GraphPointCounterfactualCard
        house={house}
        pointCounterfactual={pointCounterfactual}
      />
    );
  } else {
    return (
      <TablePointCounterfactualCard pointCounterfactual={pointCounterfactual} />
    );
  }
};

export default PointCounterfactualCard;
