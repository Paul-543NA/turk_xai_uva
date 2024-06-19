import React from "react";
import featureInfos from "../../public/data/feature_infos.json";
import { formatFeatureForUI } from "@/utils/featureProcessor";
import { useAnswers } from "@/app/context/AnswersContext";

const PropertyCard = () => {
  const { getCurrentHouse } = useAnswers();
  const house = getCurrentHouse();

  console.log(house);

  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
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
