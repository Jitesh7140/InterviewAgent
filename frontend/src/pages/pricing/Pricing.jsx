import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    credits: "100 Credits",
    description: "Perfect for beginners starting interview preparation.",
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
  },
  {
    id: "starter",
    name: "Starter Pack",
    price: "100",
    credits: "150 Credits",
    description: "Great for focused practice and skill improvement.",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
  },
  {
    id: "pro",
    name: "Pro Pack",
    price: "500",
    credits: "650 Credits",
    description: "Best value for serious job preparation.",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
    ],
    tag: "Best Value",
  },
];

const Pricing = () => {
  // State to track which plan is clicked
  const [selectedPlan, setSelectedPlan] = useState("starter"); // Default highlighted
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = plan.id === "starter" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/create-order`,
        { amount, planId: plan.id, credits: plan.credits },
        { withCredentials: true },
      );

      console.log(result.data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewAgent",
        description: "Payment for interview credits",
        image: "https://example.com/logo.png",
        order_id: result.data.id,
        handler: async function (response) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true },
            );

            if (res.data.success) {
              dispatch(setUser(res.data.user)); // Now 'dispatch' is the actual function
              navigate("/");
            } else {
              // Show alert only if success is false
              alert("Payment verification failed: " + res.data.message);
            }
          } catch (err) {
            console.error(err);
            alert("Error on payment verification try again");
          }
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-16 px-4 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 p-2 bg-white rounded-full border border-gray-200 hover:shadow-md transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 max-w-md mx-auto font-medium">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`relative cursor-pointer bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 flex flex-col h-full ${
                  isSelected
                    ? "border-emerald-500 shadow-2xl shadow-emerald-100 scale-105 z-10"
                    : "border-transparent hover:border-gray-200 shadow-sm"
                }`}
              >
                {plan.tag && (
                  <span className="absolute top-6 right-8 bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                    {plan.tag}
                  </span>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex flex-col mb-4">
                    <span className="text-4xl font-black text-emerald-600">
                      ₹{plan.price}
                    </span>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {plan.credits}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-10  grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="bg-emerald-500 rounded-full p-0.5 shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                      <span className="text-sm font-semibold text-slate-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dynamic Button Text Logic */}
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id);
                    } else {
                      handlePayment(plan);
                    }
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 active:scale-95 shadow-sm ${
                    isSelected
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                      : "bg-slate-50 text-slate-400 border border-slate-100"
                  }`}
                >
                  {loadingPlan === plan.id
                    ? "processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
