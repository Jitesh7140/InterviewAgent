import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// ArrowLeft icon add kiya hai
import { Calendar, Award, Briefcase, ChevronRight, Clock, ArrowLeft } from "lucide-react"; 

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/interview/getInterviews`,
          { withCredentials: true },
        );
        if (response.data.success) {
          setInterviews(response.data.interviews);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} // Aap yahan dashboard ka path bhi daal sakte hain
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Interview History
          </h1>
          <p className="text-slate-500 mt-2">
            Track your past performance and interview details.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
          </div>
        ) : interviews.length > 0 ? (
          <div className="grid gap-4">
            {interviews.map((item) => (
              <div
                key={item._id}
                className="group bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between"
              >
                {/* Left Side: Info */}
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-slate-200 transition-colors">
                    <Briefcase className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg capitalize text-slate-900">
                      {item.role}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {item.experience} Years Exp.
                      </span>
                      <span className="flex items-center gap-1 text-indigo-600 font-medium">
                        {item.mode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Score & Action */}
                <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Final Score
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-xl font-bold text-slate-800">
                        {item.finalScore}/10
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/report/${item._id}`)}
                    className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
            <p className="text-slate-500">
              No interviews found. Start your first session!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;