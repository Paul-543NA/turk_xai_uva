import React from "react";
import featureInfos from "../../public/data/feature_infos.json";
import { useAnswers } from "@/app/context/AnswersContext";

const PropertyCard = () => {
  const { getCurrentHouse, formatFeatureLabelForUI, formatFeatureForUI } =
    useAnswers();
  const house = getCurrentHouse();

  return (
    <div className="card bg-base-300 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Property description</h2>
        {featureInfos.map((feature, index) => (
          <div key={index}>
            <p>
              {formatFeatureLabelForUI(feature)}:{" "}
              {formatFeatureForUI(feature, house[feature.name])}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCard;
