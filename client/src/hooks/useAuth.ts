import { useState } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

export default function useAuth() {
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

  return {
    signUp,
    step,
    loading,
    error,
  };
}
