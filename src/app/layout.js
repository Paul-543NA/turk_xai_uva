import { Inter } from "next/font/google";
import "./globals.css";
import { AnswersProvider } from "./context/AnswersContext";

import React from "react";

const inter = Inter({ subsets: ["latin"] });

// My custom bits
import IntervalBar from "@/components/IntervalBar";
const runtimeParams = {
  singleViewMode: false,
};

// End of my custom bits

export const metadata = {
  title: "Guess the price",
  description: "Help us understand AI by guessing the price of houses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      {/* {runtimeParams.singleViewMode ? (
            <IntervalBar lower={30} actual={50} upper={90} />
          ) : (
            { children }
          )}
        </body> */}
      <body className={inter.className}>
        <AnswersProvider>{children}</AnswersProvider>
      </body>
    </html>
  );
}
