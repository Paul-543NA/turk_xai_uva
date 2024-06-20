"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnswers } from "../context/AnswersContext";

export default function Form() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    theoreticalKnowledge: 0,
    practicalExperience: 0,
    dailyAIWork: "",
    houseBuying: "",
    preferredCurrency: "",
    preferredMetric: "",
  });

  const [errors, setErrors] = useState({});

  const router = useRouter();
  const { submitFormResponse } = useAnswers();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      tempErrors.age = "Please enter a valid age between 1 and 120.";
    }
    if (!formData.gender) {
      tempErrors.gender = "Please select an option.";
    }
    if (!formData.dailyAIWork) {
      tempErrors.dailyAIWork = "Please select an option.";
    }
    if (!formData.houseBuying) {
      tempErrors.houseBuying = "Please select an option.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      submitFormResponse(formData)
        .then(() => {
          console.log("Form submitted successfully");
          router.push("/");
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    }
  };

  return (
    <div className="container mx-auto text-xl p-4">
      <h1 className="text-4xl font-bold mb-4">Questionnaire</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Gender: How do you identify?</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`select select-bordered w-full max-w-xs ${
              errors.gender ? "select-error" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other / do not want to disclose</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm">{errors.gender}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">How old are you?</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`input input-bordered w-full max-w-xs ${
              errors.age ? "input-error" : ""
            }`}
          />
          {errors.age && (
            <span className="text-red-500 text-sm">{errors.age}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              How would you rate your theoretical knowledge about AI?
            </span>
          </label>
          <input
            type="range"
            name="theoreticalKnowledge"
            min="0"
            max="10"
            value={formData.theoreticalKnowledge}
            onChange={handleChange}
            className="range range-sm"
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>0 (nothing)</span>
            <span>10 (expert)</span>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              How would you rate your practical experience with AI?
            </span>
          </label>
          <input
            type="range"
            name="practicalExperience"
            min="0"
            max="10"
            value={formData.practicalExperience}
            onChange={handleChange}
            className="range range-sm"
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>0 (no experience)</span>
            <span>10 (expert)</span>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Do you work with or on AI on a daily basis?
            </span>
          </label>
          <select
            name="dailyAIWork"
            value={formData.dailyAIWork}
            onChange={handleChange}
            className={`select select-bordered w-full max-w-xs ${
              errors.dailyAIWork ? "select-error" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.dailyAIWork && (
            <span className="text-red-500 text-sm">{errors.dailyAIWork}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Have you bought a house or actively considered buying a house in
              the past five years?
            </span>
          </label>
          <select
            name="houseBuying"
            value={formData.houseBuying}
            onChange={handleChange}
            className={`select select-bordered w-full max-w-xs ${
              errors.houseBuying ? "select-error" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.houseBuying && (
            <span className="text-red-500 text-sm">{errors.houseBuying}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Have you bought a house or actively considered buying a house in
              the past five years?
            </span>
          </label>
          <select
            name="houseBuying"
            value={formData.houseBuying}
            onChange={handleChange}
            className={`select select-bordered w-full max-w-xs ${
              errors.houseBuying ? "select-error" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.houseBuying && (
            <span className="text-red-500 text-sm">{errors.houseBuying}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              This task is about estimating prices, which currency are you most
              familiar with?
            </span>
          </label>
          <select
            name="preferredCurrency"
            value={formData.preferredCurrency}
            onChange={handleChange}
            className={`select select-bordered w-full max-w-xs ${
              errors.preferredCurrency ? "select-error" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </select>
          {errors.preferredCurrency && (
            <span className="text-red-500 text-sm">
              {errors.preferredCurrency}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Which metric to you usually use to measure areas?
            </span>
          </label>
          <select
            name="preferredMetric"
            value={formData.preferredMetric}
            onChange={handleChange}
            className={`select select-bordered w-full max-w-xs ${
              errors.preferredMetric ? "select-error" : ""
            }`}
          >
            <option value="">Select</option>
            <option value="cm">Centimeters</option>
            <option value="m">Meters</option>
            <option value="km">Kilometers</option>
          </select>
          {errors.preferredMetric && (
            <span className="text-red-500 text-sm">
              {errors.preferredMetric}
            </span>
          )}
        </div>

        <div className="form-control">
          <button type="submit" className="btn btn-primary my-8 mt-8">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
