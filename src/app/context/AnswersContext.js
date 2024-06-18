"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import houses from "../../../public/data/houses.json";
import pointCounterfactuals from "../../../public/data/point_counterfactuals.json";
import intervalCounterfactuals from "../../../public/data/interval_counterfactuals.json";

const AnswersContext = createContext();

export const useAnswers = () => {
  return useContext(AnswersContext);
};

export const AnswersProvider = ({ children }) => {
  // =============================================================================
  // SECTION - STATE
  // =============================================================================

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  const [currentPhase, setCurrentPhase] = useState("0");
  useEffect(() => {
    localStorage.setItem("currentPhase", currentPhase);
  }, [currentPhase]);

  const [userExplanationType, setUserExplanationType] = useState("interval");
  useEffect(() => {
    localStorage.setItem("userExplanationType", userExplanationType);
  }, [userExplanationType]);

  const [userExplanationViewMode, setUserExplanationViewMode] =
    useState("sentences");
  useEffect(() => {
    localStorage.setItem("userExplanationViewMode", userExplanationViewMode);
  }, [userExplanationViewMode]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion);
  }, [currentQuestion]);

  const [answers, setAnswers] = useState({});
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

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
      localStorage.getItem("userExplanationType") || "point";
    setUserExplanationType(storedExplanationType);

    // Initialize the explanation view mode
    let storedExplanationViewMode =
      localStorage.getItem("userExplanationViewMode") ||
      getRandom(explanationViewModes);
    setUserExplanationViewMode(storedExplanationViewMode);

    // Initialize the current question
    let storedQuestion = localStorage.getItem("currentQuestion") || 0;
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

  // =============================================================================
  // SECTION - LIFE CYCLE METHODS
  // =============================================================================

  useEffect(() => {
    initUser();
  }, []);

  const goToNextQuestion = () => {
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
    setCurrentQuestion(nextQuestion);
    setCurrentPhase(newPhase);
  };

  return (
    <AnswersContext.Provider
      value={{
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
        getCurrentHouse,
        getCurrentPointCounterfactual,
        getCurrentIntervalCounterfactual,
        getCurrentPhaseProgress,
        goToNextQuestion,
      }}
    >
      {children}
    </AnswersContext.Provider>
  );
};
