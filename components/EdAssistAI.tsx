import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';

interface EdAssistAIProps {
  contextData: string;
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const EdAssistAI: React.FC<EdAssistAIProps> = ({ contextData, isOpen, onClose, initialPrompt }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hello! I'm EdAssist, your instructional co-pilot. I have access to the current student data. How can I help you differentiate instruction or analyze trends today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup Gemini
  const apiKey = process.env.API_KEY || '';
  
  // Handle initial prompt trigger for demos
  useEffect(() => {
    if (isOpen && initialPrompt) {
        handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  const handleSend = async (msgOverride?: string) => {
    const textToSend = msgOverride || input;
    if (!textToSend.trim()) return;
    
    if (!apiKey) {
      setError("API Key is missing. Please configure process.env.API_KEY.");
      return;
    }

    // If manually typed, clear input
    if (!msgOverride) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // System instruction to act as EdAssist
      const systemInstruction = `You are EdAssist, an AI assistant for Leander ISD teachers. 
      You are helpful, concise, and focused on student growth and equity.
      Always use the provided context data to answer questions.
      
      Context Data: ${contextData}
      
      Rules:
      1. If asked about grouping, suggest specific groups (e.g., "Group A: RIT > 240", "Group B: RIT 220-240") based on the data.
      2. If asked about attendance vs performance, explicitly look for students with low attendance and low scores.
      3. If asked about transparency, explain that your recommendations are based strictly on the provided NWEA and attendance metrics, not demographic bias.
      4. Keep responses professional, encouraging, and actionable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemInstruction + "\n\nUser Query: " + textToSend }] }
        ]
      });

      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate response. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200 transform transition-transform duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <Sparkles size={20} className="text-yellow-300" />
          <h2 className="font-semibold">EdAssist AI</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-xs text-gray-500">EdAssist is thinking...</span>
            </div>
          </div>
        )}
        {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded">
                <AlertCircle size={16} />
                {error}
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about differentiation, lesson plans..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className={`p-1.5 rounded-full transition ${
              input ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
             <span className="text-[10px] text-gray-400">Powered by Gemini Enterprise</span>
        </div>
      </div>
    </div>
  );
};

export default EdAssistAI;