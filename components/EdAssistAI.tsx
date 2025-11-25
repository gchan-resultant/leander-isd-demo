
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, X, Loader2, AlertCircle, Download, Table as TableIcon } from 'lucide-react';

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

  // Handle initial prompt trigger for demos
  useEffect(() => {
    if (isOpen && initialPrompt) {
        const timer = setTimeout(() => {
            handleSend(initialPrompt);
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [isOpen, initialPrompt]);

  const handleSend = async (msgOverride?: string) => {
    const textToSend = msgOverride || input;
    if (!textToSend.trim()) return;
    
    let apiKey: string | undefined;
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
        // @ts-ignore
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      console.warn("Could not access process.env");
    }

    if (!apiKey) {
      setError("API Key is missing. Please configure process.env.API_KEY.");
      return;
    }

    if (!msgOverride) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are EdAssist, an AI assistant for Leander ISD teachers. 
      You are helpful, concise, and focused on student growth and equity.
      Always use the provided context data to answer questions.
      
      Context Data: ${contextData}
      
      Formatting Rules:
      1. If asked to group students, ALWAYS output a Markdown Table with columns: Group Name, Students, Focus Skill.
      2. Use **bold** for emphasis.
      3. Use bullet points for lists.
      
      General Rules:
      1. If asked about attendance vs performance, explicitly look for students with low attendance and low scores.
      2. Keep responses professional, encouraging, and actionable.`;

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

  // Helper to download table data
  const downloadTableAsCSV = (tableData: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + tableData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "edassist_groups.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple Markdown Parser for Tables, Lists, and Bold
  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let inTable = false;
    let tableRows: string[][] = [];

    lines.forEach((line, index) => {
        // Detect Table Row
        if (line.trim().startsWith('|')) {
            if (!inTable) inTable = true;
            // Clean row
            const row = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
            // Skip separator lines (e.g. |---|---|)
            if (!row[0].match(/^-+$/)) {
                tableRows.push(row);
            }
        } else {
            // If we were in a table and now aren't, render the table
            if (inTable) {
                inTable = false;
                elements.push(
                    <div key={`table-${index}`} className="my-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><TableIcon size={12}/> Data Table</span>
                            <button 
                                onClick={() => downloadTableAsCSV(tableRows)}
                                className="text-xs text-blue-600 flex items-center gap-1 hover:underline font-medium"
                            >
                                <Download size={12} /> Export CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        {tableRows[0].map((header, i) => <th key={i} className="px-4 py-2 border-b font-bold">{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows.slice(1).map((row, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                            {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell.replace(/\*\*/g, '')}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                tableRows = [];
            }

            // Render Regular Text (with Bold and List support)
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                elements.push(
                    <div key={index} className="ml-4 flex items-start gap-2 my-1 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                    </div>
                );
            } else if (line.trim() !== '') {
                elements.push(
                    <p key={index} className="mb-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                );
            }
        }
    });

    // Edge case: Table at end of message
    if (inTable && tableRows.length > 0) {
         elements.push(
            <div key="table-end" className="my-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><TableIcon size={12}/> Data Table</span>
                    <button 
                        onClick={() => downloadTableAsCSV(tableRows)}
                        className="text-xs text-blue-600 flex items-center gap-1 hover:underline font-medium"
                    >
                        <Download size={12} /> Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                {tableRows[0].map((header, i) => <th key={i} className="px-4 py-2 border-b font-bold">{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.slice(1).map((row, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                    {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell.replace(/\*\*/g, '')}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return elements;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[60] flex flex-col border-l border-gray-200 transform transition-transform duration-300">
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
              className={`max-w-[90%] p-3 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none text-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
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
