import React from "react";
import PropTypes from "prop-types";

const PointBarForIntegers = ({
  actual,
  counterfactual,
  counterfactualLabel,
  actualLabel,
  featureMin = 0,
  featureMax = 5,
}) => {
  // Create an array for the integer values from featureMin to featureMax
  const integerValues = [];
  for (let i = featureMin; i <= featureMax; i++) {
    integerValues.push(i);
  }

  const NormalCircle = ({ position, isActual, isCounterfactual, actual, counterfactual }) => (
    <div
      className="relative bg-base-content bg-opacity-20 dark:bg-opacity-50 h-4 w-4 z-10 rounded-full"
      style={{
        left: `${position}%`,
        top: "0",
      }}
    >
    {isActual && (
      <>
        <div
          className="absolute bg-base-content bg-opacity-100 h-4 w-4 z-10 rounded-full"
          style={{
            left: `${position}%`,
            top: "0",
          }}
        />
        {/* Label underneath the actual circle */}
        <p
          className="absolute text-base opacity-100 z-10"
          style={{
            left: `${position}%`,
            top: "20px", // Adjust as needed for label positioning below the circle
            transform: "translateX(50%)", // Use -50% for centering beneath the circle
          }}
        >
          {actualLabel}
        </p>
      </>
    )}
    {isCounterfactual && (
      <>
        <div
          className="absolute bg-secondary bg-opacity-100 h-4 w-4 z-10 rounded-full"
          style={{
            left: `${position}%`,
            transform: counterfactual==actual? "translateX(-40%)" : "translateX(0%)",
            top: "0",
          }}
        />
        {/* Label underneath the counterfactual circle */}
        <p
          className="absolute text-secondary opacity-100 z-10"
          style={{
            left: `${position}%` ,
            top: "-25px", // Adjust as needed for label positioning below the circle
            transform: counterfactual==actual? "translateX(-30%)" : "translateX(50%)", // Use -50% for centering beneath the circle
          }}
        >
          {counterfactualLabel}
        </p>
      </>
    )}
    </div>
  );


  const getPosition = (value) =>
    ((value - featureMin) / (featureMax - featureMin))*0.5;


  return (
    <div className="w-full p-2">
      {/* Integer circles */}
      <div className="relative w-full flex justify-between">
        {integerValues.map((value) => (
          <NormalCircle
            // key={value}
            value={value}
            position={getPosition(value)}
            isActual={value === actual}
            isCounterfactual={value === counterfactual}
            actual = {actual}
            counterfactual={counterfactual}
          />
        ))}
      </div>      
    </div>
  );
};

PointBarForIntegers.propTypes = {
  actual: PropTypes.number.isRequired,
  counterfactual: PropTypes.number.isRequired,
  counterfactualLabel: PropTypes.string.isRequired,
  actualLabel: PropTypes.string.isRequired,
  featureMin: PropTypes.number,
  featureMax: PropTypes.number,
};

export default PointBarForIntegers;
