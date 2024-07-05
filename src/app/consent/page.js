"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnswers } from "../context/AnswersContext";

export default function InformedConsent() {
  const [consent, setConsent] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { submitFormResponse, updateDidGiveConsent } = useAnswers();

  const handleChange = (e) => {
    const { value } = e.target;
    setConsent(value);
  };

  const validate = () => {
    let tempErrors = {};
    if (!consent) {
      tempErrors.consent = "Please select an option.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateDidGiveConsent(consent === "agree");
      if (consent === "disagree") {
        router.push("/finish");
      } else {
        submitFormResponse({ consent })
          .then(() => {
            router.push("/form");
          })
          .catch((error) => {
            console.error("Error submitting form:", error);
          });
      }
    }
  };

  return (
    <div className="container mx-auto text-xl p-10 mt-10">
      <h1 className="text-4xl font-bold mb-4 dark:text-gray-300">Informed Consent</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="form-control">
          <p className="text-base mb-4">
            [Informed consent text goes here...]
          </p>
        </div>

        <div className="form-control">
          <label className="label">
            {/* <span className="text-base">Do you agree to participate in this study?</span> */}
          </label>
          <div className="flex flex-col space-y-4">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="agree"
                checked={consent === "agree"}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">I acknowledge to have read and understood the information; I consent to participate in the study.</span>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="disagree"
                checked={consent === "disagree"}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">I do not consent to participate in the study.</span>
            </label>
          </div>
          {errors.consent && (
            <span className="text-red-500 text-sm">{errors.consent}</span>
          )}
        </div>

        <div className="form-control">
          <button 
            type="submit" 
            className="btn btn-primary my-8 mt-8 text-base" 
            disabled={!consent}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
