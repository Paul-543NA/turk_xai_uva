import React from "react";
import featureInfos from "../../public/data/featureInfos.json";
import { formatFeatureForUI } from "@/utils/featureProcessor";

const PropertyCard = ({ house }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Property description</h2>
        {featureInfos.map((feature, index) => (
          <div key={index}>
            <p>
              {feature.label}:{" "}
              {formatFeatureForUI(feature, house[feature.name])}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCard;
