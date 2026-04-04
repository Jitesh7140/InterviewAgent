import React from "react";
import {
  Play,
  History,
  Briefcase,
  Mic,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import img from "../../assets/ai-ans.png";
import img2 from "../../assets/resume.png";
import img3 from "../../assets/pdf.png";
import img4 from "../../assets/history.png";

const Home = () => {
  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className=" min-h-screen bg-gray-100 overflow-hidden">
      <Navbar />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-6xl mx-auto px-4 text-center pt-10"
      >
        <motion.div
          variants={fadeInUp}
          className="flex justify-center items-center gap-2 text-emerald-600 font-semibold text-sm mb-6 bg-emerald-50 w-fit mx-auto px-4 py-2 rounded-full border border-emerald-100"
        >
          <Sparkles size={16} /> AI Powered Smart Interview Platform
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]"
        >
          Practice Interviews with <br />
          <span className="text-emerald-500 relative inline-block mt-2">
            AI Intelligence
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-3 bg-emerald-200/50 -z-10 rounded-full blur-[2px]"
            ></motion.span>
          </span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-slate-500 max-w-2xl mx-auto text-xl mb-12 leading-relaxed"
        >
          Role-based mock interviews with smart follow-ups, adaptive difficulty,
          and real-time performance evaluation.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-5 mb-12"
        >
          <Link to="/interview">
            <button className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-black/20 active:scale-95 flex items-center gap-2   ">
              <Play size={18} fill="white" className="inline" />
              Start Interview
            </button>
          </Link>
          <Link to="/history">
            <button className="bg-white border border-slate-200 text-slate-700 px-10 py-4 rounded-full font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              View History
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* --- Steps Cards --- */}
      <div className="px-50 pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative pt-12">
          <div className="absolute -top-6 bg-white border border-emerald-500 p-3 rounded-2xl shadow-md">
            <Briefcase className="text-emerald-500 w-8 h-8" />
          </div>
          <span className="text-emerald-500 font-bold text-xs mb-2 uppercase tracking-widest">
            Step 1
          </span>
          <h3 className="font-bold text-lg mb-3">
            Role & Experience Selection
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            AI adjusts difficulty based on selected job role.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative pt-12">
          <div className="absolute -top-6 bg-white border border-emerald-500 p-3 rounded-2xl shadow-md">
            <Mic className="text-emerald-500 w-8 h-8" />
          </div>
          <span className="text-emerald-500 font-bold text-xs mb-2 uppercase tracking-widest">
            Step 2
          </span>
          <h3 className="font-bold text-lg mb-3">Smart Voice Interview</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Dynamic follow-up questions based on your answers.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative pt-12">
          <div className="absolute -top-6 bg-white border border-emerald-500 p-3 rounded-2xl shadow-md">
            <Clock className="text-emerald-500 w-8 h-8" />
          </div>
          <span className="text-emerald-500 font-bold text-xs mb-2 uppercase tracking-widest">
            Step 3
          </span>
          <h3 className="font-bold text-lg mb-3">Timer Based Simulation</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Real interview pressure with time tracking.
          </p>
        </div>
      </div>

      {/* --- UPDATED COMPACT SECTION --- */}
      <section className="px-50 w-full mx-auto  py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10" // Reduced margin
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Advanced AI <span className="text-emerald-500">Capabilities</span>
          </h2>
        </motion.div>

        {/* Gap reduced to 5 for a tighter look */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FeatureCard
            image={img}
            icon={<BarChart3 size={20} className="text-emerald-500" />}
            title="AI Answer Evaluation"
            desc="Scores communication and technical accuracy."
          />
          <FeatureCard
            image={img2}
            icon={<FileText size={20} className="text-blue-500" />}
            title="Resume Based Interview"
            desc="Questions based on your uploaded CV."
          />
          <FeatureCard
            image={img3}
            icon={<CheckCircle2 size={20} className="text-orange-500" />}
            title="Downloadable PDF Report"
            desc="Detailed breakdown of your strengths."
          />
          <FeatureCard
            image={img4}
            icon={<History size={20} className="text-purple-500" />}
            title="History & Progress"
            desc="Track improvement with detailed analytics."
          />
        </div>
      </section>

      {/* Steps Grid Original mejorado */}
      <section className="bg-slate-900 py-24 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard
              step="01"
              icon={<Briefcase size={24} />}
              title="Role Selection"
              desc="AI adjusts difficulty based on your job role."
            />
            <StepCard
              step="02"
              icon={<Mic size={24} />}
              title="Smart Interview"
              desc="Dynamic follow-up questions in real-time."
            />
            <StepCard
              step="03"
              icon={<Clock size={24} />}
              title="Simulation"
              desc="Real interview pressure with time tracking."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Sub-componente para las tarjetas de Capabilities (Imagen + Texto)
const FeatureCard = ({ image, icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    // Padding (p-4) aur Gap (gap-4) ko kam kiya hai
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-8 group"
  >
    {/* Image container ko fix width di hai taaki card chota ho jaye */}
    <div className="w-[100px] h-[100px] overflow-hidden rounded-xl  p-2 flex items-center justify-center">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    <div className="flex-1">
      <div className="bg-white shadow-sm p-1.5 rounded-lg w-fit mb-2 border border-slate-50">
        {icon}
      </div>
      {/* Title aur description ka font size bhi thoda kam kiya hai */}
      <h4 className="font-bold text-slate-800 text-base mb-1">{title}</h4>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
        {desc}
      </p>
    </div>
  </motion.div>
);

// Sub-componente para los Pasos (Steps)
const StepCard = ({ step, icon, title, desc }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative p-8 border border-slate-700 rounded-3xl"
  >
    <div className="text-emerald-500 mb-4">{icon}</div>
    <span className="text-slate-500 text-xs font-mono mb-2 block">{step}</span>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </motion.div>
);

export default Home;
