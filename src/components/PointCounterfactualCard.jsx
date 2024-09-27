"use client";
import React from "react";
import PointBar from "./PointBar";
import PointBarIntegers from "./PointBarIntegers";
import featureInfos from "../../public/data/feature_infos.json";
import { getFeatureBounds } from "@/utils/featureProcessor";
import { useAnswers } from "@/app/context/AnswersContext";

const SentencesPointCounterfactualCard = ({ pointCounterfactual }) => {
  const { formatFeatureForUI, formatPriceForUI, formatAreaLabel, formatDistanceLabel } =
    useAnswers();
    
  const findFeatureByName = (name) => {
    return featureInfos.find((feature) => feature.name === name);};

  let bathrooms = ``;
  if (pointCounterfactual["bathrooms"] === 1) {
    bathrooms = `bathroom`;
  } else bathrooms = `bathrooms`;

  let balconies = ``;
  if (pointCounterfactual["balcony"] === 1) {
    balconies = `balcony`;
  } else balconies = `balconies`;

  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <p>
          The AI would have predicted a price of at least{" "}
          <strong>{formatPriceForUI(50000)} lower</strong> than the currently
          predicted price if
          <ul className="list-disc list-inside leading-loose">
            <li>
              the living area would have{" "}
              {formatFeatureForUI(findFeatureByName('house-area'), pointCounterfactual["house-area"])} {formatAreaLabel()},
              {/* {formatFeatureForUI(feature, pointCounterfactual[feature.name])} */}
            </li>
            <li>
              the lot would be{" "}
              {formatFeatureForUI(findFeatureByName('lot-len'), pointCounterfactual["lot-len"])} {formatDistanceLabel()}{" "}
              long and {formatFeatureForUI(findFeatureByName('lot-width'), pointCounterfactual["lot-width"])}{" "}
              {formatDistanceLabel()} wide,
            </li>
            <li>
            the construction date would have been in{" "}
            {pointCounterfactual["buildyear"]},
            </li>
            <li>
              and the garden would have a size of{" "}
              {formatFeatureForUI(findFeatureByName('garden-size'), pointCounterfactual["garden-size"])} {formatAreaLabel()}
              .{" "}
            </li>
          </ul>
          <span></span>
          Besides, the house should have {pointCounterfactual["bathrooms"]}{" "}
          {bathrooms} and {pointCounterfactual["balcony"]} {balconies}.
        </p>
      </div>
    </div>
  );
};

const GraphPointCounterfactualCard = ({ house, pointCounterfactual }) => {
  const { formatFeatureLabelForUI, formatPriceForUI } = useAnswers();
  // const continuousFeatures = featureInfos.filter(
  //   (feature) => feature.type === "continuous"
  // );
  const featuresNumerical = ['house-area', 'lot-width', 'bathrooms', 'buildyear', 'lot-len', 'balcony', 'garden-size'];
  const continuousFeatures = ['house-area', 'lot-width', 'buildyear', 'lot-len', 'garden-size']
  const integerFeatures = ['bathrooms', 'balcony'];

  const findFeatureByName = (name) => {
    return featureInfos.find((feature) => feature.name === name);};
    
// Ensure the order of continousFeatures matches the one above
  const numericalFeatures = featuresNumerical.map((name) => findFeatureByName(name)).filter(Boolean);

  const FeatureBar = ({ feature }) => {
    const [min, max] = getFeatureBounds(
      feature,
      house[feature.name],
      pointCounterfactual[feature.name]
    );

    const { formatFeatureForUI } = useAnswers();

    const actualLabel = formatFeatureForUI(feature, house[feature.name]);
    console.log("actualLabel", actualLabel);
    const counterfactualLabel = formatFeatureForUI(
      feature,
      pointCounterfactual[feature.name]
    );

    // if its a continuous feature we show the bar, if it's integer we show individual circles
    if (continuousFeatures.includes(feature.name)){
      return (
        <div className="py-2">
          <p>{formatFeatureLabelForUI(feature)}</p>
          <PointBar
            counterfactual={pointCounterfactual[feature.name]}
            actual={house[feature.name]}
            counterfactualLabel={counterfactualLabel}
            actualLabel={actualLabel}
            featureMin={min}
            featureMax={max}
          />
        </div>
      );
    }
    else if (integerFeatures.includes(feature.name))
    {
      return (
        <div className="py-2">
          <p>{formatFeatureLabelForUI(feature)}</p>
          <div className="mt-5">
          <PointBarIntegers
            counterfactual={pointCounterfactual[feature.name]}
            actual={house[feature.name]}
            counterfactualLabel={counterfactualLabel}
            actualLabel={actualLabel}
            featureMin={min}
            featureMax={max}
          />
          </div>
        </div>
      );
    }
    
  };

  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <p>
          The explanation shows what value each feature needs to take on such
          that the AI would predict the price to be at least{" "}
          <strong>{formatPriceForUI(50000)} lower</strong> than the currently
          predicted price.
        </p>
        {numericalFeatures.map((feature, index) => (
          <FeatureBar key={index} feature={feature} />
        ))}
        {/* A div to explain the meaning of the colors */}
        <div className="py-6">
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
  const { formatFeatureForUI, formatFeatureLabelForUI, formatPriceForUI } =
    useAnswers();
  // const continuousFeatures = featureInfos.filter(
  //   (feature) => feature.type === "continuous"
  // );
  const featuresContinuous = ['house-area', 'lot-width', 'bathrooms', 'buildyear', 'lot-len', 'balcony', 'garden-size'];

  const findFeatureByName = (name) => {
    return featureInfos.find((feature) => feature.name === name);};
    
// Ensure the order of continousFeatures matches the one above
  const continuousFeatures = featuresContinuous.map((name) => findFeatureByName(name)).filter(Boolean);

  const tableRows = continuousFeatures.map((feature, index) => (
    <tr key={index}>
      <td>{formatFeatureLabelForUI(feature)}</td>
      <td>{formatFeatureForUI(feature, pointCounterfactual[feature.name])}</td>
    </tr>
  ));

  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <p>
          The explanation shows what value each feature needs to take on such
          that the AI would predict the price to be at least{" "}
          <strong>{formatPriceForUI(50000)} lower</strong> than the currently
          predicted price.
        </p>
        <table className="table table-compact pt-3 text-base">
          <thead>
            <tr>
              <th className="text-base">Feature</th>
              <th className="text-base">Value</th>
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
