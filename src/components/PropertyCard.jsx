import React, { useState } from "react";
import featureInfos from "../../public/data/feature_infos.json";
import { useAnswers } from "@/app/context/AnswersContext";

const PropertyCard = ({ isExpanded, setIsExpanded }) => {
  const {
    getCurrentHouse,
    formatFeatureLabelForUI,
    formatFeatureForUI,
    currentPhase,
    formatPriceForUI,
    getAIPrediction,
  } = useAnswers();
  const house = getCurrentHouse();

  // State to manage whether additional features are visible
//   const [isExpanded, setIsExpanded] = useState(false);

  // Limit the number of features displayed initially
  const featuresToShow = 5;

  // Toggle the expanded state
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

//   const featuresToShowInitially = ['house-area', 'lot-width', 'bathrooms', 'monument', 'buildyear'];
//   const featuresInExpandable = ['lot-len', 'energy-eff ', 'balcony', 'garden-size', 'zipcode'];

//   const findFeatureByName = (name) => {
//     return featureInfos.find((feature) => feature.name === name);
//   };

//   const initialFeatures = featureInfos.filter((feature) => 
//     featuresToShowInitially.includes(feature.name)
//   );
//   const expandableFeatures = featureInfos.filter((feature) =>
//     featuresInExpandable.includes(feature.name)
//   );

  const featuresToShowInitially = ['house-area', 'lot-width', 'bathrooms', 'monument', 'buildyear'];
  const featuresInExpandable = ['lot-len', 'energy-eff', 'balcony', 'garden-size', 'zipcode'];
  
  const findFeatureByName = (name) => {
    return featureInfos.find((feature) => feature.name === name);};
    
// Ensure the order of initialFeatures matches featuresToShowInitially
  const initialFeatures = featuresToShowInitially.map((name) => findFeatureByName(name)).filter(Boolean);

// Ensure the order of expandableFeatures matches featuresInExpandable
  const expandableFeatures = featuresInExpandable.map((name) => findFeatureByName(name)).filter(Boolean);


  return (
    <div className="card bg-base-300 shadow-xl lg:m-4">
      <div className="card-body">
        <h2 className="card-title">Property description</h2>

        {/* Display the first 5 features */}
        {/* {featureInfos.slice(0, featuresToShow).map((feature, index) => ( */}
        {initialFeatures.map((feature, index) => (
          <div key={index}>
            <p>
              {formatFeatureLabelForUI(feature)}:{" "}
              {formatFeatureForUI(feature, house[feature.name])}
            </p>
          </div>
        ))}

        {/* Expandable section for additional features */}
        {/* {isExpanded && (
          featureInfos.slice(featuresToShow).map((feature, index) => ( */}
        {isExpanded && (
          expandableFeatures.map((feature, index) => (
            <div key={index + featuresToShow}>
              <p>
                {formatFeatureLabelForUI(feature)}:{" "}
                {formatFeatureForUI(feature, house[feature.name])}
              </p>
            </div>
          ))
        )}

        {/* Toggle button for showing/hiding extra features */}
        <button
          className="mt-2 text-blue-500 underline cursor-pointer flex items-center"
          onClick={toggleExpanded}
        >
          {isExpanded ? (
            <span>&#9660; Show less</span> // Downward arrow
          ) : (
            <span>&#9654; Show more</span> // Rightward arrow
          )}
        </button>

        {/* AI-predicted house price */}
        {currentPhase === "0" ? (
          <p className="mt-6">
            The AI predicts the house to be:{" "}
            <strong>{formatPriceForUI(getAIPrediction())}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyCard;
