"use client";
import React, { useState } from "react";
import { useAnswers } from "../context/AnswersContext";

const Page = () => {
  const { saveScoreToLeaderBoard } = useAnswers();
  const [email, setEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // 'success' or 'error'
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveScoreToLeaderBoard(email);
      setFeedbackMessage("Your score has been successfully submitted!");
      setFeedbackType("success");
      setIsSubmitted(true); // Disable form elements and hide submit button
    } catch (error) {
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Well done!</h1>
          <p className="py-6">
            You have completed the task. Thank you for your participation! If
            you would like to enter the raffle to win a gift card, please enter
            your email address below.
          </p>
          <div>
            <form className="flex-col gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered input-primary w-full max-w-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitted}
              />
              {!isSubmitted && (
                <button type="submit" className="btn btn-primary mt-4">
                  Submit
                </button>
              )}
              {feedbackType === "success" ? (
                <div className="mt-4 text-success">{feedbackMessage}</div>
              ) : null}
              {feedbackType === "error" ? (
                <div className="mt-4 text-error">{feedbackMessage}</div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
