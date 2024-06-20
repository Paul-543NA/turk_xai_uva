export function formatFeatureForUI(featureInfo, value) {
  if (featureInfo.type === "categorical") {
    // For categorical features, return the category name
    return featureInfo.valueLabels[value];
  }
  if (featureInfo.type === "continuous") {
    // For continuous features, return the value as a string
    if (featureInfo.name === "YearBuilt") {
      // Except for dates that remain the same
      return value.toString();
    }
    return value.toLocaleString();
  }

  // For other types of values (e.g., dates), return the original value
  return value;
}

export function getFeatureBounds(
  featureInfo,
  actual,
  counterfactualPoint,
  counterfactualInterval
) {
  // Check the inputs
  if (featureInfo.type === "categorical") {
    // Raises an error, this should not be called on categorical features
    throw new Error(
      `Cannot get bounds for categorical features, got ${featureInfo.name} of type ${featureInfo.type}`
    );
  }
  // Only one of the point or interval counterfactual values should be provided
  if (
    (counterfactualPoint === undefined) ===
    (counterfactualInterval === undefined)
  ) {
    throw new Error(
      `Exactly one of counterfactualPoint or counterfactualInterval should be provided, got point ${counterfactualPoint} and interval ${counterfactualInterval}`
    );
  }

  // If the feature info has bounds, return them
  if (featureInfo.min !== null && featureInfo.max !== null) {
    let dataMin = actual;
    let dataMax = actual;
    if (counterfactualInterval !== undefined) {
      dataMin = Math.min(actual, counterfactualInterval.min);
      dataMax = Math.max(actual, counterfactualInterval.max);
    } else if (counterfactualPoint !== undefined) {
      dataMin = Math.min(actual, counterfactualPoint);
      dataMax = Math.max(actual, counterfactualPoint);
    }
    const min = Math.min(dataMin, featureInfo.min);
    const max = Math.max(dataMax, featureInfo.max);
    return [min, max];
  }

  // At this point, we have a valid feature that is continuous and has no set bounds

  // Compute bounds for an interval counterfactual
  if (counterfactualInterval !== undefined) {
    const min = Math.min(
      actual,
      counterfactualInterval.min,
      counterfactualInterval.max
    );
    const max = Math.max(actual, counterfactualInterval.max);
    return [0.9 * min, 1.1 * max];
  }

  // At this point we have a point counterfactual with no set bounds
  const min = Math.min(actual, counterfactualPoint);
  const max = Math.max(actual, counterfactualPoint);
  return [0.9 * min, 1.1 * max];
}

export const formatNumber = (value) => {
  // Formats the number with thousands separators
  // e.g. 1000000 -> 1,000,000
  // Remove any non-digit characters except for the decimal point
  const cleanValue = value.replace(/[^\d.]/g, "");
  // Split the integer and decimal parts
  const [integerPart, decimalPart] = cleanValue.split(".");
  // Format the integer part with thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Reassemble the number
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
