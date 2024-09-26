"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnswers } from "../context/AnswersContext";

export default function InformedConsent() {
  const [consent, setConsent] = useState("");
  const [reuseConsent, setReuseConsent] = useState("agree");
  const [futureContact, setFutureContact] = useState("agree");
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userId, saveConsent } = useAnswers();

  const handleChange = (e) => {
    const { value } = e.target;
    setConsent(value);
  };

  const handleReuseConsentChange = (e) => {
    const { value } = e.target;
    setReuseConsent(value);
  };

  const handleFutureContactChange = (e) => {
    const { value } = e.target;
    setFutureContact(value);
  };

  const validate = () => {
    let tempErrors = {};
    if (!consent) {
      tempErrors.consent = "Please select an option.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validate()) {
      try {
        await saveConsent(consent, reuseConsent, futureContact);
        setUploadError(null);
        setLoading(false);
        router.push("/form");
      } catch (error) {
        // Handle the error, e.g., display an error message
        setUploadError(
          "An error occurred. Please check your internet connection or try again later."
        );
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto text-xl p-10 mt-10">
      <h1 className="text-4xl font-bold mb-4 dark:text-gray-300">
        Informed Consent
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="form-control">
          {/* <p className="text-base mb-4">[Informed consent text goes here...]</p> */}
          <ol class="mt-6 text-base space-y-4 list-decimal list-inside">
            <li>
              I confirm that I have read and understand the{" "}
              <a
                className="link link-primary"
                href="/Participant-Information-Sheet.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                participant information sheet dated 23/09/24 version 1.0
              </a>{" "}
              for this study and have had the opportunity to ask questions which have been answered fully.
            </li>
            <li>
              I understand that my participation is voluntary, and I am free to
              withdraw at any time, without giving any reason and without my
              legal rights being affected.
            </li>
            {/* <li>
            I give consent for information collected about me to be used to support other research 
            or in the development of a new product or service by an academic institution or commercial company 
            in the future, including those outside of the United Kingdom (which Imperial College London has ensured will keep this information secure). 
            </li> */}
            <li>
            I understand that data collected from me are a gift donated to Imperial College and that I will not 
            personally benefit financially if this research leads to an invention and/or the successful development of a new product or service.
            </li>
            {/* <li>
              I give permission for Imperial College London to access my records
              that are relevant to this research.
            </li> */}
            <li>I consent to take part in this study.</li>
          </ol>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="text-base mb-6">
              <strong>
                Do you agree with the above clauses and consent to take part in
                this study?
              </strong>
            </span>
          </label>
          <div className="flex flex-row space-x-10">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="agree"
                checked={consent === "agree"}
                onChange={handleChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">Yes</span>
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
              <span className="ml-2 text-base">No</span>
            </label>
          </div>
          {errors.consent && (
            <span className="text-red-500 text-sm">{errors.consent}</span>
          )}
        </div>

        {/* OPTIONAL DATA REUSE CONSENT */}
        <div className="form-control">
          <label className="label">
            <span className="text-base mb-6">
              {/* <strong> */}
                I give consent for information collected about me to be used to
                support other research or in the development of a new product or service 
                by an academic institution or commercial company in the future, including those outside 
                of the United Kingdom (which Imperial College London has ensured will keep this information secure) <strong>(optional)</strong>.
              {/* </strong> */}
            </span>
          </label>
          <div className="flex flex-row space-x-10">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent-optional"
                value="agree"
                checked={reuseConsent === "agree"}
                onChange={handleReuseConsentChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">Yes</span>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent-optional"
                value="disagree"
                checked={reuseConsent === "disagree"}
                onChange={handleReuseConsentChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">No</span>
            </label>
          </div>
          {errors.consent && (
            <span className="text-red-500 text-sm">{errors.consent}</span>
          )}
        </div>

        {/* OPTIONAL DATA REUSE CONSENT */}
        <div className="form-control">
          <label className="label">
            <span className="text-base mb-6">
              {/* <strong> */}
              I give consent to being contacted about the possibility to take part in other research studies <strong>(optional)</strong>. 
              {/* </strong> */}
            </span>
          </label>
          <div className="flex flex-row space-x-10">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent-optional-2"
                value="agree"
                checked={futureContact === "agree"}
                onChange={handleFutureContactChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">Yes</span>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="consent-optional-2"
                value="disagree"
                checked={futureContact === "disagree"}
                onChange={handleFutureContactChange}
                className="radio radio-primary"
              />
              <span className="ml-2 text-base">No</span>
            </label>
          </div>
          {errors.consent && (
            <span className="text-red-500 text-sm">{errors.consent}</span>
          )}
        </div>

        <div className="form-control">
          {/* user Id alert */}
          <div role="alert" className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-base">
              If you ever want to withdraw from the study, please contact the
              study team with your user ID. Your user ID is:
              <br />
              <strong>{userId}</strong>
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary my-8 mt-8 text-base"
            disabled={!(consent === "agree") || loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>

        {/* Error div that shows when there is an upload error */}
        {uploadError && (
          <div role="alert" className="text-red-500">
            {uploadError}
          </div>
        )}

        {/* Warning div that you should give consent */}
        {consent === "disagree" && (
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>You must agree to participate in the study to continue.</span>
          </div>
        )}
      </form>
    </div>
  );
}
