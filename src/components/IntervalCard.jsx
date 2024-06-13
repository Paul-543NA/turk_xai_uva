import React from "react";
import IntervalBar from "./IntervalBar";
import NotImplementedCard from "./NotImplementedCard";

const SentencesIntervalCard = ({ intervalExplanation }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Interval Explanation</h2>
        <p>
          The place should have an area between{" "}
          {intervalExplanation["Area in sq ft"].min.toLocaleString()} and{" "}
          {intervalExplanation["Area in sq ft"].max.toLocaleString()} sq ft, as
          well as {intervalExplanation["No. of Bedrooms"].min.toLocaleString()}{" "}
          to {intervalExplanation["No. of Bedrooms"].max.toLocaleString()}{" "}
          bedrooms,{" "}
          {intervalExplanation["No. of Bathrooms"].min.toLocaleString()} to{" "}
          {intervalExplanation["No. of Bathrooms"].max.toLocaleString()}{" "}
          bathrooms, and{" "}
          {intervalExplanation["No. of Receptions"].min.toLocaleString()} to{" "}
          {intervalExplanation["No. of Receptions"].max.toLocaleString()}{" "}
          receptions.
        </p>
      </div>
    </div>
  );
};

const GraphIntervalCard = ({ property, intervalExplanation }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Interval counterfactual</h2>

        <div className="pb-2">
          <p>Area: (sq ft)</p>
          <IntervalBar
            lower={intervalExplanation["Area in sq ft"].min}
            actual={property["Area in sq ft"]}
            upper={intervalExplanation["Area in sq ft"].max}
            featureMin={
              Math.min(
                property["Area in sq ft"],
                intervalExplanation["Area in sq ft"].min
              ) * 0.9
            }
            featureMax={
              Math.max(
                property["Area in sq ft"],
                intervalExplanation["Area in sq ft"].max
              ) * 1.1
            }
          />
        </div>

        <div className="py-2">
          <p>Number of bedrooms</p>
          <IntervalBar
            lower={intervalExplanation["No. of Bedrooms"].min}
            actual={property["No. of Bedrooms"]}
            upper={intervalExplanation["No. of Bedrooms"].max}
            featureMin={0}
            featureMax={7}
          />
        </div>

        <div className="py-2">
          <p>Number of bathrooms</p>
          <IntervalBar
            lower={intervalExplanation["No. of Bathrooms"].min}
            actual={property["No. of Bathrooms"]}
            upper={intervalExplanation["No. of Bathrooms"].max}
            featureMin={0}
            featureMax={7}
          />
        </div>

        <div className="py-2">
          <p>Number of receptions </p>
          <IntervalBar
            lower={intervalExplanation["No. of Receptions"].min}
            actual={property["No. of Receptions"]}
            upper={intervalExplanation["No. of Receptions"].max}
            featureMin={0}
            featureMax={7}
          />
        </div>
      </div>
    </div>
  );
};

const TableIntervalCard = ({ intervalExplanation }) => {
  const features = [
    "Area in sq ft",
    "No. of Bedrooms",
    "No. of Bathrooms",
    "No. of Receptions",
  ];

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
            {features.map((feature) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td>{intervalExplanation[feature].min.toLocaleString()}</td>
                <td>{intervalExplanation[feature].max.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const IntervalCard = ({ property, intervalExplanation, mode = "table" }) => {
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
        property={property}
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
