"use client";
import React, { useState } from "react";
import { useAnswers } from "@/app/context/AnswersContext";

function UserInputCard() {
  const {
    currentPhase,
    showingFeedback,
    getCurrentHousePrice,
    getAIPrediction,
    getCurrencySymbol,
    formatPriceForUI,
  } = useAnswers();

  const {
    inputValue,
    inputAIValue,
    isValid,
    isAIValid,
    followAI,
    submitting,
    submitError,
    handleInputChange,
    handleAIInputChange,
    handleClickNext,
    userPredictionError,
  } = useUserInputCard();

  const TrustAIToggle = (
    <label className="form-control w-full max-w-xs mb-4">
      {/* Toggle to follow or not the AI */}
      <div className="label">
        <span className="text-base">Follow AI:</span>
      </div>
      <input
        type="checkbox"
        className="toggle"
        checked={followAI}
        onChange={() => setFollowAI(!followAI)}
        disabled={showingFeedback}
      />
    </label>
  );

  const TruthInput = (
    <div>
      <p>
        <span className="text-base">
          What do you think is the true sales price of this property?
        </span>
      </p>
      <label className="form-control w-full max-w-xs mt-6">
        {/* Label and input field */}
        {/* <div className="label">
        <span className="text-base">What do you think is the true sales price of this property?</span>
      </div> */}
        <label className="input input-bordered flex items-center gap-2">
          {getCurrencySymbol()}
          <input
            type="text"
            className="grow"
            placeholder=""
            value={inputValue}
            onChange={handleInputChange}
            disabled={showingFeedback || (currentPhase === "2" && followAI)}
          />
        </label>
      </label>
    </div>
  );

  const AIInput = (
    <div>
      <p>
        <span className="text-base">
          What do you think is the sales price for this property according to
          the AI?
        </span>
      </p>
      <label className="form-control w-full max-w-xs mt-6">
        {/* Label and input field */}
        {/* <div className="label">
        <span className="text-base">What do you think is the sales price for this property according to the AI?</span>
      </div> */}
        <label className="input input-bordered flex items-center gap-2">
          {getCurrencySymbol()}
          <input
            type="text"
            className="grow"
            placeholder=""
            value={inputAIValue}
            onChange={handleAIInputChange}
            disabled={showingFeedback}
          />
        </label>
      </label>
    </div>
  );

  return (
    <div className="card bg-base-300 shadow-xl md:m-4">
      <div className="card-body">
        {/* Show the toggle only in phase 2 */}
        {currentPhase === "2" ? TrustAIToggle : null}

        {/* Show AI input field in phase 1 */}
        {currentPhase === "1" ? (
          <>
            {AIInput}
            <span> </span>
            <span> </span>
            {showingFeedback ? (
              <p className="mb-8 pl-4">
                The AI predicted the value of the property to be{" "}
                <strong>{formatPriceForUI(getAIPrediction())}</strong>.
              </p>
            ) : null}
          </>
        ) : null}

        {/* Input field, it all should be disabled if "follow AI" is on*/}
        {TruthInput}

        {/* Next button */}
        {/* In phase 0, it is disabled if the value input is not valid */}
        {/* In phase 1, it is disabled if any of the value/AI inputs are not valid */}
        {/* In phase 2, it is disabled if the value input is not valid or follow AI is on */}
        {showingFeedback && currentPhase !== "2" ? (
          <p className="p-4 pl-4">
            The true value of the property is{" "}
            <strong>{formatPriceForUI(getCurrentHousePrice())}</strong>.
          </p>
        ) : null}

        {showingFeedback && currentPhase === "2" ? (
          <p className="p-4 pl-4">
            The true value of the property is{" "}
            <strong>{formatPriceForUI(getCurrentHousePrice())}</strong> (you
            were <strong>{formatPriceForUI(userPredictionError())}</strong>{" "}
            away).
          </p>
        ) : null}

        {showingFeedback ? (
          <>
            <button
              onClick={handleClickNext}
              className="btn btn-secondary mt-4"
              disabled={false}
            >
              Next question
            </button>
          </>
        ) : (
          <button
            onClick={handleClickNext}
            className="btn btn-primary mt-8"
            disabled={
              submitting ||
              (currentPhase === "0" && !isValid) ||
              (currentPhase === "1" && (!isValid || !isAIValid)) ||
              (currentPhase === "2" && (followAI ? false : !isValid))
            }
          >
            Ok
          </button>
        )}
        {/* Error message if submission failed */}
        {submitError ? (
          <p className="text-error mt-4">
            {submitError} - Please try again later.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function useUserInputCard() {
  const {
    currentPhase,
    goToNextQuestion,
    showingFeedback,
    getCurrentHousePrice,
    getAIPrediction,
    formatCurrencyInput,
    userScore,
    saveAnswer,
    updateScore,
    revertPriceToGBP,
  } = useAnswers();

  const [inputValue, setInputValue] = useState("");
  const [inputAIValue, setAIInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isAIValid, setAIIsValid] = useState(false);
  const [followAI, setFollowAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const createUserAnswer = () => {
    let userAnswer = {
      propertyValue: getValueGBP(inputValue),
    };
    if (currentPhase === "1") {
      userAnswer = {
        ...userAnswer,
        aiPrediction: getValueGBP(inputAIValue),
      };
    }
    if (currentPhase === "2") {
      userAnswer = {
        ...userAnswer,
        followAI: followAI,
        score: userScore,
      };
    }
    return userAnswer;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCurrencyInput(value);
    setInputValue(formattedValue);

    // Validate the input value (must be a positive number)
    const number = parseFloat(value);
    setIsValid(!isNaN(number) && number > 0);
  };

  const handleAIInputChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCurrencyInput(value);
    setAIInputValue(formattedValue);

    // Validate the input value (must be a positive number)
    const number = parseFloat(value);
    setAIIsValid(!isNaN(number) && number > 0);
  };

  const emptyInputs = () => {
    setInputValue("");
    setFollowAI(false);
    setAIInputValue("");
    setAIIsValid(false);
    setIsValid(false);
  };

  const handleClickNext = async () => {
    let submitErr = null;

    if (!showingFeedback) {
      const userAnswer = createUserAnswer();
      try {
        setSubmitting(true);
        if (currentPhase === "2") {
          const userGuess = followAI
            ? getAIPrediction()
            : getValueGBP(inputValue);
          updateScore(userGuess);
        }
        await saveAnswer(userAnswer);
      } catch (error) {
        submitErr = error.message;
      } finally {
        setSubmitting(false);
        setSubmitError(submitErr);
      }
    }
    // Only execute if no error occurred
    if (submitErr === null) {
      const doReset = goToNextQuestion();
      if (doReset) {
        emptyInputs();
      }
    }
  };

  const userPredictionError = () => {
    // If the user follows the AI, use the AI output
    if (followAI) {
      return Math.round(Math.abs(getCurrentHousePrice() - getAIPrediction()));
    }
    return Math.abs(getCurrentHousePrice() - getValueGBP(inputValue));
  };

  const getValueGBP = () => {
    // Remove " " and , from the input value
    const inputCleaned = inputValue.replace(/ /g, "").replace(/,/g, "");
    return revertPriceToGBP(parseFloat(inputCleaned));
  };

  return {
    inputValue,
    inputAIValue,
    isValid,
    isAIValid,
    followAI,
    submitting,
    submitError,
    handleInputChange,
    handleAIInputChange,
    handleClickNext,
    userPredictionError,
  };
}

export default UserInputCard;
