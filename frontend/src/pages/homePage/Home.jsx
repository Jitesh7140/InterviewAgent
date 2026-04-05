import React from "react";
import { Play, History, Briefcase, Mic, Clock, Sparkles, CheckCircle2, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import img from "../../assets/ai-ans.png";
import img2 from "../../assets/resume.png";
import img3 from "../../assets/pdf.png";
import img4 from "../../assets/history.png";

const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-6xl mx-auto px-6 text-center pt-12 md:pt-20"
      >
        <motion.div
          variants={fadeInUp}
          className="flex justify-center items-center gap-2 text-emerald-600 font-bold text-[10px] md:text-xs mb-6 bg-emerald-50 w-fit mx-auto px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-wider"
        >
          <Sparkles size={14} /> AI Powered Smart Interview Platform
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.2] md:leading-[1.1]"
        >
          Practice Interviews with <br className="hidden md:block" />
          <span className="text-emerald-500 relative inline-block">
            AI Intelligence
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute -bottom-1 md:-bottom-2 left-0 h-2 md:h-3 bg-emerald-200/40 -z-10 rounded-full"
            ></motion.span>
          </span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-slate-500 max-w-2xl mx-auto text-base md:text-xl mb-10 leading-relaxed px-2"
        >
          Role-based mock interviews with smart follow-ups, adaptive difficulty,
          and real-time performance evaluation.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 mb-16 px-4">
          <Link to="/interview" className="w-full sm:w-auto">
            <button className="w-full bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base">
              <Play size={16} fill="white" /> Start Interview
            </button>
          </Link>
          <Link to="/history" className="w-full sm:w-auto">
            <button className="w-full bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm md:text-base">
              View History
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* --- Steps Cards (Mobile Responsive) --- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-20">
        {[
          { step: "01", icon: <Briefcase />, title: "Role Selection", desc: "AI adjusts difficulty based on selected job role." },
          { step: "02", icon: <Mic />, title: "Smart Voice Interview", desc: "Dynamic follow-up questions based on your answers." },
          { step: "03", icon: <Clock />, title: "Timer Simulation", desc: "Real interview pressure with time tracking." },
        ].map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative pt-12">
            <div className="absolute -top-6 bg-white border border-emerald-500 p-3 rounded-2xl shadow-md text-emerald-500">
              {React.cloneElement(item.icon, { size: 28 })}
            </div>
            <span className="text-emerald-500 font-black text-[10px] mb-2 uppercase tracking-widest">Step {item.step}</span>
            <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* --- Advanced Capabilities --- */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Advanced AI <span className="text-emerald-500">Capabilities</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FeatureCard image={img} icon={<BarChart3 size={18} className="text-emerald-500" />} title="AI Answer Evaluation" desc="Scores communication and technical accuracy." color="emerald" />
          <FeatureCard image={img2} icon={<FileText size={18} className="text-blue-500" />} title="Resume Based Interview" desc="Questions based on your uploaded CV." color="blue" />
          <FeatureCard image={img3} icon={<CheckCircle2 size={18} className="text-orange-500" />} title="Downloadable Reports" desc="Detailed breakdown of your strengths." color="orange" />
          <FeatureCard image={img4} icon={<History size={18} className="text-purple-500" />} title="History & Progress" desc="Track improvement with detailed analytics." color="purple" />
        </div>
      </section>

      {/* Dark Step Footer */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
           <StepCard step="01" icon={<Briefcase size={22} />} title="Role Selection" desc="AI adjusts difficulty based on your job role." />
           <StepCard step="02" icon={<Mic size={22} />} title="Smart Interview" desc="Dynamic follow-up questions in real-time." />
           <StepCard step="03" icon={<Clock size={22} />} title="Simulation" desc="Real interview pressure with time tracking." />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ image, icon, title, desc, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 group transition-all"
  >
    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-slate-50 rounded-xl p-2 flex items-center justify-center">
      <img src={image} alt={title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
    </div>
    <div className="text-center sm:text-left">
      <div className={`bg-white shadow-sm p-1.5 rounded-lg w-fit mb-2 border border-slate-50 mx-auto sm:mx-0`}>
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">{title}</h4>
      <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const StepCard = ({ step, icon, title, desc }) => (
  <div className="relative p-6 md:p-8 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-colors group">
    <div className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <span className="text-slate-600 text-[10px] font-mono mb-2 block tracking-widest">{step}</span>
    <h3 className="text-white font-bold text-base md:text-lg mb-2">{title}</h3>
    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;