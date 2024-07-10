import React from "react";
import PropTypes from "prop-types";

const IntervalBar = ({
  featurename,
  lower,
  actual,
  upper,
  featureMin = 9,
  featureMax = 100,
  featureSuffix = "",
}) => {
  const ProgressCircle = ({ position }) => (
    <div
      className="absolute bg-base-content bg-opacity-100 h-4 w-4 z-10 rounded-full"
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
  const IntervalHighlightCircle = ({ position }) => (
    <div
      className="absolute bg-secondary bg-opacity-100 h-4 w-4 z-10 rounded-full"
      style={{
        left: `${position}%`,
        top: "0",
        transform: "translateX(-75%)",
      }}
    />
  );

  const IntervalEndLabel = ({ position, label }) => {
    let adjustedPosition = position;
    let translationValue = 50;
    // If the label is long, move it closer to the center
    if (label.length > 7 && position > 75) {
      adjustedPosition = 75;
      translationValue = 0;
    }
    if (label.length > 11 && position > 60) {
      adjustedPosition = 60;
      translationValue = 0;
    }
    if (label.length > 13 && position > 55) {
      adjustedPosition = 55;
      translationValue = 0;
    }
    return (
      <p
        className="absolute text-secondary opacity-100 z-10"
        style={{
          left: `${adjustedPosition}%`,
          top: "0",
          transform: `translateX(-${translationValue}%)`,
        }}
      >
        {label}
      </p>
    );
  };

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
  let lowerLabel, actualLabel, upperLabel;
  const integerFeatures = ["buildyear", "bathrooms", "balcony"];
  if (integerFeatures.includes(featurename)) {
    lowerLabel = lower.toString() + featureSuffix;
    actualLabel = actual.toString() + featureSuffix;
    upperLabel = upper.toString() + featureSuffix;
  } 
  else {
    lowerLabel = lower.toFixed(2).toString() + featureSuffix;
    actualLabel = actual.toFixed(2).toString() + featureSuffix;
    upperLabel = upper.toFixed(2).toString() + featureSuffix;
  }

  // const lowerLabel = lower.toString() + featureSuffix;
  // const actualLabel = Math.round(actual).toString() + featureSuffix;
  // const upperLabel = upper.toString() + featureSuffix;

  if (lower == upper) {
    return (
      <div className="w-full p-2">
        {/* Progress labels */}
        <div className="relative w-full bg-transparent rounded-full py-3">
          <IntervalEndLabel
            position={(scaledLower + scaledUpper) / 2}
            label={`${lowerLabel}`}
          />
        </div>
  
        {/* Progress bar itself */}
        <div className="relative w-full bg-base-content bg-opacity-20 dark:bg-opacity-50 rounded-full h-4">
          <ProgressCircle position={scaledActual} />
          {/* <IntervalHighlightBar start={scaledLower} end={scaledUpper} /> */}
          <IntervalHighlightCircle position={scaledLower}  />
        </div>
  
        {/* Progress labels */}
        <div className="relative w-full bg-transparent rounded-full py-3">
          <ProgressLabel position={scaledActual} label={actualLabel} />
        </div>
      </div>
    )
  }
  else 
    return (
      <div className="w-full p-2">
        {/* Progress labels */}
        <div className="relative w-full bg-transparent rounded-full py-3">
          <IntervalEndLabel
            position={(scaledLower + scaledUpper) / 2}
            label={`${lowerLabel} - ${upperLabel}`}
          />
        </div>

        {/* Progress bar itself */}
        <div className="relative w-full bg-base-content bg-opacity-20 dark:bg-opacity-50 rounded-full h-4">
          <IntervalHighlightBar start={scaledLower} end={scaledUpper} />
          <ProgressCircle position={scaledActual} />
        </div>

        {/* Progress labels */}
        <div className="relative w-full bg-transparent rounded-full py-3">
          <ProgressLabel position={scaledActual} label={actualLabel} />
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
