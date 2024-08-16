"use client";
import React from "react";
import IntervalBar from "./IntervalBar";
import NotImplementedCard from "./NotImplementedCard";
import { getFeatureBounds } from "@/utils/featureProcessor";
import featureInfos from "../../public/data/feature_infos.json";

import { useAnswers } from "@/app/context/AnswersContext";

const SentencesIntervalCard = ({ intervalExplanation }) => {
  const { preferredAreaMetric, formatFeatureForUI, formatPriceForUI } =
    useAnswers();
  let area = `m²`;
  let distance = `m`;
  if (preferredAreaMetric === "sqft") {
    area = `ft²`;
    distance = `ft`;
  }
  let bathrooms = ``;
  if (
    intervalExplanation["bathrooms"].min != intervalExplanation["bathrooms"].max
  ) {
    bathrooms = `${intervalExplanation["bathrooms"].min} to ${intervalExplanation["bathrooms"].max} bathrooms`;
  } else if (intervalExplanation["bathrooms"].min === 1) {
    bathrooms = `${intervalExplanation["bathrooms"].min} bathroom`;
  } else {
    bathrooms = `${intervalExplanation["bathrooms"].min} bathrooms`;
  }
  let balconies = ``;
  if (
    intervalExplanation["balcony"].min != intervalExplanation["balcony"].max
  ) {
    balconies = `${intervalExplanation["balcony"].min} to ${intervalExplanation["balcony"].max} balconies`;
  } else if (intervalExplanation["balcony"].min === 1) {
    balconies = `${intervalExplanation["balcony"].min} balcony`;
  } else {
    balconies = `${intervalExplanation["balcony"].min} balconies`;
  }
  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        <h2 className="card-title">Interval Explanation</h2>
        {/* <p>The explanation shows in what range each feature needs to be so that the AI would predict the price to be ... higher than
          the currently predicted price.
        </p> */}
        <span></span>
        <p>
          The AI would have predicted a price of at least{" "}
          <strong>{formatPriceForUI(5000)} lower</strong> than the currently
          predicted price, if
          <ul className="list-disc list-inside leading-loose">
            <li>
              the lot would be between{" "}
              {formatFeatureForUI(4, intervalExplanation["lot-len"].min)}{" "}
              {distance} and {intervalExplanation["lot-len"].max} {distance}{" "}
              long,
            </li>
            <li>
              between {intervalExplanation["lot-width"].min} {distance} and{" "}
              {intervalExplanation["lot-width"].max} {distance} wide,{" "}
            </li>
            <li>
              the living area would be between{" "}
              {intervalExplanation["house-area"].min} {area} and{" "}
              {intervalExplanation["house-area"].max} {area} big,
            </li>
            <li>
              and the garden would have a size somewhere between{" "}
              {intervalExplanation["garden-size"].min} {area} and{" "}
              {intervalExplanation["garden-size"].max} {area}.{" "}
            </li>
          </ul>
          <span></span>
          Besides, the house should have {bathrooms} and {balconies}.
        </p>
      </div>
    </div>
  );
};

const GraphIntervalCard = ({ house, intervalExplanation }) => {
  const { formatPriceForUI, formatFeatureLabelForUI } = useAnswers();
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  const FeatureIntervalBar = ({ featureInfo }) => {
    const [min, max] = getFeatureBounds(
      featureInfo,
      house[featureInfo.name],
      undefined,
      intervalExplanation[featureInfo.name]
    );
    return (
      <div className="py-2">
        <p>{formatFeatureLabelForUI(featureInfo)}</p>
        <IntervalBar
          featurename={featureInfo.name}
          lower={intervalExplanation[featureInfo.name].min}
          actual={house[featureInfo.name]}
          upper={intervalExplanation[featureInfo.name].max}
          featureMin={min}
          featureMax={max}
        />
      </div>
    );
  };

  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        <h2 className="card-title">Interval counterfactual</h2>
        <p>
          The explanation shows in what range each feature needs to be so that
          the AI would predict the price to be at least{" "}
          <strong>{formatPriceForUI(50000)} lower</strong> than the currently
          predicted price.
        </p>
        {continuousFeatures.map((feature, index) => (
          <FeatureIntervalBar key={index} featureInfo={feature} />
        ))}
        {/* A div to explain the meaning of the colors */}
        <div className="py-6">
          <div className="flex flex-row gap-2 align-middle">
            <div className="bg-base-content w-6 h-6 rounded-full"></div>
            <p className="text-base-content">Actual value</p>
            <div className="bg-secondary w-12 h-6 rounded-full"></div>
            <p className="text-secondary">Counterfactual range</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableIntervalCard = ({ intervalExplanation }) => {
  const { formatFeatureForUI, formatPriceForUI, formatFeatureLabelForUI } =
    useAnswers();
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        <h2 className="card-title">Interval Explanation</h2>
        <p>
          The explanation shows in what range each feature needs to be so that
          the AI would predict the price to be at least{" "}
          <strong>{formatPriceForUI(50000)} lower</strong> than the currently
          predicted price.
        </p>
        <span></span>
        <table className="table table-compact text-base">
          <thead>
            <tr>
              <th className="text-base">Feature</th>
              <th className="text-base">Min</th>
              <th className="text-base">Max</th>
            </tr>
          </thead>
          <tbody>
            {continuousFeatures.map((feature) => (
              <tr key={feature}>
                {/* <td>{feature.label}</td> */}
                <td>{formatFeatureLabelForUI(feature)}</td>
                <td>
                  {formatFeatureForUI(
                    feature,
                    intervalExplanation[feature.name].min
                  )}
                </td>
                <td>
                  {formatFeatureForUI(
                    feature,
                    intervalExplanation[feature.name].max
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const IntervalCard = () => {
  const {
    getCurrentHouse,
    getCurrentIntervalCounterfactual,
    userExplanationViewMode,
  } = useAnswers();
  const house = getCurrentHouse();
  const intervalExplanation = getCurrentIntervalCounterfactual();
  const mode = userExplanationViewMode;

  // Raise an error is the mode is not "sentences", "graph", or "table"
  if (!["sentences", "graph", "table"].includes(mode)) {
    throw new Error(
      `Invalid mode: ${mode} not in ["sentences", "graph", "chat"]`
    );
  }

  // If the mode is "sentences", return the interval explanation as sentences
  if (mode === "sentences") {
    return <SentencesIntervalCard intervalExplanation={intervalExplanation} />;
  }
  if (mode === "graph") {
    return (
      <GraphIntervalCard
        house={house}
        intervalExplanation={intervalExplanation}
      />
    );
  }
  if (mode === "table") {
    return <TableIntervalCard intervalExplanation={intervalExplanation} />;
  }
  // Otherwise, return an error box with the message "Not implemented yet"
  return (
    <NotImplementedCard
      message={`Interval card mode "${mode}" is not implemented yet`}
    />
  );
};

export default IntervalCard;
