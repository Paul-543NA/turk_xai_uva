"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import houses from "../../../public/data/houses.json";
import pointCounterfactuals from "../../../public/data/point_counterfactuals.json";
import intervalCounterfactuals from "../../../public/data/interval_counterfactuals.json";
import featureImportances from "../../../public/data/feature_importances.json";
import db from "@/utils/firestore";
import { doc, setDoc } from "firebase/firestore";

const AnswersContext = createContext();

export const useAnswers = () => {
  return useContext(AnswersContext);
};

export const AnswersProvider = ({ children }) => {
  // =============================================================================
  // SECTION - STATE
  // =============================================================================

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || uuidv4();
  });
  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  const [currentPhase, setCurrentPhase] = useState(() => {
    return localStorage.getItem("currentPhase") || "0";
  });
  useEffect(() => {
    localStorage.setItem("currentPhase", currentPhase);
  }, [currentPhase]);

  const [userExplanationType, setUserExplanationType] = useState(() => {
    return localStorage.getItem("userExplanationType") || "featureImportance";
  });
  useEffect(() => {
    let storedUserExplanationType = localStorage.getItem("userExplanationType");
    localStorage.setItem("userExplanationType", userExplanationType);
  }, [userExplanationType]);

  const [userExplanationViewMode, setUserExplanationViewMode] = useState(() => {
    return localStorage.getItem("userExplanationViewMode") || "sentences";
  });
  useEffect(() => {
    localStorage.setItem("userExplanationViewMode", userExplanationViewMode);
  }, [userExplanationViewMode]);

  const [currentQuestion, setCurrentQuestion] = useState(() => {
    return parseInt(localStorage.getItem("currentQuestion")) || 0;
  });
  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion);
  }, [currentQuestion]);

  const [showingFeedback, setShowingFeedback] = useState(() => {
    const saved = localStorage.getItem("showingFeedback");
    return saved === "true" ? true : false;
  });
  useEffect(() => {
    localStorage.setItem("showingFeedback", showingFeedback);
  }, [showingFeedback]);

  const [answers, setAnswers] = useState(() => {
    return JSON.parse(localStorage.getItem("answers")) || {};
  });
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  // Tracks the preferred area metric, can be "sqm" or "sqft"
  const [preferredAreaMetric, setPreferredAreaMetric] = useState(() => {
    return localStorage.getItem("preferredAreaMetric") || "sqft";
  });
  useEffect(() => {
    localStorage.setItem("preferredAreaMetric", preferredAreaMetric);
  }, [preferredAreaMetric]);

  // Tracks the preferred currency, can be "GBP", "EUR", or "USD"
  const [preferredCurrency, setPreferredCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "EUR";
  });
  useEffect(() => {
    localStorage.setItem("preferredCurrency", preferredCurrency);
  }, [preferredCurrency]);

  const explanationTypes = ["none", "point", "interval", "featureImportance"];
  const explanationViewModes = ["sentences", "graph", "table"];
  const phases = ["0", "1", "2"];
  const questionsPerPhase = [5, 5, 5];

  function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // =============================================================================
  // SECTION - GETTERS
  // =============================================================================

  function getCurrentHouse() {
    return houses[currentQuestion];
  }

  function getCurrentPointCounterfactual() {
    return pointCounterfactuals[currentQuestion];
  }

  function getCurrentIntervalCounterfactual() {
    return intervalCounterfactuals[currentQuestion];
  }

  function getCurrentFeatureImportances() {
    const importances = featureImportances[currentQuestion];
    // Multiply the importances by 100 and round tjem to integers
    return Object.fromEntries(
      Object.entries(importances).map(([key, value]) => [
        key,
        Math.round(value * 100),
      ])
    );
  }

  function getCurrentHousePrice() {
    return getCurrentHouse().SalePrice;
  }

  function getAIPrediction() {
    return getCurrentHouse()["predicted-price"];
  }

  function getCurrentPhaseProgress() {
    // Returns a number between 0 and 1 representing the progress of the current phase
    let totalQuestionsSoFar = 0;
    for (let i = 0; i < phases.length; i++) {
      totalQuestionsSoFar += questionsPerPhase[i];
      if (currentQuestion < totalQuestionsSoFar) {
        const questionsInPreviousPhases =
          totalQuestionsSoFar - questionsPerPhase[i];
        return (
          (currentQuestion - questionsInPreviousPhases) / questionsPerPhase[i]
        );
      }
    }
    return 0;
  }

  function getCurrencySymbol() {
    const symbols = {
      GBP: "£",
      EUR: "€",
      USD: "$",
    };
    return symbols[preferredCurrency];
  }

  // ===========================================================================
  // SECTION - UI FORMATTING
  // ===========================================================================

  function formatFeatureLabelForUI(featureInfo) {
    // Format the feature label for display in the UI
    // e.g. "1stFlrSF" -> "1st Floor Area (ft²)"
    const areaFeatures = ["LotArea", "1stFlrSF", "2ndFlrSF"];
    if (areaFeatures.includes(featureInfo.name)) {
      console.log("preferredAreaMetric", preferredAreaMetric);
      if (preferredAreaMetric === "sqm") {
        return `${featureInfo.label} (m²)`;
      }
      return `${featureInfo.label} (ft²)`;
    }
    return featureInfo.label;
  }

  function formatFeatureForUI(featureInfo, value) {
    if (featureInfo.type === "categorical") {
      // For categorical features, return the category name
      return featureInfo.valueLabels[value];
    }
    if (featureInfo.type === "continuous") {
      // For continuous features, return the value as a string
      if (featureInfo.name === "YearBuilt") {
        // Except for dates that remain the same
        return Math.round(value).toString();
      }
      // Convert sqft to sqm
      const oneSqFtToSqm = 0.09290304;
      const areaFeatures = ["LotArea", "1stFlrSF", "2ndFlrSF"];
      if (areaFeatures.includes(featureInfo.name)) {
        return formatCurrencyInput(Math.round(value * oneSqFtToSqm).toString());
      }
      return value.toLocaleString();
    }

    // For other types of values (e.g., dates), return the original value
    return value;
  }

  function formatPriceForUI(price) {
    // The original price is in GBP, turn it into the preferred currency
    const conversionRates = {
      GBP: 1,
      EUR: 1.18,
      USD: 1.27,
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

  function formatCurrencyInput(value) {
    // Formats the number with thousands separators
    // e.g. 1000000 -> 1,000,000 or 1 000 000
    // Remove any non-digit characters except for the decimal point
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

  // =============================================================================
  // SECTION - LOGGERS
  // =============================================================================

  function logLocalStorage() {
    // Log all the keys in the local storage as one object
    const localStorageKeys = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      localStorageKeys[key] = localStorage.getItem(key);
    }
    console.log("localStorageKeys", localStorageKeys);
  }

  function logInternalState() {
    // Logs the internal state as one object
    console.log("Internal State", {
      userId,
      currentPhase,
      userExplanationType,
      userExplanationViewMode,
      currentQuestion,
      answers,
    });
  }

  // ===========================================================================
  // SECTION: SETTERS
  // ===========================================================================

  function updatePhase(newPhase) {
    if (!phases.includes(newPhase)) {
      throw new Error(`Invalid phase value: ${newPhase} not in ${phases}`);
    }
    setCurrentPhase(newPhase);
    localStorage.setItem("currentPhase", newPhase);
    // Set the current question to the first of this phase
    let newQuestion = 0;
    for (let i = 0; i < phases.length; i++) {
      if (phases[i] === newPhase) {
        break;
      }
      newQuestion += questionsPerPhase[i];
    }
    setCurrentQuestion(newQuestion);
  }

  // =============================================================================
  // SECTION - USER INITIALIZATION
  // =============================================================================

  function initUser() {
    // Initialize the uer ID
    const storedUserId = localStorage.getItem("userId") || uuidv4();
    setUserId(storedUserId);

    // Initialize the current phase
    const storedPhase = localStorage.getItem("currentPhase") || "0";
    setCurrentPhase(storedPhase);

    // Initialize the explanation type
    const storedExplanationType =
      localStorage.getItem("userExplanationType") ||
      getRandom(explanationTypes);
    setUserExplanationType(storedExplanationType);

    // Initialize the explanation view mode
    let storedExplanationViewMode =
      localStorage.getItem("userExplanationViewMode") ||
      getRandom(explanationViewModes);
    setUserExplanationViewMode(storedExplanationViewMode);

    // Initialize the current question
    let storedQuestion = parseInt(localStorage.getItem("currentQuestion")) || 0;
    setCurrentQuestion(storedQuestion);
  }

  const resetUser = () => {
    localStorage.clear();
    initUser();
  };

  // =============================================================================
  // SECTION - DATABASE INTERACTIONS
  // =============================================================================

  const saveAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    // localStorage.setItem("answers", JSON.stringify(newAnswers));

    // Optionally send the answer to a server
    // fetch("/api/saveAnswer", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ userId, questionId, answer }),
    // });
  };

  async function submitFormResponse(formResponse) {
    // Send the form response to firebase
    // The document ID is the user ID
    try {
      await setDoc(doc(db, "formResponses", userId), formResponse);
    } catch (error) {
      console.error("Error writing document: ", error);
      throw error;
    }
  }

  // =============================================================================
  // SECTION - LIFE CYCLE METHODS
  // =============================================================================

  useEffect(() => {
    initUser();
  }, []);

  const goToNextQuestion = () => {
    // The first step is to show feedback, then move on to the next question
    if (!showingFeedback) {
      setShowingFeedback(true);
      return false;
    }
    // Increase the question index by one
    const nextQuestion = currentQuestion + 1;

    // If the new question is on a new phase, update the current phase
    let newPhase = null;
    let totalQuestionsSoFar = 0;
    for (let i = 0; i < phases.length; i++) {
      totalQuestionsSoFar += questionsPerPhase[i];
      if (nextQuestion < totalQuestionsSoFar) {
        newPhase = phases[i];
        break;
      }
    }
    setShowingFeedback(false);
    setCurrentQuestion(nextQuestion);
    setCurrentPhase(newPhase);
    return true;
  };

  return (
    <AnswersContext.Provider
      value={{
        // States and setters
        userId,
        userExplanationType,
        setUserExplanationType,
        userExplanationViewMode,
        setUserExplanationViewMode,
        saveAnswer,
        resetUser,
        currentQuestion,
        currentPhase,
        updatePhase,
        showingFeedback,
        // Getters
        getCurrentHouse,
        getCurrentPointCounterfactual,
        getCurrentIntervalCounterfactual,
        getCurrentFeatureImportances,
        getCurrentPhaseProgress,
        getCurrentHousePrice,
        getAIPrediction,
        getCurrencySymbol,
        // UI formatting
        formatFeatureLabelForUI,
        formatFeatureForUI,
        formatPriceForUI,
        formatCurrencyInput,
        // Database interactions
        submitFormResponse,
        // Actions
        goToNextQuestion,
      }}
    >
      {children}
    </AnswersContext.Provider>
  );
};
