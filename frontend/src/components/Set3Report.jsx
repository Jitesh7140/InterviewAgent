import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowLeft, BrainCircuit, MessageSquareText, FileCheck, Target, Award, Download, AlertTriangle } from 'lucide-react';

const COLORS = ['#10B981', '#E5E7EB']; // Green for filled, Light Gray for empty

function Set3Report({ report }) {
  if (!report || !report.success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 font-sans'>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-gray-500 text-lg font-semibold flex items-center gap-3'
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          Analyzing your interview data...
        </motion.p>
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

  // Data preparation for the overall performance donut chart
  const overallPerformanceData = [
    { name: 'Score', value: finalScore },
    { name: 'Remaining', value: 10 - finalScore },
  ];

  // Data preparation for the performance trend area chart
  const performanceTrendData = questionWiseScores.map((q, index) => ({
    name: `Q${index + 1}`,
    score: q.score || 0
  }));

  // Skill evaluation data
  const skills = [
    { label: "Confidence", value: confidence, icon: <BrainCircuit className="w-5 h-5 text-blue-500" /> },
    { label: "Communication", value: communication, icon: <MessageSquareText className="w-5 h-5 text-purple-500" /> },
    { label: "Correctness", value: correctness, icon: <FileCheck className="w-5 h-5 text-emerald-500" /> }
  ];

  // Dynamic feedback texts based on final score
  let performanceTagline = "";
  let performanceStatus = "";

  if (finalScore >= 8) {
    performanceStatus = "Excellent Performance!";
    performanceTagline = "You demonstrate exceptional clarity and structured responses. Ready for top job opportunities.";
  } else if (finalScore >= 6) {
    performanceStatus = "Good Foundation!";
    performanceTagline = "Strong performance, but needs slight refinement in technical depth or articulation before interviews.";
  } else if (finalScore >= 4) {
    performanceStatus = "Needs Improvement.";
    performanceTagline = "We recommend more practice on core technical concepts and answer structuring.";
  } else {
    performanceStatus = "Not interview-ready yet.";
    performanceTagline = "Significant focus on key concepts and communication is needed before proceeding to interviews.";
  }

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
          <div className='flex items-center gap-4' >
            <button className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Analytics Dashboard</h1>
              <p className="text-slate-500 mt-1">AI-powered insights based on your recent performance.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2.5 hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Detailed Report (PDF)
          </motion.button>
        </div>

        {/* --- Main Dashboard Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* Left Column (Overall & Skill Evaluation) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Overall Performance Card */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <h2 className="text-lg font-semibold text-gray-600 mb-6">Overall Performance</h2>
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallPerformanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      startAngle={90}
                      endAngle={450}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {overallPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={index === 0 ? 10 : 0}/>
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-4xl font-extrabold text-slate-900">{finalScore.toFixed(1)}</p>
                  <p className="text-sm font-medium text-gray-400">out of 10</p>
                </div>
              </div>
              <div className="mt-8 space-y-2 bg-gray-50 p-5 rounded-2xl border border-gray-100 w-full">
                <p className="font-bold text-slate-900 text-base">{performanceStatus}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{performanceTagline}</p>
              </div>
            </motion.div>

            {/* Skill Evaluation Card */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-600 mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-green-600"/>Skill Evaluation</h2>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        {skill.icon}
                        <span className="font-medium text-slate-800 text-base">{skill.label}</span>
                      </div>
                      <span className="text-lg font-bold text-slate-950">{skill.value.toFixed(1)} <span className='text-sm text-gray-400 font-normal'>/ 10</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value * 10}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2, type: 'spring' }}
                        className={`h-full rounded-full ${
                          skill.label === "Confidence" ? "bg-blue-500" :
                          skill.label === "Communication" ? "bg-purple-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column (Performance Trend & Question Breakdown) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Performance Trend Card */}
            <motion.div variants={cardVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-600 mb-6">Performance Trend (Score per Question)</h2>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                    <Tooltip cursor={{ stroke: '#10B981', strokeWidth: 1 }} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '12px'}} />
                    <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" activeDot={{r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Question Breakdown Section */}
            <motion.div variants={cardVariants} className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2.5">
                <Award className="w-6 h-6 text-green-600"/> Detailed Question Breakdown
              </h2>
              {questionWiseScores.map((q, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-green-100 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className='flex-1' >
                      <p className="text-sm font-semibold text-green-600 mb-1.5 uppercase tracking-wide">Question {index + 1}</p>
                      <h3 className="text-lg font-medium text-slate-900 leading-snug">{q.question}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-3xl font-extrabold text-slate-950">{q.score?.toFixed(1) || 0}</p>
                      <p className="text-xs font-medium text-gray-400">/ 10</p>
                    </div>
                  </div>
                  
                  {q.feedback && (
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3">
                        <div className='flex items-center gap-2 text-slate-600' >
                          <MessageSquareText className="w-5 h-5 text-gray-400"/>
                          <p className="text-sm font-semibold uppercase text-gray-500 tracking-wider">AI Feedback</p>
                        </div>
                      <p className="text-slate-800 text-sm italic leading-relaxed font-medium">"{q.feedback}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-blue-50/70 text-blue-950 p-3.5 rounded-xl text-center border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Confidence</p>
                      <p className="text-xl font-bold">{q.confidence?.toFixed(1) || 0}</p>
                    </div>
                    <div className="bg-purple-50/70 text-purple-950 p-3.5 rounded-xl text-center border border-purple-100">
                      <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Communication</p>
                      <p className="text-xl font-bold">{q.communication?.toFixed(1) || 0}</p>
                    </div>
                    <div className="bg-emerald-50/70 text-emerald-950 p-3.5 rounded-xl text-center border border-emerald-100">
                      <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">Correctness</p>
                      <p className="text-xl font-bold">{q.correctness?.toFixed(1) || 0}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </motion.div>

        {/* --- Footer (Optional) --- */}
        <div className="mt-16 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>&copy; 2024 Your Interview Platform. All Performance Data is AI-Generated.</p>
        </div>

      </div>
    </div>
  );
}

export default Set3Report;