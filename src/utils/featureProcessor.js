export function formatFeatureLabelForUI(featureInfo) {
  const preferredAreaMetric = localStorage.getItem("preferredAreaMetric");
  // Format the feature label for display in the UI
  // e.g. "1stFlrSF" -> "1st Floor Area (ft²)"
  const areaFeatures = ["house-area", "garden-size"];
  if (areaFeatures.includes(featureInfo.name)) {
    if (preferredAreaMetric === "sqm") {
      return `${featureInfo.label} (m²)`;
    }
    else return `${featureInfo.label} (ft²)`
  }

  const distanceFeatures = ["lot-len", "lot-width"];
  if (distanceFeatures.includes(featureInfo.name)) {
    if (preferredAreaMetric == 'sqm') {
      return `${featureInfo.label} (m)`;
    }
    else return `${featureInfo.label} (ft)`
  }
  return featureInfo.label;
}

export function formatFeatureForUI(featureInfo, value) {
  const preferredAreaMetric = localStorage.getItem("preferredAreaMetric");

  if (featureInfo.type === "categorical") {
    // For categorical features, return the category name
    return featureInfo.valueLabels[value];
  }
  if (featureInfo.type === "continuous") {
    // For continuous features, return the value as a string
    if (featureInfo.name === "buildyear") {
      // Except for dates that remain the same
      return Math.round(value).toString();
    }
    // Convert sqft to sqm
    const oneSqFtToSqm = 0.09290304;
    const oneSqmToSqFt = 10.7639;
    const areaFeatures = ["house-area", "garden-size"];
    if (areaFeatures.includes(featureInfo.name)) {
      if (preferredAreaMetric === "sqft") {
        return (value * oneSqmToSqFt).toFixed(2).toString()
      }
      else return `${value.toFixed(2)}`
      // else return Math.round(value,2).toString();
    }
    // Convert meters to feet
    const one_ft_to_m = 0.3048
    const one_m_to_ft = 3.281
    const distanceFeatures = ["lot-len", "lot-width"];
    if (distanceFeatures.includes(featureInfo.name)) {
      if (preferredAreaMetric == 'sqft') {
        return (value * one_m_to_ft).toFixed(2).toString()
      }
      else return `${value.toFixed(2)}`
    }
    // // Convert sqft to sqm
    // const oneSqFtToSqm = 0.09290304;
    // const oneSqmToSqFt = 10.7639;
    // const areaFeatures = ["house-area", "garden-size"];
    // if (areaFeatures.includes(featureInfo.name)) {
    //   return `${Math.round(value * oneSqmToSqFt)}`;
    // }

    // // Convert meters to feet
    // const one_ft_to_m = 0.3048
    // const one_m_to_ft = 3.281
    // const distanceFeatures = ["lot-len", "lot-width"];
    // if (distanceFeatures.includes(featureInfo.name)) {
    //   return `${Math.round(value * one_m_to_ft)}`;
    // }

    return Math.round(value).toLocaleString();
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

function formatCurrencyInput(value) {
  // Formats the number with thousands separators
  // e.g. 1000000 -> 1,000,000 or 1 000 000
  // Remove any non-digit characters except for the decimal point
  const preferredCurrency = localStorage.getItem("preferredCurrency");
  const split = preferredCurrency === "EUR" ? " " : ",";
  const cleanValue = value.replace(/[^\d.]/g, "");
  // Split the integer and decimal parts
  const [integerPart, decimalPart] = cleanValue.split(".");
  // Format the integer part with thousands separators
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    split
  );
  // Reassemble the number
  return decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

export function formatPriceForUI(price) {
  const preferredCurrency = localStorage.getItem("preferredCurrency");
  // The original price is in EUR, turn it into the preferred currency
  const conversionRates = {
    GBP: 0.85,
    EUR: 1,
    USD: 1.08,
  };
  const convertedPrice = Math.round(
    price / conversionRates[preferredCurrency]
  );
  const localeString = formatCurrencyInput(convertedPrice.toString());
  if (preferredCurrency === "GBP") {
    return `£${localeString}`;
  }
  if (preferredCurrency === "EUR") {
    return `${localeString} €`;
  }
  if (preferredCurrency === "USD") {
    return `$${localeString}`;
  }
}
