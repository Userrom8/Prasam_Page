import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiKey, FiArrowRight, FiLoader } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send OTP.");
      }

      toast.success("OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed.");
      }

      saveToken(data.token);
      toast.success("Login Successful! Redirecting...");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <>
      <Toaster position="top-center" richColors theme="dark" />
      <div className="relative min-h-screen w-full bg-stone-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-50px] right-[-50px] h-96 w-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-50px] left-[-50px] h-96 w-96 bg-green-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 space-y-6 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-2xl shadow-2xl"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-green-400">
                Admin Access
              </h1>
              <p className="mt-2 text-neutral-400">Secure. Sleek. Superior.</p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleRequestOtp}
                  className="space-y-6"
                >
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your admin email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-sky-600/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiArrowRight />
                    )}
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP from your email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 tracking-widest text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiArrowRight />
                    )}
                    {isLoading ? "Verifying..." : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep(1);
                    }}
                    className="w-full text-sm text-center text-neutral-400 hover:text-white transition-colors duration-300"
                  >
                    Use a different email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 text-center pt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
