'use client';

import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaFutbol, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from 'next/image';

// API Configuration
const FOOTBALL_DATA_API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY || "";
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

interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    crest: string;
  };
  score?: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    name: string;
  };
  venue?: string;
}

const MatchCard = ({ match, onClick }: { match: Match, onClick: () => void }) => {
  const getTime = new Date(match.utcDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">
          {new Date(match.utcDate).toLocaleDateString()}
        </span>
        <span className="text-gray-400 text-sm">{getTime}</span>
      </div>
      
      <div className="grid grid-cols-3 items-center mb-2">
        <div className="flex items-center">
          <div className="w-6 h-6 relative mr-2">
            <Image 
              src={match.homeTeam.crest || ""} 
              alt={match.homeTeam.name} 
              fill 
              className="object-contain" 
              sizes="24px"
            />
          </div>
          <p className="text-sm line-clamp-1">{match.homeTeam.name}</p>
        </div>
        
        <div className="px-2 m-auto flex justify-center items-center bg-slate-600 rounded-md">
          {match.status === 'FINISHED' ? (
            <p className="py-1 text-teal-400 text-xs">
              {match.score?.fullTime.home ?? '-'} : {match.score?.fullTime.away ?? '-'}
            </p>
          ) : (
            <p className="py-1 text-teal-400 text-xs">VS</p>
          )}
        </div>
        
        <div className="flex items-center justify-end">
          <p className="text-sm text-right line-clamp-1">{match.awayTeam.name}</p>
          <div className="w-6 h-6 relative ml-2">
            <Image 
              src={match.awayTeam.crest || ""} 
              alt={match.awayTeam.name} 
              fill 
              className="object-contain" 
              sizes="24px"
            />
          </div>
        </div>
      </div>
      
      <div className="text-gray-400 text-sm text-center mt-2 line-clamp-1">
        {match.venue || "Unknown venue"} • {match.competition.name}
      </div>
      
      <button 
        className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-sm transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Predict This Match
      </button>
    </motion.div>
  );
};

const PredictionPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLeague, setSelectedLeague] = useState(footballLeagues[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "valid" | "invalid">("checking");

  // Check API key validity
  useEffect(() => {
    const checkApiKey = async () => {
      if (!FOOTBALL_DATA_API_KEY) {
        setApiKeyStatus("invalid");
        setError("Football Data API key not configured. Using sample data.");
        setMatches(getSampleMatches());
        return;
      }

      try {
        const testResponse = await fetch(
          `https://api.football-data.org/v4/competitions/PL/matches`,
          {
            method: "GET",
            headers: {
              "X-Auth-Token": FOOTBALL_DATA_API_KEY,
            },
          }
        );

        if (testResponse.status === 403) {
          setApiKeyStatus("invalid");
          setError("Invalid Football Data API key. Using sample data.");
          setMatches(getSampleMatches());
        } else {
          setApiKeyStatus("valid");
          fetchMatches(selectedLeague.code);
        }
      } catch (err) {
        console.error("API key check failed:", err);
        setApiKeyStatus("invalid");
        setError("Failed to verify API key. Using sample data.");
        setMatches(getSampleMatches());
      }
    };

    checkApiKey();
  }, []);

  // Fetch matches from football-data.org API
  const fetchMatches = async (competitionCode: string) => {
    if (apiKeyStatus !== "valid") {
      setMatches(getSampleMatches());
      return;
    }

    setIsFetchingMatches(true);
    try {
      const response = await fetch(
        `https://api.football-data.org/v4/competitions/${competitionCode}/matches`,
        {
          method: "GET",
          headers: {
            "X-Auth-Token": FOOTBALL_DATA_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedMatches = data.matches
        .filter((match: any) => match.status === "SCHEDULED" || match.status === "FINISHED")
        .map((match: any) => ({
          id: match.id,
          utcDate: match.utcDate,
          status: match.status,
          homeTeam: {
            id: match.homeTeam.id,
            name: match.homeTeam.name,
            crest: match.homeTeam.crest || "",
          },
          awayTeam: {
            id: match.awayTeam.id,
            name: match.awayTeam.name,
            crest: match.awayTeam.crest || "",
          },
          score: match.score,
          competition: match.competition,
          venue: match.venue || "Unknown venue"
        }));

      setMatches(formattedMatches.slice(0, 10));
      setError(null);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Could not load matches. Using sample data.");
      setMatches(getSampleMatches());
    } finally {
      setIsFetchingMatches(false);
    }
  };

  // Fallback sample matches
  const getSampleMatches = (): Match[] => [
    {
      id: 1,
      utcDate: new Date().toISOString(),
      status: "SCHEDULED",
      homeTeam: {
        id: 1,
        name: "Arsenal",
        crest: "",
      },
      awayTeam: {
        id: 2,
        name: "Chelsea",
        crest: "",
      },
      competition: {
        name: "Premier League"
      },
      venue: "Emirates Stadium"
    },
    {
      id: 2,
      utcDate: new Date(Date.now() + 86400000).toISOString(),
      status: "SCHEDULED",
      homeTeam: {
        id: 3,
        name: "Barcelona",
        crest: "",
      },
      awayTeam: {
        id: 4,
        name: "Real Madrid",
        crest: "",
      },
      competition: {
        name: "La Liga"
      },
      venue: "Camp Nou"
    }
  ];

  // Fetch matches when league changes
  useEffect(() => {
    if (selectedLeague.code && apiKeyStatus === "valid") {
      fetchMatches(selectedLeague.code);
    } else if (apiKeyStatus === "invalid") {
      setMatches(getSampleMatches());
    }
  }, [selectedLeague, apiKeyStatus]);

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
              content: `${selectedLeague.name} match prediction request:\n${userPrompt}\n\nCurrent matches: ${JSON.stringify(matches.slice(0, 3))}` 
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

  const handlePredictionRequest = async (match?: Match) => {
    const query = match 
      ? `${match.homeTeam.name} vs ${match.awayTeam.name} on ${new Date(match.utcDate).toLocaleDateString()} at ${new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${match.competition.name})`
      : message;

    if (!query.trim()) {
      setError("Please enter or select a match");
      return;
    }

    try {
      const prediction = await generatePrediction(query);
      console.log("Received prediction:", prediction); // Debug log
      setMessages(prev => [
        ...prev,
        { type: "userMsg", text: query },
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

        {/* API Key Warning */}
        {apiKeyStatus === "invalid" && (
          <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-3 rounded-lg mb-6 text-sm">
            <p>Warning: Football Data API key is not configured or invalid. Using sample data.</p>
            <p className="mt-1">For full functionality, please configure a valid API key.</p>
          </div>
        )}

        {/* Upcoming Matches */}
        {messages.length === 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {isFetchingMatches ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Loading {selectedLeague.name} Matches...
                </>
              ) : (
                `Upcoming ${selectedLeague.name} Matches`
              )}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onClick={() => handlePredictionRequest(match)}
                />
              ))}
            </div>
          </div>
        )}

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
              placeholder="Enter match or select from above"
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handlePredictionRequest()}
              disabled={isLoading}
            />
            <button 
              onClick={() => handlePredictionRequest()}
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