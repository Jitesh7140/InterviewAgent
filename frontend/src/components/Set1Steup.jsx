import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mic,
  BarChart3,
  Briefcase,
  FileUp,
  ChevronDown,
  CheckCircle,
  GraduationCap,
  Loader2,
} from "lucide-react";
import axios from "axios";

function Set1Setup({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setmode] = useState("");
  const [file, setFile] = useState(null);
  const [project, setProject] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const fileInputRef = useRef(null);

  const isButtonDisabled =
    role.trim().length === 0 || experience.trim().length === 0 || mode === "";

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisDone(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!file) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/interview/resume`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const data = response.data;
      console.log(data);

      if (data.role) setRole(data.role);
      if (data.experience) setExperience(data.experience);
      if (data.projects) setProject(data.projects);
      if (data.skills) setSkills(data.skills);
      if (data.resumeText) setResumeText(data.resumeText);

      setAnalysisDone(true);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartInterview = () => {
    onStart &&
      onStart({ role, experience, mode, file, project, skills, resumeText });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden"
      >
        {/* Left Side */}
        <div className="bg-green-50 p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-slate-800 mb-4"
          >
            Start Your AI Interview
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-600 mb-8">
            Practice real interview scenarios powered by AI. Improve
            communication and confidence.
          </motion.p>

          <div className="space-y-4">
            {[
              { icon: <User size={20} />, text: "Choose Role & Experience" },
              { icon: <Mic size={20} />, text: "Smart Voice Interview" },
              { icon: <BarChart3 size={20} />, text: "Performance Analytics" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4"
              >
                <div className="text-green-600">{item.icon}</div>
                <span className="text-slate-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 md:w-1/2 bg-white">
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-slate-800 mb-8"
          >
            Interview SetUp
          </motion.h2>

          <div className="space-y-5">
            {" "}
            {/* form tag hata kar div use kar sakte hain error se bachne ke liye */}
            {/* 1. Role Input */}
            <motion.div variants={itemVariants} className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter role (e.g. React Developer)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
              />
            </motion.div>
            {/* 2. Experience Input */}
            <motion.div variants={itemVariants} className="relative">
              <Briefcase
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
              />
            </motion.div>
            {/* 3. Interview Type (Mode) - Ab ye bhi required hai */}
            <motion.div variants={itemVariants} className="relative">
              <GraduationCap
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <select
                value={mode}
                onChange={(e) => setmode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-green-400 focus:outline-none bg-white cursor-pointer"
              >
                <option value="technical" disabled>
                  Select Interview Type
                </option>
                <option value="technical">Technical Interview</option>
                <option value="HR">HR Interview</option> 
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                size={18}
              />
            </motion.div>
            {/* File Upload UI */}
            <div
              onClick={() => !analyzing && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all ${
                file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <div
                className={`${file ? "bg-green-500" : "bg-green-100"} p-3 rounded-lg mb-2`}
              >
                {file ? (
                  <CheckCircle className="text-white" size={24} />
                ) : (
                  <FileUp className="text-green-600" size={24} />
                )}
              </div>
              <p className="text-xs font-medium">
                {file ? `Selected: ${file.name}` : "Upload Resume (Optional)"}
              </p>
            </div>
            {/* Analyze Resume Button */}
            {file && !analysisDone && (
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={handleAnalyzeResume}
                disabled={analyzing}
                className={`w-full py-2.5 rounded-lg border-2 border-green-500 text-green-600 font-medium hover:bg-green-50 transition-all flex items-center justify-center gap-2 ${
                  analyzing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume with AI"
                )}
              </motion.button>
            )}
            {analysisDone && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm mt-4"
              >
                {/* Header with Icon */}
                <div className="flex items-center gap-2 mb-4 border-b border-green-100 pb-2">
                  <div className="bg-green-500 p-1 rounded-full">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider">
                    Resume Insights Found!
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Projects Section */}
                  {project.length > 0 && (
                    <div>
                      <p className="text-green-800 font-bold text-xs mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                        TOP PROJECTS
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.map((p, i) => (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            key={i}
                            className="bg-white px-3 py-1.5 rounded-lg border border-green-200 text-[11px] font-medium text-green-700 shadow-sm flex items-center"
                          >
                            {p}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                   

                  {/* Skills Section */}
                  {skills.length > 0 && (
                    <div>
                      <p className="text-green-800 font-bold text-xs mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                        RELEVANT SKILLS
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-green-100/50 px-2.5 py-1 rounded-full text-[10px] font-semibold text-green-700 border border-green-200/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtle Footer Info */}
                <p className="text-[10px] text-green-600/70 mt-4 italic text-center">
                  Fields have been auto-filled based on your resume.
                </p>
              </motion.div>
            )}
            {/* START BUTTON */}
            <motion.button
              type="button"
              disabled={isButtonDisabled}
              onClick={(e) => {
                e.stopPropagation();
                handleStartInterview();
              }}
              className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
                isButtonDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#4A5568] text-white hover:bg-slate-700"
              }`}
            >
              Start Interview
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Set1Setup;
