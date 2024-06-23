"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/form");
  };
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            You are about to take part in a study of human AI collaboration. We
            are very excited to count you as one of our participants! It will
            only take a few minutes and if you do well you might even sin a gift
            card!
          </p>
          <button className="btn btn-primary" onClick={handleClick}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
