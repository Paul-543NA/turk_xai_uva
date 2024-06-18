"use client";
import React, { useState } from "react";
import { useAnswers } from "@/app/context/AnswersContext";

function UserInputCard() {
  const { currentPhase, goToNextQuestion } = useAnswers();

  const [inputValue, setInputValue] = useState("");
  const [inputAIValue, setAIInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isAIValid, setAIIsValid] = useState(false);
  const [followAI, setFollowAI] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Validate the input value (must be a positive number)
    const number = parseFloat(value);
    setIsValid(!isNaN(number) && number > 0);
  };

  const handleAIInputChange = (e) => {
    const value = e.target.value;
    setAIInputValue(value);

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

  const handleClickNext = () => {
    goToNextQuestion();
    emptyInputs();
  };

  const TrustAIToggle = (
    <label className="form-control w-full max-w-xs">
      {/* Toggle to follow or not the AI */}
      <div className="label">
        <span className="label-text">Follow AI:</span>
      </div>
      <input
        type="checkbox"
        className="toggle"
        checked={followAI}
        onChange={() => setFollowAI(!followAI)}
      />
    </label>
  );

  const TruthInput = (
    <label className="form-control w-full max-w-xs">
      {/* Label and input field */}
      <div className="label">
        <span className="label-text">How much is this property worth?</span>
      </div>
      <label className="input input-bordered flex items-center gap-2">
        £
        <input
          type="text"
          className="grow"
          placeholder=""
          value={inputValue}
          onChange={handleInputChange}
          disabled={currentPhase === "2" && followAI}
        />
      </label>
    </label>
  );

  const AIInput = (
    <label className="form-control w-full max-w-xs">
      {/* Label and input field */}
      <div className="label">
        <span className="label-text">How much will the AI say?</span>
      </div>
      <label className="input input-bordered flex items-center gap-2">
        £
        <input
          type="text"
          className="grow"
          placeholder=""
          value={inputAIValue}
          onChange={handleAIInputChange}
        />
      </label>
    </label>
  );

  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        {/* Show the toggle only in phase 2 */}
        {currentPhase === "2" ? TrustAIToggle : null}

        {/* Show AI input field in phase 1 */}
        {currentPhase === "1" ? AIInput : null}

        {/* Input field, it all should be disabled if "follow AI" is on*/}
        {TruthInput}

        {/* Next button */}
        {/* In phase 0, it is disabled if the value input is not valid */}
        {/* In phase 1, it is disabled if any of the value/AI inputs are not valid */}
        {/* In phase 2, it is disabled if the value input is not valid or follow AI is on */}
        <button
          onClick={handleClickNext}
          className="btn btn-primary mt-4"
          disabled={
            (currentPhase === "0" && !isValid) ||
            (currentPhase === "1" && (!isValid || !isAIValid)) ||
            (currentPhase === "2" && (followAI ? false : !isValid))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserInputCard;
