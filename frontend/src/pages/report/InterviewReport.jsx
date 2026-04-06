import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare, 
  Trophy, 
  Target,
  BarChart3,
  Zap,
  User,
  Activity
} from "lucide-react";

function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/interview/report/${id}`,
          { withCredentials: true }
        );
        // Aapka response.data directly wo object hai jo aapne share kiya
        if (response.data.success) {
          setReport(response.data);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!report) {
    return <div className="text-center py-20 font-sans">Report not found!</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to History</span>
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Interview Analysis</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of your AI interview performance.</p>
        </div>

        {/* Score Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Overall Score" value={report.finalScore} icon={<Trophy className="text-amber-500" />} color="bg-white" />
          <StatCard title="Confidence" value={report.confidence} icon={<Zap className="text-blue-500" />} color="bg-white" />
          <StatCard title="Communication" value={report.communication} icon={<User className="text-purple-500" />} color="bg-white" />
          <StatCard title="Correctness" value={report.correctness} icon={<CheckCircle2 className="text-emerald-500" />} color="bg-white" />
        </div>

        {/* Question-wise Analysis */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Performance by Question
          </h2>

          {report.questionWiseScores?.map((item, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Question Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                <div className="max-w-[80%]">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Question {index + 1}</span>
                  <h3 className="font-semibold text-slate-800 mt-1 leading-tight">{item.question}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      item.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : 
                      item.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{item.score}</span>
                  <span className="text-xs text-slate-400 block font-medium">/ 10</span>
                </div>
              </div>
              
              <div className="p-5 space-y-5">
                {/* User's Answer */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Activity className="w-3 h-3" /> Your Response
                  </label>
                  <div className="text-slate-700 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed italic">
                    "{item.answer || "No answer recorded."}"
                  </div>
                </div>

                {/* Sub-Metrics & Feedback */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-3">AI Feedback</label>
                    <div className="flex gap-3">
                      <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0" />
                      <p className="text-sm text-indigo-900 font-medium leading-snug">{item.feedback}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Confidence</span>
                      <span className="text-lg font-bold text-slate-800">{item.confidence}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Communication</span>
                      <span className="text-lg font-bold text-slate-800">{item.communication}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} border border-slate-200 p-5 rounded-2xl shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}<span className="text-sm text-slate-300 font-normal">/10</span></p>
    </div>
  );
}

export default InterviewReport;