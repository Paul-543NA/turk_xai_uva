import React from "react";
import PropTypes from "prop-types";

const PointBar = ({
  actual,
  counterfactual,
  featureMin = 9,
  featureMax = 100,
  featureSuffix = "",
}) => {
  const ProgressCircle = ({ position }) => (
    <div
      className="absolute bg-neutral-content bg-opacity-100 h-4 w-4 z-10 rounded-full"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-50%)",
      }}
    />
  );

  const CounterfactualCircle = ({ position }) => (
    <div
      className="absolute bg-secondary bg-opacity-100 h-4 w-4 z-10 rounded-full"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-75%)",
      }}
    />
  );

  const CounterfactualLabel = ({ position, label }) => (
    <p
      className="absolute text-secondary opacity-100 z-10"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-75%)",
      }}
    >
      {label}
    </p>
  );

  const ProgressLabel = ({ position, label }) => (
    <p
      className="absolute text-base-content opacity-100 z-10"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-50%)",
      }}
    >
      {label}
    </p>
  );

  const scaledCounterfactual =
    ((counterfactual - featureMin) / (featureMax - featureMin)) * 100;
  const scaledActual =
    ((actual - featureMin) / (featureMax - featureMin)) * 100;

  // Case values to string and add the label suffix
  const counterfactualLabel = counterfactual.toString() + featureSuffix;
  const actualLabel = actual.toFixed(2).toString() + featureSuffix;

  return (
    <div className="w-full p-2">
      {/* Progress labels */}
      <div className="relative w-full bg-transparent rounded-full py-3">
        <CounterfactualLabel
          position={scaledCounterfactual}
          label={counterfactualLabel}
        />
        {/* <ProgressLabel position={scaledActual} label={actualLabel} /> */}
      </div>

      {/* Progress bar itself */}
      <div className="relative w-full bg-base-content bg-opacity-50 rounded-full h-4">
        <ProgressCircle position={scaledActual} />
        <CounterfactualCircle position={scaledCounterfactual} />
      </div>

        {/* Progress labels */}
          <div className="relative w-full bg-transparent rounded-full py-3">
          <ProgressLabel position={scaledActual} label={actualLabel} />
        </div>
    </div>
  );
};

PointBar.propTypes = {
  actual: PropTypes.number.isRequired,
  counterfactual: PropTypes.number.isRequired,
};

export default PointBar;
