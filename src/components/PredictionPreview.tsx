import React from "react";
import Image from "next/image";

const PredictionPreview = () => {
  const predictions = [
    {
      teams: "Manchester United vs Liverpool",
      prediction: "Home Win (65%)",
      odds: "2.10"
    },
    {
      teams: "Barcelona vs Real Madrid",
      prediction: "Draw (45%)",
      odds: "3.25"
    },
    {
      teams: "Bayern Munich vs Dortmund",
      prediction: "Away Win (55%)",
      odds: "2.80"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Recent Predictions</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          See examples of our accurate match forecasts and betting recommendations.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {predictions.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-500 transition-colors shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.teams}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Prediction:</span>
                <span className="font-medium text-gray-900">{item.prediction}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recommended Odds:</span>
                <span className="font-medium text-primary-500">{item.odds}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PredictionPreview;