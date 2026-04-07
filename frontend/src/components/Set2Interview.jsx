import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Bot } from "lucide-react";
import { motion } from "framer-motion";
import malevideo from "../assets/Videos/male-ai.mp4";
import femalevideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import axios from "axios";
import {FaMicrophoneAltSlash  } from "react-icons/fa"
import { current } from "@reduxjs/toolkit";

function Set2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex] || {
    question: "Loading question...",
  };

  useEffect(() => {
    const loadVoice = async () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      //try known female voice
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("zira"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }
      //try known male voice
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }
      // fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoice();
    window.speechSynthesis.onvoiceschanged = loadVoice;
  }, []);

  const videoSource = voiceGender === "female" ? femalevideo : malevideo;

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        if (error?.name !== "InvalidStateError") {
          console.error("Error starting mic:", error);
        }
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        if (error?.name !== "InvalidStateError") {
          console.error("Error stopping mic:", error);
        }
      }
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  // ---------------------------speak function------------------

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pause after commas and periods
      const humanText = text.replace(/,/g / ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      // Handle subtitle display
      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };
      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hello ${userName},  it's great to have you here. I hope you're feeling confident and ready to begin your interview.`,
        );

        await speakText(
          `I'll ask you ${questions.length} questions. Take your time to answer each one, and I'll provide feedback after you submit your Answer.`,
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (currentIndex === questions.length - 1) {
          await speakText(`Alright, this one might be a bit more challenging.`);
        }
        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    };
    runIntro();
  }, [currentIndex, selectedVoice, isIntroPhase]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex ]);

  useEffect(()=>{
    if(!isIntroPhase && currentQuestion){
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  } , [currentIndex])

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const submitAnswer = async () => {
    if (isSubmitting) return;
    
    if (!answer.trim()) {
      await speakText("You did not submit any answer. Please provide your response.");
      return;
    }
    
    stopMic();
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        ` ${import.meta.env.VITE_SERVER_URL}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      const data = res.data;

      if (data.success) {
        setFeedback(data.feedback);
      }
      speakText(data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
    }
  };

  const finishInterview = async(interviewData)=>{
    stopMic();
    setIsMicOn(false);
    try {
      const res = await axios.post(` ${import.meta.env.VITE_SERVER_URL}/api/interview/finish`, {interviewId} , {withCredentials:true})

      const data = await res.data;

      if(data.success){
        console.log("data in 2 step:" , data)
        onFinish(data);
      }

    } catch (error) {
      console.error("Error finishing interview:", error);
    }
  }

  const handleNext = async()=>{
    setAnswer("");
    setFeedback("");

    
    if(currentIndex + 1 >= questions.length){
      finishInterview(interviewData);
      return;
    }
    
    await speakText("alright, let's move to the next question.")

    setCurrentIndex(currentIndex + 1);
    setTimeout(()=>{
      if(isMicOn) startMic();
    } , 500)
  }

  useEffect(()=>{
    if(isIntroPhase)return;
    if(!currentQuestion) return;

    if(timeLeft === 0 && !isSubmitting && !feedback){
      submitAnswer();
    }
  },[timeLeft])

  useEffect(()=>{
    return ()=>{
      if(recognitionRef.current){
        recognitionRef.current.stop();
        recognitionRef.current.abort();

      }
      window.speechSynthesis.cancel(); 
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-start lg:items-center justify-center p-3 lg:p-6 font-sans antialiased text-slate-800 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row min-h-screen lg:min-h-0 lg:h-[90vh]"
      >
        {/* LEFT SIDEBAR: Avatar & Stats */}
        <div className="w-full lg:w-80 bg-slate-50/50 p-3 lg:p-4 flex flex-col gap-3 border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0 lg:h-full lg:overflow-hidden">
          {/* AI Avatar Video */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 mx-auto aspect-video h-28 sm:h-32 lg:h-44 lg:w-full shadow-sm border border-slate-200 shrink-0">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-white font-bold uppercase tracking-tight">
                Live
              </span>
            </div>
          </div>

          {/* Subtitle Area - Flex to prevent layout shifting */}
          <div className="bg-slate-800/5 border border-slate-200 min-h-20 flex-1 lg:flex-none lg:min-h-28 text-slate-700 p-3 rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 shrink-0 shadow-inner">
            <span className="text-[8px] font-black uppercase text-slate-400 block mb-1 tracking-widest">
              Live Captions
            </span>
            {subtitle ? (
              <p className="text-xs md:text-[13px] leading-relaxed italic font-medium">
                "{subtitle}"
              </p>
            ) : (
              <p className="text-[11px] text-slate-300 italic">
                Listening for AI audio...
              </p>
            )}
          </div>

          {/* Status Card - Flexible but stays within bounds */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm min-h-0 lg:min-h-[200px]">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Interview Status
              </span>
              <div className="flex items-center gap-1.5">
                {!isAIPlaying ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                    AI Speaking
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    Waiting...
                  </span>
                )}
              </div>
            </div>

            {/* Set2Interview.jsx ke andar */}
            <div className="flex-1 flex items-center justify-center py-2 min-h-0">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion.timeLimit}
              />
            </div>

            {/* Progress Counters - Fixed at bottom */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 shrink-0">
              <div className="text-center group">
                <p className="text-xl font-black text-slate-700 leading-none group-hover:text-emerald-600 transition-colors">
                  {currentIndex + 1}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                  Current Question
                </p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-xl font-black text-slate-300 leading-none">
                  {questions.length}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                  Total Questions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT: Interview Feed */}
        <div className="flex-1 flex flex-col bg-white p-5 lg:p-8 overflow-y-auto lg:overflow-hidden">
          <header className="flex items-center gap-2 mb-5 border-b border-slate-50 pb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Bot size={18} />
            </div>
            <h2 className="text-slate-800 font-bold text-sm md:text-base tracking-tight uppercase">
              AI Smart Interview
            </h2>
          </header>

          {/* Question Box */}
          <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100 mb-5 shadow-sm">
            <span className="text-[10px] text-emerald-600 font-black uppercase mb-2 block tracking-widest">
              Question
            </span>
            <p className="text-slate-700 text-[15px] md:text-base lg:text-lg font-semibold leading-relaxed">
              {currentQuestion?.question}
            </p>
          </div>

          {/* Answer Area */}
          <div className="flex-none lg:flex-1 mb-5 min-h-[100px] lg:min-h-[150px]">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer goes here..."
              className="w-full h-full min-h-[100px] lg:min-h-[150px] p-4 lg:p-5 bg-white border border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all outline-none text-slate-600 text-sm md:text-base leading-relaxed placeholder:text-slate-300 shadow-inner resize-y lg:resize-none"
            />
          </div>

          {/* Bottom Actions / Feedback */}
          {feedback ? (
            <div className="mt-auto bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] text-emerald-600 font-black uppercase mb-2 block tracking-widest">
                Feedback
              </span>
              <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed mb-4">
                {feedback}
              </p>
              <button
                onClick={handleNext}
                className="w-full h-12 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-wide shadow-md shadow-emerald-200"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-auto">
              <button
                onClick={toggleMic}
                className="h-12 w-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-black transition-all shadow-lg active:scale-95 shrink-0"
              >
                {isMicOn ? <Mic size={22}/> : <FaMicrophoneAltSlash /> }
              </button>
              <button
                onClick={submitAnswer}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-[0.99] uppercase tracking-wide"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Set2Interview;
