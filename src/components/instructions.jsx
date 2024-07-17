"use client";
import React from "react";
import { useAnswers } from "@/app/context/AnswersContext";

export const GeneralInstructions = () => {
  return (
    <div className="prose prose-lg xl:prose-xl">
      <h2>General Instructions </h2>

      <p>
        The dataset we work with contains information about houses in the
        Netherlands and their sales prices. An AI was trained on this dataset to
        predict the sales price based on lot size in square feet, street type,
        construction date, first floor square feet, second floor square feet,
        number of full bathrooms, number of bedrooms, number of rooms, number of
        fireplaces, building type, and central airconditioning. In this
        experiment you will go through three phases, each with its own
        instructions. Please read the instructions for each phase carefully.
      </p>
    </div>
  );
};

export const PhaseInstructions = () => {
  const { currentPhase, userExplanationType, formatPriceForUI } = useAnswers();

  return (
    // <div className="prose !max-w-none prose-lg xl:prose-xl">
    <div className="prose !max-w-none prose-lg">
      {currentPhase === "0" && (
        <>
          {userExplanationType === "none" ? (
            <>
            <p>
              In this phase of the experiment you will be presented with:
            </p>
            <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
                <li>information about a house</li>
                <li>the AI's prediction of the sales price for this particular property</li>
                <li>an explanation for this prediction.</li>
            </ul>
            <p>
                Then, your task is to make a judgement of the true
                sales price yourself. This may or may not be the same as the
                prediction of the AI. After submitting your response, you will
                receive feedback in the form of the true sales prices.
              </p>
            </>
          ) : (
            <>
              <p>
                In this phase of the experiment you will be presented with:
              </p>
                <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
                <li>information about a house</li>
                <li>the AI's prediction of the sales price for this particular property</li>
                <li>an explanation for this prediction.</li>
              </ul>
              <p>
                Then, your task is to make a judgement of the true
                sales price yourself. This may or may not be the same as the
                prediction of the AI. After submitting your response, you will
                receive feedback in the form of the <strong>true sales price</strong>.
              </p>
              {["point"].includes(userExplanationType) ? (
                <p>
                  {/* <strong>Why does the model predict this price for this property?</strong>  */}
                  <strong>Why is this property so expensive?</strong> We want to understand under which circumstances <strong>a house of the same type</strong>, 
                  that is same zipcode, monument status and energy efficiency class, would cost <strong>{formatPriceForUI(100000)} less</strong>. 
                  The explanation you will receive shows how each feature would
                  have to change such that the predicted house price would be at
                  least {formatPriceForUI(100000)} lower than the currently predicted price.
                </p>
              ) : null}
              {["interval"].includes(userExplanationType) ? (
                <p>
                  {/* <strong>Why does the model predict this price for this property?</strong>  */}
                  <strong>Why is this property so expensive?</strong> We want to understand under which circumstances <strong>a house of the same type</strong>, 
                  that is same zipcode, monument status and energy efficiency class, would cost <strong>{formatPriceForUI(100000)} less</strong>. 
                  The explanation you will receive shows how each feature would
                  have to change such that the predicted price is {formatPriceForUI(100000)} lower. Specifically, for each feature
                  you will see a possible range (minimum and maximum) of values
                  that this feature could take on.
                </p>
              ) : null}
              {["featureImportance"].includes(userExplanationType) ? (
                <p>
                  <strong>Why does the model predict this price for this property?</strong>
                  The explanation you will receive shows the impact of each
                  feature on the predicted price, ranging from 0 to 100.
                </p>
              ) : null}
            </>
          )}
        </>
      )}
      {currentPhase === "1" && (
        <>
          {userExplanationType === "none" ? (
            <>
            <p>
              In this phase of the experiment you will be presented with:
            </p>
              <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
              <li>information about a house</li>
              {/* <li>the AI's prediction of the sales price for this particular property</li>
              <li>an explanation for this prediction.</li> */}
            </ul>
            <p>
            {/* For some properties not all information will be available, shown as "???".  */}
            Your task is to <strong>estimate the house's 
              true sales price</strong> and <strong>the sales price that the AI
              predicts</strong>. After submitting your response, you will see:
            </p>
            <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
                <li>the AI's prediction of the sales price</li>
                {/* <li>an explanation for this prediction</li> */}
                <li>the true sales price</li>
              </ul>
            </>
          ) : (
            <>
              <p>
                In this phase of the experiment you will be presented with:
              </p>
                <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
                <li>information about a house</li>
                {/* <li>the AI's prediction of the sales price for this particular property</li>
                <li>an explanation for this prediction.</li> */}
              </ul>
              <p>
              {/* For some properties not all information will be available, shown as "???".  */}
              Your task is to <strong>estimate
              the house's true sales price</strong> and <strong>the sales price that the AI
              predicts</strong>. After submitting your response, you will see:
              </p>
              <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
                <li>the AI's prediction of the sales price</li>
                <li>an explanation for this prediction</li>
                <li>the true sales price</li>
              </ul>
              {["point"].includes(userExplanationType) ? (
                <p>
                  {/* <strong>Why does the model predict this price for this property?</strong>  */}
                  <strong>Why is this property so expensive?</strong> We want to understand under which circumstances <strong>a house of the same type</strong>, 
                  that is same zipcode, monument status and energy efficiency class, would cost <strong>{formatPriceForUI(100000)} less</strong>. 
                  The explanation you will receive shows how each feature would
                  have to change such that the predicted house price would be at
                  least {formatPriceForUI(100000)} lower than the currently predicted price.
                </p>
              ) : null}
              {["interval"].includes(userExplanationType) ? (
                <p>
                  {/* <strong>Why does the model predict this price for this property?</strong>  */}
                  <strong>Why is this property so expensive?</strong> We want to understand under which circumstances <strong>a house of the same type</strong>, 
                  that is same zipcode, monument status and energy efficiency class, would cost <strong>{formatPriceForUI(100000)} less</strong>. 
                  The explanation you will receive shows how each feature would
                  have to change such that the predicted price is {formatPriceForUI(100000)} lower than the currently predicted price. 
                  Specifically, for each feature
                  you will see a possible range (minimum and maximum) of values
                  that this feature could take on.
                </p>
              ) : null}
              {["featureImportance"].includes(userExplanationType) ? (
                <p>
                   <strong>Why does the model predict this price for this property?</strong>
                  The explanation you will receive shows the impact of each
                  feature on the predicted price, ranging from 0 to 100.
                </p>
              ) : null}
            </>
          )}
        </>
      )}

      {currentPhase === "2" && (
        <>
          <p>
            In this phase of the experiment you will be presented with:
          </p>
            <ul class="ps-10 mt-2 list-disc list-inside space-y-2">
            <li>information about a house</li>
            {/* <li>the AI's prediction of the sales price for this particular property</li> */}
            {/* <li>an explanation for this prediction.</li> */}
          </ul>
          <p>
            For some properties not all information
            will be available, shown as "???". For each house, your task is to <strong>choose an agent,
            either the AI or yourself</strong>, to predict the house’s true sales price.
            If you choose not to follow the AI, you will be asked to enter your
            prediction of the house price. You will not receive any information
            about the true sales price or the AI’s predicted sales price.
            Participants performing well in this task have the chance to win a
            gift card.
          </p>

          <p>
            On the top of the screen you will see <strong>your score, ranging from 0 to
            100. You will start with a score of 100</strong>. The goal is to predict the
            house price as accurately as possible, regardless of whether relying
            on the AI or on yourself. Hence, you will be penalised for poorly
            predicted sales prices regardless the source of the prediction
            (yourself or AI). The best 10% participants will receive a gift card
            after completion of the study.
          </p>
        </>
      )}
    </div>
  );
};
