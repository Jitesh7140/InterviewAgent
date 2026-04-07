import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Step3Report from "../../components/Set3Report";

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
        if (response.data) {
          console.log(response.data);
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
    <Step3Report report={report} />
  );
}

// Helper Component for Stats
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className={`${color} border border-slate-200 p-5 rounded-2xl shadow-sm`}>
//       <div className="flex justify-between items-start mb-2">
//         <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
//       </div>
//       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
//       <p className="text-2xl font-bold text-slate-900 mt-1">{value}<span className="text-sm text-slate-300 font-normal">/10</span></p>
//     </div>
//   );
// }

export default InterviewReport;