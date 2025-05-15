// Import necessary modules and components
import { FaBrain, FaUsers, FaClock } from "react-icons/fa6";

const Features: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12 text-black">Why NFE?</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-white">
        
        {/* Feature: Smart Predictions */}
        <div className="p-6 bg-black rounded-xl shadow-md flex flex-col items-start gap-4">
          <FaBrain className="text-white text-3xl" />
          <h4 className="text-lg font-semibold text-white">Smart Predictions</h4>
          <p>Our engine leverages machine learning for accurate match outcomes.</p>
        </div>
        
        {/* Feature: Team Insights */}
        <div className="p-6 bg-black rounded-xl shadow-md flex flex-col items-start gap-4">
          <FaUsers className="text-white text-3xl" />
          <h4 className="text-lg font-semibold text-white">Team Insights</h4>
          <p>Compare recent forms, player stats, and team dynamics.</p>
        </div>
        
        {/* Feature: Live Updates */}
        <div className="p-6 bg-black rounded-xl shadow-md flex flex-col items-start gap-4">
          <FaClock className="text-white text-3xl" />
          <h4 className="text-lg font-semibold text-white">Live Updates</h4>
          <p>Real-time changes as lineups and match data evolve.</p>
        </div>

      </div>
    </section>
  );
};

export default Features;
