import React from "react";
import Link from "next/link";

const CTAsection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Be part of users making smarter betting decisions with our AI-powered predictions.
        </p>
      </div>
    </section>
  );
};

export default CTAsection;