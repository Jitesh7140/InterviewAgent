import { motion } from "framer-motion";
import { Auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage({ isModel = false }) {

  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(Auth, provider);

      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/googleAuth`, {
        name: response.user.displayName,
        email: response.user.email,
      }, {
        withCredentials: true,
      });
      console.log(result.data);
      navigate("/");
       
        
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`w-full transition-all ${isModel ? "p-0" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4 md:px-6 py-10"}`}>
      
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-[440px] flex flex-col items-center text-center transition-all
          ${isModel 
            ? "bg-transparent p-2" 
            : "bg-white p-8 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-50"
          }`}
      >
        
        {/* Logo Section */}
        <div className="flex items-center gap-2.5 mb-8 md:mb-10">
          <div className="bg-[#111827] p-2 rounded-xl shrink-0">
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
             </svg>
          </div>
          <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
            InterviewIQ.AI
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-[30px] font-bold text-[#111827] mb-2 leading-tight">
          Continue with
        </h1>
        
        {/* Animated Badge */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`inline-flex items-center gap-2 mb-6 md:mb-8 transition-all
            ${isModel ? "px-4 py-2" : "px-5 md:px-6 py-2 md:py-2.5 bg-[#eaffee] rounded-full"} `}
        >
          <span className="text-[#10b981] text-lg md:text-xl">✦</span>
          <span className="text-[#065f46] font-extrabold text-xl md:text-2xl tracking-tight">
            AI Smart Interview
          </span>
        </motion.div>

        {/* Description */}
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 md:mb-10 px-2 max-w-[340px]">
          Sign in to start AI-powered mock interviews, track your progress, and unlock detailed performance insights.
        </p>

        {/* Google Button */}
        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full cursor-pointer bg-[#111827] text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:bg-black"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="shrink-0">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.196,35.21,44,30.342,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          <span className="font-semibold text-base md:text-lg">Continue with Google</span>
        </motion.button>

        {/* Legal Text (Optional but adds trust) */}
        {!isModel && (
          <p className="mt-8 text-[11px] text-gray-400 uppercase tracking-widest font-medium">
            Secure Authentication via Google
          </p>
        )}

      </motion.div>
    </div>
  );
}

export default AuthPage;