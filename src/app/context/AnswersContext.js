"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

import houses from "../../../public/data/houses.json";
import pointCounterfactuals from "../../../public/data/point_counterfactuals.json";
import intervalCounterfactuals from "../../../public/data/interval_counterfactuals.json";
import featureImportances from "../../../public/data/feature_importances.json";

import db from "@/utils/firestore";
import { doc, setDoc } from "firebase/firestore";

import runtimeParams from "../../../public/runtimeParams.json";

const AnswersContext = createContext();

export const useAnswers = () => {
  return useContext(AnswersContext);
};

export const AnswersProvider = ({ children }) => {
  const explanationTypes = ["none", "point", "interval", "featureImportance"];
  const explanationViewModes = ["sentences", "graph", "table"];
  const phases = ["0", "1", "2"];
  const questionsPerPhase = [5, 5, 5];

  function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // =============================================================================
  // SECTION - STATE
  // =============================================================================

  const [userId, setUserId] = useState(uuidv4());
  const updateUserId = (newId) => {
    setUserId(newId);
    localStorage.setItem("userId", newId);
  };

  const [currentPhase, setCurrentPhase] = useState("0");
  const updateCurrentPhase = (newPhase) => {
    setCurrentPhase(newPhase);
    localStorage.setItem("currentPhase", newPhase);
  };

  const [userExplanationType, setUserExplanationType] = useState("point");
  const updateExplanationType = (newType) => {
    setUserExplanationType(newType);
    localStorage.setItem("userExplanationType", newType);
  };

  const [userExplanationViewMode, setUserExplanationViewMode] =
    useState("sentences");
  const updateExplanationViewMode = (newMode) => {
    setUserExplanationViewMode(newMode);
    localStorage.setItem("userExplanationViewMode", newMode);
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const updateCurrentQuestion = (newQuestion) => {
    console.log("updateQuestion", newQuestion);
    setCurrentQuestion(newQuestion);
    localStorage.setItem("currentQuestion", newQuestion);
  };

  const [showingFeedback, setShowingFeedback] = useState(false);
  const updateShowingFeedback = (newShowingFeedback) => {
    setShowingFeedback(newShowingFeedback);
    localStorage.setItem("showingFeedback", newShowingFeedback);
  };

  const [answers, setAnswers] = useState({});
  const updateAnswers = (newAnswers) => {
    setAnswers(newAnswers);
    localStorage.setItem("answers", JSON.stringify(newAnswers));
  };

  // Tracks the preferred area metric, can be "sqm" or "sqft"
  const [preferredAreaMetric, setPreferredAreaMetric] = useState("sqft");
  const updatePreferredAreaMetric = (newMetric) => {
    setPreferredAreaMetric(newMetric);
    localStorage.setItem("preferredAreaMetric", newMetric);
  };

  // Tracks the preferred currency, can be "GBP", "EUR", or "USD"
  const [preferredCurrency, setPreferredCurrency] = useState("EUR");
  const updatePreferredCurrency = (newCurrency) => {
    setPreferredCurrency(newCurrency);
    localStorage.setItem("preferredCurrency", newCurrency);
  };

  const [didCompleteForm, setDidCompleteForm] = useState(false);
  const updateDidCompleteForm = (newDidCompleteForm) => {
    setDidCompleteForm(newDidCompleteForm);
    localStorage.setItem("didCompleteForm", newDidCompleteForm);
  };

  const [userScore, setUserScore] = useState(0);
  const updateUserScore = (newScore) => {
    setUserScore(newScore);
    localStorage.setItem("userScore", newScore);
  };

  // State for whether or not to display the phase informations modal
  // This is not a persistent state, the modal will appear on each page reload
  const [showPhaseInfoModal, setShowPhaseInfoModal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // =============================================================================
  // SECTION - USER INITIALIZATION
  // =============================================================================

  function initUser() {
    setIsLoading(true);
    // Initialize the uer ID
    const storedUserId = localStorage.getItem("userId") ?? uuidv4();
    updateUserId(storedUserId);

    // Initialize the current phase
    const storedPhase = localStorage.getItem("currentPhase") ?? "0";
    updateCurrentPhase(storedPhase);

    // Initialize the explanation type
    const storedExplanationType =
      localStorage.getItem("userExplanationType") ??
      getRandom(explanationTypes);
    updateExplanationType(storedExplanationType);

    // Initialize the explanation view mode
    let storedExplanationViewMode =
      localStorage.getItem("userExplanationViewMode") ??
      getRandom(explanationViewModes);
    updateExplanationViewMode(storedExplanationViewMode);

    // Initialize the current question
    let storedQuestion = parseInt(
      localStorage.getItem("currentQuestion") ?? "0"
    );
    updateCurrentQuestion(storedQuestion);

    // Initialize the showing feedback state
    let storedFeedback = localStorage.getItem("showingFeedback") === "true";
    updateShowingFeedback(storedFeedback);

    // Initialize the answers
    let storedAnswers = JSON.parse(localStorage.getItem("answers")) ?? {};
    updateAnswers(storedAnswers);

    // Initialize the preferred area metric
    let storedAreaMetric =
      localStorage.getItem("preferredAreaMetric") ?? "sqft";
    updatePreferredAreaMetric(storedAreaMetric);

    // Initialize the preferred currency
    let storedCurrency = localStorage.getItem("preferredCurrency") ?? "EUR";
    updatePreferredCurrency(storedCurrency);

    // Initialize the did complete form state
    let storedDidCompleteForm =
      localStorage.getItem("didCompleteForm") === "true";
    updateDidCompleteForm(storedDidCompleteForm);

    // Initialize the user score
    let storedUserScore = parseFloat(localStorage.getItem("userScore") ?? "0");
    updateUserScore(storedUserScore);

    setIsLoading(false);
  }

  const resetUser = () => {
    localStorage.clear();
    initUser();
  };

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

  const getCurrentQuestionID = () => {
    // Returns a unique string identifying the question
    // formatted as "p{phase}-q{question}"
    return `p${currentPhase}-q${currentQuestion}`;
  };

  // ===========================================================================
  // SECTION - UI FORMATTING
  // ===========================================================================

  function formatFeatureLabelForUI(featureInfo) {
    // Format the feature label for display in the UI
    // e.g. "1stFlrSF" -> "1st Floor Area (ft²)"
    const areaFeatures = ["LotArea", "1stFlrSF", "2ndFlrSF"];
    if (areaFeatures.includes(featureInfo.name)) {
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

  const revertPriceToGBP = (price) => {
    // The price is in the preferred currency, turn it back into GBP
    const conversionRates = {
      GBP: 1,
      EUR: 1.18,
      USD: 1.27,
    };
    return Math.round(price * conversionRates[preferredCurrency]);
  };

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

  function updateScore(userGuess) {
    // Update the user score based on the current question
    const correctPrice = getCurrentHousePrice();
    const error = (100 * Math.abs(correctPrice - userGuess)) / correctPrice;
    const clippedError = Math.min(error, 100);
    const score = 100 - clippedError / questionsPerPhase[2];
    updateUserScore(score);
  }

  function updatePhase(newPhase) {
    if (!phases.includes(newPhase)) {
      throw new Error(`Invalid phase value: ${newPhase} not in ${phases}`);
    }

    // Set the current question to the first of this phase
    let newQuestion = 0;
    for (let i = 0; i < phases.length; i++) {
      if (phases[i] === newPhase) {
        break;
      }
      newQuestion += questionsPerPhase[i];
    }

    // Update the state
    updateCurrentPhase(newPhase);
    updateCurrentQuestion(newQuestion);
  }

  // =============================================================================
  // SECTION - DATABASE INTERACTIONS
  // =============================================================================

  async function saveAnswer(answer) {
    // Add te last answer to the answers in the database.
    // The structure is as follows:
    // questionAnswers: { userID: { questionId: answer } }
    try {
      if (runtimeParams.useFirestore) {
        await setDoc(
          doc(db, `questionAnswers/${userId}/answers`, getCurrentQuestionID()),
          answer
        );
      }
    } catch (error) {
      console.error("Error writing document: ", error);
      throw error;
    }
  }

  async function submitFormResponse(formResponse) {
    // Send the form response to firebase
    // The document ID is the user ID
    try {
      if (runtimeParams.useFirestore) {
        await setDoc(doc(db, "formResponses", userId), formResponse);
      }
      updateDidCompleteForm(true);
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
      updateShowingFeedback(true);
      return false;
    }
    // Increase the question index by one
    const nextQuestion = currentQuestion + 1;
    // Get the sum of questions per phase
    const totalPossibleQuestions = questionsPerPhase.reduce((a, b) => a + b, 0);

    if (nextQuestion >= totalPossibleQuestions) {
      router.push("/finish");
      return false;
    }

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
    if (newPhase !== currentPhase) {
      setShowPhaseInfoModal(true);
    }
    updateShowingFeedback(false);
    updateCurrentQuestion(nextQuestion);
    updateCurrentPhase(newPhase);
    return true;
  };

  function closeModal() {
    setShowPhaseInfoModal(false);
  }

  // Log current score

  return (
    <AnswersContext.Provider
      value={{
        // States and setters
        userId,
        userExplanationType,
        userExplanationViewMode,
        setUserExplanationViewMode,
        saveAnswer,
        resetUser,
        currentQuestion,
        currentPhase,
        updatePhase,
        showingFeedback,
        didCompleteForm,
        userScore,
        revertPriceToGBP,
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
        showPhaseInfoModal,
        closeModal,
        // Database interactions
        submitFormResponse,
        // Actions
        updateScore,
        goToNextQuestion,
      }}
    >
      {isLoading ? (
        <div className="flex justify-center pt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </AnswersContext.Provider>
  );
};
