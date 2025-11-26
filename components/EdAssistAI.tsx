
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, X, Loader2, AlertCircle, Download, Table as TableIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EdAssistAIProps {
  contextData: string;
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  role?: string;
}

const EdAssistAI: React.FC<EdAssistAIProps> = ({ contextData, isOpen, onClose, initialPrompt, role }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate Persona-Aware Greeting
  useEffect(() => {
    if (messages.length === 0) {
        let greeting = "Hello! I'm EdAssist, your virtual assistant. I have access to the current student data. How can I help you today?";
        
        switch(role) {
            case 'Teacher':
                greeting = "Hello! I'm EdAssist, your instructional virtual assistant. I have access to your classroom data. How can I help you differentiate instruction or analyze trends today?";
                break;
            case 'Principal':
                greeting = "Hello! I'm EdAssist, your campus virtual assistant. I have access to Rouse High School's performance metrics. Ready to analyze cohort growth or identify instructional support needs?";
                break;
            case 'District Administrator':
                greeting = "Hello! I'm EdAssist, your district virtual assistant. I have access to district-wide enrollment, finance, and assessment data. How can I assist with strategic planning or compliance?";
                break;
            case 'Parent':
                greeting = "Hello! I'm EdAssist, your family virtual assistant. I'm here to help you understand your child's progress, goals, and report cards. What questions do you have?";
                break;
            case 'Board Member':
                greeting = "Hello! I'm EdAssist, your governance support assistant. I have access to district-wide strategic goals, longitudinal trends, and equity data. How can I help you prepare for the next meeting or analyze gap closure?";
                break;
        }
        setMessages([{ role: 'model', text: greeting }]);
    }
  }, [role]);

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
      
      const systemInstruction = `You are EdAssist, an AI assistant for Leander ISD. 
      Your persona is a helpful virtual assistant for a ${role || 'user'}.
      You have access to real-time data.
      
      Context Data: ${contextData}
      
      Chart Generation Rules:
      If the user asks for a visualization (chart, graph, trend), you MUST:
      1. Return a JSON object in a code block labeled \`json\`.
      2. The JSON must have this structure: { "type": "bar" | "line" | "pie", "data": [{ "name": "Label", "value": 10, "fill": "#hex" }], "title": "Chart Title", "xAxis": "label", "yAxis": "value" }.
      3. Provide a brief textual summary AFTER the JSON block.
      
      Formatting Rules:
      1. For tables, use Markdown.
      2. Use **bold** for emphasis.
      3. Keep text responses professional and concise.`;

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

  const downloadChartData = (data: any[]) => {
      if (!data || data.length === 0) return;
      const headers = Object.keys(data[0]);
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...data.map(row => headers.map(h => row[h]).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "chart_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Chart Renderer
  const renderChart = (jsonString: string) => {
      try {
          const chartConfig = JSON.parse(jsonString);
          const { type, data, title, xAxis, yAxis } = chartConfig;
          
          return (
              <div className="my-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-700 text-sm">{title}</h4>
                      <button onClick={() => downloadChartData(data)} className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                          <Download size={12} /> Export Data
                      </button>
                  </div>
                  <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          {type === 'bar' ? (
                              <BarChart data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                                  <YAxis tick={{fontSize: 10}} />
                                  <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px'}} cursor={{fill: '#f9fafb'}} />
                                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    {data.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
                                    ))}
                                  </Bar>
                              </BarChart>
                          ) : type === 'pie' ? (
                              <PieChart>
                                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {data.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill || '#8884d8'} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                              </PieChart>
                          ) : (
                              <LineChart data={data}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                                  <YAxis tick={{fontSize: 10}} />
                                  <Tooltip contentStyle={{fontSize: '12px', borderRadius: '4px'}} />
                                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} />
                              </LineChart>
                          )}
                      </ResponsiveContainer>
                  </div>
              </div>
          );
      } catch (e) {
          return <div className="text-xs text-red-500 bg-red-50 p-2 rounded">Error rendering chart.</div>;
      }
  };

  // Simple Markdown Parser for Tables, Lists, and Bold
  const renderMessageText = (text: string) => {
    // Extract JSON blocks for Charts
    const jsonBlockRegex = /```json\n([\s\S]*?)\n```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = jsonBlockRegex.exec(text)) !== null) {
        // Text before JSON
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        // JSON Chart
        parts.push({ type: 'chart', content: match[1] });
        lastIndex = jsonBlockRegex.lastIndex;
    }
    // Remaining text
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts.map((part, partIdx) => {
        if (part.type === 'chart') {
            return <React.Fragment key={partIdx}>{renderChart(part.content)}</React.Fragment>;
        }

        const lines = part.content.split('\n');
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
                <div key={`table-end-${partIdx}`} className="my-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
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

        return <React.Fragment key={partIdx}>{elements}</React.Fragment>;
    });
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[60] flex flex-col border-l border-gray-200 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
    >
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
