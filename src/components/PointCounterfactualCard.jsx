"use client";
import React from "react";
import PointBar from "./PointBar";
import featureInfos from "../../public/data/feature_infos.json";
import { getFeatureBounds } from "@/utils/featureProcessor";
import { useAnswers } from "@/app/context/AnswersContext";

const SentencesPointCounterfactualCard = ({ pointCounterfactual }) => {
  const { preferredAreaMetric, formatFeatureForUI, formatPriceForUI } =
    useAnswers();
  let area = `m²`;
  let distance = `m`;
  if (preferredAreaMetric === "sqft") {
    area = `ft²`;
    distance = `ft`;
  }

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
              the lot would be{" "}
              {formatFeatureForUI(4, pointCounterfactual["lot-len"])} {distance}{" "}
              long and {formatFeatureForUI(5, pointCounterfactual["lot-width"])}{" "}
              {distance} wide,
            </li>
            <li>
              the living area would have{" "}
              {formatFeatureForUI(6, pointCounterfactual["house-area"])} {area}
            </li>
            <li>
              and the garden would have a size of{" "}
              {formatFeatureForUI(7, pointCounterfactual["garden-size"])} {area}
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
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

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
        {continuousFeatures.map((feature, index) => (
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
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

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
