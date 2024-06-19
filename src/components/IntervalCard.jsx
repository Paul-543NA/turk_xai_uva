import React from "react";
import IntervalBar from "./IntervalBar";
import NotImplementedCard from "./NotImplementedCard";
import { formatFeatureForUI, getFeatureBounds } from "@/utils/featureProcessor";
import featureInfos from "../../public/data/feature_infos.json";
import { useAnswers } from "@/app/context/AnswersContext";

const SentencesIntervalCard = ({ intervalExplanation }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Interval Explanation</h2>
        <p>
          The property should be {intervalExplanation["LotArea"].min} to{" "}
          {intervalExplanation["LotArea"].max} sq ft (with{" "}
          {intervalExplanation["1stFlrSF"].min} to{" "}
          {intervalExplanation["1stFlrSF"].max} sq ft on the first floor, and{" "}
          {intervalExplanation["1stFlrSF"].min} to{" "}
          {intervalExplanation["1stFlrSF"].max} on the second). It should have{" "}
          been build between {intervalExplanation["YearBuilt"].min} and{" "}
          {intervalExplanation["YearBuilt"].max}, have{" "}
          {intervalExplanation["TotRmsAbvGrd"].min} to{" "}
          {intervalExplanation["TotRmsAbvGrd"].max} total rooms, of which{" "}
          {intervalExplanation["BedroomAbvGr"].min} to{" "}
          {intervalExplanation["BedroomAbvGr"].max} bedrooms and{" "}
          {intervalExplanation["FullBath"].min} to{" "}
          {intervalExplanation["FullBath"].max} bathrooms. It should also have{" "}
          {intervalExplanation["Fireplaces"].min} to{" "}
          {intervalExplanation["Fireplaces"].max} fireplaces.
        </p>
      </div>
    </div>
  );
};

const GraphIntervalCard = ({ house, intervalExplanation }) => {
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
        <p>{featureInfo.label}</p>
        <IntervalBar
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
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Interval counterfactual</h2>
        {continuousFeatures.map((feature, index) => (
          <FeatureIntervalBar key={index} featureInfo={feature} />
        ))}
      </div>
    </div>
  );
};

const TableIntervalCard = ({ intervalExplanation }) => {
  const continuousFeatures = featureInfos.filter(
    (feature) => feature.type === "continuous"
  );

  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Interval Explanation</h2>
        <table className="table table-compact">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {continuousFeatures.map((feature) => (
              <tr key={feature}>
                <td>{feature.label}</td>
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
