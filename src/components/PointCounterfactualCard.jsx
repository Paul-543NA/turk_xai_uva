import React from "react";
import PointBar from "./PointBar";

const SentencesPointCounterfactualCard = ({ pointCounterfactual }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <p>
          The property is {pointCounterfactual["Area in sq ft"]} sq ft big, has{" "}
          {pointCounterfactual["No. of Bedrooms"]} bedrooms,
          {pointCounterfactual["No. of Bathrooms"]} bathrooms, and{" "}
          {pointCounterfactual["No. of Receptions"]} receptions
        </p>
      </div>
    </div>
  );
};

const GraphPointCounterfactualCard = ({ property, pointCounterfactual }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Point counterfactual</h2>
        <div className="py-2">
          <p>Number of bedrooms</p>
          <PointBar
            counterfactual={pointCounterfactual["No. of Bedrooms"]}
            actual={property["No. of Bedrooms"]}
            featureMin={0}
            featureMax={7}
          />
        </div>
        <div className="py-2">
          <p>Number of bathrooms</p>
          <PointBar
            counterfactual={pointCounterfactual["No. of Bedrooms"]}
            actual={property["No. of Bathrooms"]}
            featureMin={0}
            featureMax={7}
          />
        </div>
        <div className="py-2">
          <p>Number of bedrooms</p>
          <PointBar
            counterfactual={pointCounterfactual["No. of Receptions"]}
            actual={property["No. of Receptions"]}
            featureMin={0}
            featureMax={7}
          />
        </div>
      </div>
    </div>
  );
};

const TablePointCounterfactualCard = ({ pointCounterfactual }) => {
  const features = [
    "Area in sq ft",
    "No. of Bedrooms",
    "No. of Bathrooms",
    "No. of Receptions",
  ];
  const tableRows = features.map((feature, index) => (
    <tr key={index}>
      <td>{feature}</td>
      <td>{pointCounterfactual[feature]}</td>
    </tr>
  ));

  return (
    <div className="card bg-base-100 shadow-xl m-4">
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

const PointCounterfactualCard = ({
  property,
  pointCounterfactual,
  mode = "table",
}) => {
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
        property={property}
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
