"use client";
import React from "react";
import { useAnswers } from "@/app/context/AnswersContext";
import { formatPriceForUI } from "@/utils/featureProcessor";

export const GeneralInstructions = () => {
  return (
    <div className="prose prose-lg xl:prose-xl">
      <h2>General Instructions </h2>

      <p>
        The dataset we work with contains information about houses in the Netherlands 
        and their sales prices. An AI was trained on this dataset to
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
  const { currentPhase, userExplanationType } = useAnswers();

  return (
    <div className="prose !max-w-none prose-lg xl:prose-xl">
      {currentPhase === "0" && (
        <>
          {userExplanationType === "none" ? (
            <p>
              In this phase of the experiment you will be presented with
              information about a house and the AI’s prediction of the sales
              price for this particular property. Then, your task is to make a
              judgement of the true sales price yourself. This may or may not be the
              same as the prediction of the AI. After submitting your response,
              you will receive feedback in the form of the true sales prices.
            </p>
          ) : (
            <>
              <p>
                In this phase of the experiment you will be presented with
                information about a house, the AI’s prediction of the sales
                price for this particular property, and an explanation for this
                prediction. Then, your task is to make a judgement of the true sales
                price yourself. This may or may not be the same as the
                prediction of the AI. After submitting your response, you will
                receive feedback in the form of the true sales prices.
              </p>
                {["point"].includes(userExplanationType) ? (
                  // <li>
              <p>  
                The explanation you will receive shows how each feature
                would have to change such that the predicted house price
                would be at least <strong>{formatPriceForUI(100000)} higher</strong> more than the currently predicted
                price. 
                {/* The grey dot shows the value of the property, and the <font color="#ec4899">pink</font> dot shows what it would have to change to. */}
              </p>
                  // </li>
                ) : null}
                {["interval"].includes(userExplanationType) ? (
                  // <li>
              <p>  
                The explanation you will receive shows how each feature
                would have to change such that the predicted house price
                would be at least <strong>{formatPriceForUI(100000)} higher</strong> than the currently predicted
                price. Specifically, for each feature you will see a possible range (minimum and maximum) 
                of values that this feature could take on.
                {/* The grey dot shows the value of the property, and the <font color="#ec4899">pink</font> dot shows what it would have to change to. */}
              </p>
                  // </li>
                ) : null}
                {["featureImportance"].includes(userExplanationType) ? (
                  <p>
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
            <p>
              In this phase of the experiment you will be presented with
              information about a house. The amount of information shown to you
              may differ between trials. Your task is to make a judgement about
              the house true sales price and the sales price that the AI
              predicts. After submitting your response, you will see the true
              sales prices and the AI’s prediction.
            </p>
          ) : (
            <>
              <p>
                In this phase of the experiment you will be presented with
                information about a house. The amount of information shown to
                you differs in between trials. For each house, your task is to
                make a judgement about the house true sales price and the sales
                price that the AI predicts. After submitting your response, you
                will see the true sales prices, the AI’s prediction and an
                explanation for this prediction.
              </p>

              <ul>
                {["point", "interval"].includes(userExplanationType) ? (
                  <li>
                    The explanation you will receive shows how each feature
                    would have to change such that the predicted house price
                    would be at least $100,000 more than the currently predicted
                    price.
                  </li>
                ) : null}
                {["featureImportance"].includes(userExplanationType) ? (
                  <li>
                    The explanation you will receive shows the impact of each
                    feature on the predicted price, ranging from 0 to 100.
                  </li>
                ) : null}
              </ul>
            </>
          )}
        </>
      )}

      {currentPhase === "2" && (
        <>
          <p>
            In this phase of the experiment you will be presented with
            information about a house. For some properties not all information will be available.
            For each house, your task is to choose an
            agent, either the AI or yourself, to predict the house’s true sales
            price. If you choose not to follow the AI, you will be asked to
            enter your prediction of the house price. You will not receive any
            information about the true sales price or the AI’s predicted sales
            price. Participants performing well in this task have the chance to
            win a gift card.
          </p>

          <p>
            On the top of the screen you will see your score, ranging from 0 to 100. You will start with a score of 100. 
            The goal is to predict the house price as accurately as possible, regardless of whether relying
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
