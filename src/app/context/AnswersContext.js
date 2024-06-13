"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AnswersContext = createContext();

export const useAnswers = () => {
  return useContext(AnswersContext);
};

export const AnswersProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    //  - Storing the answers in local storage
    // const storedAnswers = localStorage.getItem("answers");
    // if (storedAnswers) {
    //   setAnswers(JSON.parse(storedAnswers));
    // }
  }, []);

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

  const resetUserID = () => {
    console.log(" - Resetting user ID");
    const newUserId = uuidv4();
    localStorage.setItem("userId", newUserId);
    setUserId(newUserId);
  };

  const goToNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  return (
    <AnswersContext.Provider
      value={{
        userId,
        answers,
        saveAnswer,
        resetUserID,
        currentQuestion,
        goToNextQuestion,
      }}
    >
      {children}
    </AnswersContext.Provider>
  );
};
