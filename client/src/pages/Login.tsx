import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Login = () => {
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn(formData.email, formData.password);
        }}
      >
        {error && <p>{error}</p>}
        <label>Emaill</label>
        <input
          type="text"
          value={formData.email}
          name="email"
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="text"
          value={formData.password}
          name="password"
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Login...." : "Login"}
        </button>
        <p>
          {" "}
          Create Account<Link to={"/register"}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
