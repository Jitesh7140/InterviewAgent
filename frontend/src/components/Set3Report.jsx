import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowLeft, BrainCircuit, MessageSquareText, FileCheck, Target, Award, Download, Zap } from 'lucide-react';

const COLORS = ['#10B981', '#F3F4F6']; // Emerald Green aur Light Gray

function Set3Report({ report }) {
  if (!report ) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <p className='text-gray-500 font-medium'>Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScores = []
  } = report;

  // Chart Data
  const overallData = [
    { name: 'Score', value: finalScore },
    { name: 'Remaining', value: Math.max(0, 10 - finalScore) },
  ];

  const trendData = questionWiseScores.map((q, i) => ({
    name: `Q${i + 1}`,
    score: q.score || 0
  }));

  const skills = [
    { label: "Confidence", value: confidence, color: "bg-blue-500", icon: <Zap className="w-4 h-4 text-blue-500" /> },
    { label: "Communication", value: communication, color: "bg-purple-500", icon: <MessageSquareText className="w-4 h-4 text-purple-500" /> },
    { label: "Correctness", value: correctness, color: "bg-emerald-500", icon: <FileCheck className="w-4 h-4 text-emerald-500" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interview Analytics</h1>
              <p className="text-sm text-slate-500">Performance insights & AI feedback</p>
            </div>
          </div>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Overall Score & Skills (Col-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overall Score Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Overall Performance</h3>
              <div className="relative w-full h-48 flex items-center justify-center">
                {/* Fix: Added debounce and explicit height */}
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <PieChart>
                    <Pie data={overallData} innerRadius={60} outerRadius={80} startAngle={90} endAngle={450} dataKey="value" stroke="none">
                      <Cell fill="#10B981" cornerRadius={10} />
                      <Cell fill="#F1F5F9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-5xl font-black text-slate-900">{finalScore.toFixed(1)}</span>
                  <p className="text-xs font-bold text-slate-400">SCORE / 10</p>
                </div>
              </div>
              <div className="mt-6 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-sm font-semibold text-slate-700 italic">
                   {finalScore >= 7 ? "Excellent job! You are ready." : "Keep practicing to improve your score."}
                 </p>
              </div>
            </motion.div>

            {/* Skills Progress Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" /> Skill Evaluation
              </h3>
              <div className="space-y-6">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {skill.icon}
                        <span className="text-sm font-bold text-slate-700">{skill.label}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{skill.value.toFixed(1)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${skill.value * 10}%` }} 
                        transition={{ duration: 1, delay: 0.3 + (i*0.1) }}
                        className={`h-full rounded-full ${skill.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Trend & Questions (Col-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Performance Trend Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Score Trend</h3>
              <div className="w-full h-64">
                {/* Fix: Added minHeight and debounce to prevent width(-1) error */}
                <ResponsiveContainer width="100%" height="100%" minHeight={200} debounce={100}>
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} domain={[0, 10]} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Question Breakdown List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 ml-1">
                <Award className="w-5 h-5 text-emerald-500" /> Question Breakdown
              </h3>
              {questionWiseScores.map((q, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Question {index + 1}</span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{q.question}</h4>
                    </div>
                    <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-center">
                      <span className="text-xl font-black text-slate-900">{q.score}</span>
                      <span className="text-[10px] text-slate-400 block font-bold">/10</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquareText className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase">AI Feedback</span>
                      </div>
                      <p className="text-sm text-emerald-900 leading-relaxed font-medium italic">"{q.feedback || "Good response."}"</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <MetricBox label="Conf." value={q.confidence} />
                      <MetricBox label="Comm." value={q.communication} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small Helper Component
function MetricBox({ label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center flex flex-col justify-center">
      <span className="text-[9px] font-black text-slate-400 uppercase">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value?.toFixed(1) || 0}</span>
    </div>
  );
}

export default Set3Report;