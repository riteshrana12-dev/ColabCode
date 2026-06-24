import { useState } from "react";
import api from "../services/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function useAuth() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const logOut = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [error, setError] = useState("");

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await api.post("/auth/signup", { name, email, password });
      setStep("verify");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/verifyEmail", { email, otp });
      setAuth(res.data.user, res.data.accessToken);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/signin", { email, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      logOut();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    verifyEmail,
    signIn,
    signOut,
    step,
    loading,
    error,
  };
}
