import React from 'react';
import { UserRole } from '../types';
import { X, Lightbulb, Target, Shield, MessageSquare } from 'lucide-react';

interface DemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  appVersion: 'pilot' | 'future';
}

const DemoGuide: React.FC<DemoGuideProps> = ({ isOpen, onClose, role, appVersion }) => {
  if (!isOpen) return null;

  const getContent = () => {
    // --------------------------------------------------------------------------
    // PILOT VIEW STRATEGY
    // --------------------------------------------------------------------------
    if (appVersion === 'pilot') {
      return {
        title: "The Commercial Insight (First 10 Mins)",
        insight: "Disrupt their thinking. Don't start with features.",
        talkingPoints: [
          "Acknowledge the pain: '15+ disparate systems' is the root cause.",
          "Re-frame: Choosing a COTS vendor (PowerSchool) consolidates this mess under a proprietary lock. That is a monopoly risk.",
          "Our Solution: A True Data Lake (Google BigQuery) that you OWN. We are the implementers, not the gatekeepers.",
          "Pilot View: Show this Looker Studio dashboard. It represents 'meeting them where they are' but on modern infrastructure.",
          "De-Risking: We solve the fragmentation today without limiting your future."
        ],
        action: "Show the filters and the 'Open' nature of the data connection."
      };
    }

    // --------------------------------------------------------------------------
    // FUTURE VISION STRATEGY
    // --------------------------------------------------------------------------
    switch (role) {
      case UserRole.STUDENT:
        return {
          title: "Student Agency & Portfolio",
          insight: "From 'Passive Tracking' to 'Active Ownership'.",
          talkingPoints: [
            "RFP Requirement: Student adding an artifact based on a set goal.",
            "RFP Requirement: IEP/504 Visibility. Show the 'Personalized Plan' tag on goals.",
            "Differentiation: Show the 'Elementary' vs 'High School' toggle. This proves we understand age-appropriate UI.",
            "Strategic Tie: This isn't just a portal; it's a tool to teach students how to analyze their own growth."
          ],
          action: "1. Toggle 'Elementary Mode'. 2. Upload an Artifact. 3. Highlight the IEP/504 tag on the goal."
        };
      case UserRole.PARENT:
        return {
          title: "Parent Transparency & Equity",
          insight: "Breaking down barriers to engagement.",
          talkingPoints: [
            "RFP Requirement: View performance/goals over multiple years.",
            "RFP Requirement: 'What if the parent needs a language other than English?'",
            "Challenger Link: Most portals are static. Ours is a real-time window into the classroom.",
            "Strategic Tie: We use AI to translate complex data into actionable insights for parents."
          ],
          action: "1. Click the 'Español' toggle immediately. 2. Show the longitudinal Line Chart (Math/Reading)."
        };
      case UserRole.TEACHER:
        return {
          title: "Teacher Time Savings",
          insight: "Solving the 'Fragmented Landscape'.",
          talkingPoints: [
            "Problem: Teachers currently sift through 3 systems (Eduphoria, eSchool, Canvas) to prep for a conference.",
            "Solution: The Unified View. All data in one screen.",
            "RFP Requirement: Accessing multi-year data for parent conferences.",
            "AI Demo: Use the 'EdAssist AI' to group students. This shows 'Just-in-time data' for intervention."
          ],
          action: "1. Launch EdAssist AI. 2. Ask it to group students based on risk scores."
        };
      case UserRole.PRINCIPAL:
      case UserRole.ADMIN:
        return {
          title: "District & Campus Leadership",
          insight: "Operational Excellence & ROI.",
          talkingPoints: [
            "RFP Requirement: Campus leader identifying students growing but not meeting goals (Cohorts).",
            "RFP Requirement: District Admin accessing TEKS achievement over multiple years.",
            "The 'Data Studio' Tab: This is the 'Kill Shot' against vendor lock-in. Show how we can drag-and-drop Munis (Finance) vs NWEA (Academic).",
            "Strategic Tie: Only an open Data Lake allows you to cross-reference Staffing/Finance data with Student outcomes."
          ],
          action: "1. Go to 'Data Studio' tab. 2. Drag Munis + NWEA. 3. Show the 'Program ROI' chart."
        };
      case UserRole.BOARD:
        return {
          title: "Board Strategic Oversight",
          insight: "Governance & Long-Term Trends.",
          talkingPoints: [
            "RFP Requirement: Board member reviewing district-wide progress.",
            "Focus: High-level trends, not row-level data.",
            "Gap Analysis: Show the equity breakdown (Eco Dis / SPED gaps).",
            "Strategic Tie: Validates the investment in the platform by showing clear progress toward strategic goals."
          ],
          action: "1. Toggle the Assessment Dropdown. 2. Highlight the 'Gap Analysis' chart."
        };
      default:
        return {
          title: "Select a Role",
          insight: "Navigate to a specific view to see the demo script.",
          talkingPoints: [],
          action: "Select a role from the bottom switcher."
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed top-20 right-6 w-96 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-start">
        <div className="flex items-center space-x-2">
            <Lightbulb className="text-yellow-300 animate-pulse" size={20} />
            <div>
                <h3 className="font-bold text-sm tracking-wide uppercase text-blue-100">Presenter Mode</h3>
                <h2 className="font-bold text-lg leading-tight">{content.title}</h2>
            </div>
        </div>
        <button onClick={onClose} className="text-blue-200 hover:text-white transition">
            <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
        
        {/* The Insight */}
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-1">
                <Target size={14} /> Strategic Goal
            </div>
            <p className="text-sm font-medium leading-relaxed">{content.insight}</p>
        </div>

        {/* Talking Points */}
        <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-2">
                <MessageSquare size={14} /> Talk Track (Script)
            </div>
            <ul className="space-y-3">
                {content.talkingPoints.map((point, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* The Action */}
        <div className="bg-emerald-900/30 p-3 rounded-lg border border-emerald-800/50">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
                <Shield size={14} /> Required Action
            </div>
            <p className="text-sm text-emerald-100">{content.action}</p>
        </div>

        <div className="text-[10px] text-slate-500 text-center pt-2">
            Resultant Internal Use Only • Do Not Project
        </div>
      </div>
    </div>
  );
};

export default DemoGuide;