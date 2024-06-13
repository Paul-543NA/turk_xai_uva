import React from "react";
import PropTypes from "prop-types";

const IntervalBar = ({
  lower,
  actual,
  upper,
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
  const IntervalHighlightBar = ({ start, end }) => (
    <div
      className="absolute bg-secondary bg-opacity-100 h-4 w-4 z-10 rounded-full"
      style={{
        left: `${start}%`,
        width: `${end - start}%`,
        top: "0",
      }}
    />
  );

  const IntervalEndLabel = ({ position, label }) => (
    <p
      className="absolute text-secondary opacity-100 z-10"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-50%)",
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

  const scaledLower = ((lower - featureMin) / (featureMax - featureMin)) * 100;
  const scaledUpper = ((upper - featureMin) / (featureMax - featureMin)) * 100;
  const scaledActual =
    ((actual - featureMin) / (featureMax - featureMin)) * 100;

  // Case values to string and add the label suffix
  const lowerLabel = lower.toString() + featureSuffix;
  const actualLabel = actual.toString() + featureSuffix;
  const upperLabel = upper.toString() + featureSuffix;

  return (
    <div className="w-full p-2">
      {/* Progress labels */}
      <div className="relative w-full bg-transparent rounded-full py-3">
        <IntervalEndLabel position={scaledLower} label={lowerLabel} />
        <ProgressLabel position={scaledActual} label={actualLabel} />
        <IntervalEndLabel position={scaledUpper} label={upperLabel} />
      </div>

      {/* Progress bar itself */}
      <div className="relative w-full bg-base-content bg-opacity-50 rounded-full h-4">
        <IntervalHighlightBar start={scaledLower} end={scaledUpper} />
        <ProgressCircle position={scaledActual} />
      </div>
    </div>
  );
};

IntervalBar.propTypes = {
  lower: PropTypes.number.isRequired,
  actual: PropTypes.number.isRequired,
  upper: PropTypes.number.isRequired,
};

export default IntervalBar;
