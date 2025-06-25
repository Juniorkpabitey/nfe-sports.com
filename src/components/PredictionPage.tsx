'use client';

import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaFutbol } from "react-icons/fa";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from 'next/image';

// API Configuration
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
const SITE_NAME = "NFE Football Predictor";
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : "";

// League mappings
const footballLeagues = [
  { id: 39, name: "Premier League", href: "premier-league", code: "PL", emblem: "/img/leagues/premier_league.webp" },
  { id: 140, name: "Primera Division", href: "la-liga", code: "PD", emblem: "/img/leagues/laliga.svg" },
  { id: 78, name: "Bundesliga", href: "bundesliga", code: "BL1", emblem: "/img/leagues/bundesliga.webp" },
  { id: 135, name: "Serie A", href: "serie-a", code: "SA", emblem: "/img/leagues/serie_a.webp" },
  { id: 61, name: "Ligue 1", href: "ligue-1", code: "FL1", emblem: "/img/leagues/ligue_1.webp" },
  { id: 2, name: "Champions League", href: "champions-league", code: "CL", emblem: "/img/leagues/championship.webp" },
  { id: 3, name: "Europa League", href: "europa-league", code: "EL", emblem: "/img/leagues/championship.webp" },
];

const bettingPlatforms = [
  { name: "ilobet", url: "https://www.ilobet.com", color: "text-blue-400" },
  { name: "BangBet", url: "https://www.bangbet.com", color: "text-purple-400" },
  { name: "1xBet", url: "https://1xbet.com", color: "text-green-400" },
  { name: "Betway", url: "https://www.betway.com", color: "text-yellow-400" },
  { name: "Bet365", url: "https://www.bet365.com", color: "text-red-400" },
];

const SYSTEM_PROMPT = `You are an expert football analyst AI. Analyze these factors for prediction:
- Last 5 matches performance for both teams
- Head-to-head statistics
- Current league position
- Injury reports and key player availability
- Home/away performance
- Recent tactical formations
- Weather conditions
- Referee statistics

Provide prediction with this EXACT format:

**Match Prediction**  
[Home Team] vs [Away Team] - [Date] [Time]  

**Predicted Winner**: [Team] (Confidence: [X]%)  

**Key Factors**:  
- Factor 1  
- Factor 2  
- Factor 3  

**Tactical Analysis**:  
[Detailed tactical breakdown]  

**Recommended Bet**: [Bet type] @ [Odds]  
Available at: [Betting Platform Links]  

**Risk Assessment**: [Risk level and explanation]  

Use bold for section headers and proper markdown formatting. Include current statistics and form.`;

interface Message {
  type: "userMsg" | "responseMsg";
  text: string;
}

const PredictionPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLeague, setSelectedLeague] = useState(footballLeagues[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate prediction using OpenRouter API
  const generatePrediction = async (userPrompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key not configured");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            { 
              role: "system", 
              content: SYSTEM_PROMPT 
            },
            { 
              role: "user", 
              content: `${selectedLeague.name} match prediction request:\n${userPrompt}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          top_p: 0.9,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error?.message || "Unknown error";
        throw new Error(`OpenRouter API Error: ${errorMessage}`);
      }
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from API");
      }

      return data.choices[0].message.content;
    } catch (err) {
      console.error("Prediction error:", err);
      const errorMsg = err instanceof Error ? err.message : "Prediction failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionRequest = async () => {
    if (!message.trim()) {
      setError("Please enter match details");
      return;
    }

    try {
      const prediction = await generatePrediction(message);
      setMessages(prev => [
        ...prev,
        { type: "userMsg", text: message },
        { type: "responseMsg", text: prediction }
      ]);
      setMessage("");
    } catch {
      // Error already handled in generatePrediction
    }
  };

  const newChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <FaFutbol className="text-2xl text-green-500" />
            <h1 className="text-xl md:text-2xl font-bold">{SITE_NAME}</h1>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={newChat}
              className="bg-gray-800 px-4 py-2 text-sm rounded-full hover:bg-gray-700"
            >
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 py-6">
        {/* League Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {footballLeagues.map((league) => (
            <motion.button
              key={league.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLeague(league)}
              className={`px-3 py-1 text-xs md:px-4 md:py-2 md:text-sm rounded-full flex items-center gap-2 ${
                selectedLeague.id === league.id
                  ? "bg-green-500 text-black font-bold"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {league.emblem && (
                <div className="w-4 h-4 relative">
                  <Image 
                    src={league.emblem} 
                    alt={league.name} 
                    fill 
                    className="object-contain" 
                    sizes="16px"
                  />
                </div>
              )}
              {league.name}
            </motion.button>
          ))}
        </div>

        {/* Betting Platforms */}
        {messages.length === 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Recommended Betting Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {bettingPlatforms.map((platform, index) => (
                <motion.a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center"
                >
                  <FaFutbol className={`text-2xl mb-2 ${platform.color}`} />
                  <span className="font-medium">{platform.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Response Display */}
        {messages.length > 0 && (
          <div className="flex-1 mb-6 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-gray-800 text-white p-4 md:p-6 rounded-2xl ${
                  msg.type === "userMsg" ? "ml-auto max-w-[80%]" : "mr-auto max-w-[90%]"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {msg.type === "responseMsg" && <FaFutbol className="text-green-500" />}
                  <h3 className="font-semibold">
                    {msg.type === "userMsg" ? "Your Query" : "AI Prediction"}
                  </h3>
                </div>
                {msg.type === "responseMsg" ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-green-400" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-1 text-green-400" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 text-green-300" {...props} />,
                        p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-green-300" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="my-1" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Input Container */}
        <div className="sticky bottom-0 bg-gray-900 pt-4 pb-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 mb-2 text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <div className="bg-gray-800 flex items-center py-3 px-4 rounded-full border border-gray-700">
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError(null);
              }}
              type="text"
              placeholder="Enter match details (e.g. 'Manchester United vs Liverpool this weekend')"
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handlePredictionRequest()}
              disabled={isLoading}
            />
            <button 
              onClick={handlePredictionRequest}
              disabled={isLoading}
              className="text-green-500 text-2xl p-2 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Predict match"
            >
              {isLoading ? (
                <div className="animate-spin h-6 w-6 border-2 border-green-500 rounded-full border-t-transparent"></div>
              ) : (
                <IoSend />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PredictionPage;