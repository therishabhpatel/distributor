import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import wetaranLogo from "../assets/wetaran-logo.svg";
import opacityLogo from "../assets/opacityLogo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const { user } = data;
    const { data: profile } = await supabase
      .from("wetaran_web")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      setError("No role assigned in wetaran_web");
      return;
    }

    if (profile.role.toLowerCase() !== role.toLowerCase()) {
      setError("Role mismatch. Please select the correct role.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", profile.role);

    // Redirect
    navigate("/home/dashboard");
  };

  return (
    <main className="lg:h-screen lg:flex">
      {/* left side of the screen */}
      <div className="flex justify-center items-center lg:h-screen lg:w-1/3 my-12 lg:my-0">
        <img src={wetaranLogo} alt="Wetran Logo" className="max-w-60" />
        <img
          src={opacityLogo}
          alt="opaque logo"
          className="absolute bottom-0 left-0 max-w-80"
        />
      </div>

      {/* right side of the screen */}
      <div className="lg:bg-[var(--main-bg)] lg:w-2/3 flex justify-center items-center flex-col">
        <div className="max-w-[600px] lg:w-[55%] w-full px-4">
          <div className="flex flex-col">
            <h1 className="text-[var(--primary-text)] font-bold text-2xl lg:text-4xl text-center">
              Welcome to Wetaran
            </h1>

            <p className="text-center font-semibold text-[var(--secondary-text)] text-base">
              Use your email account
            </p>
          </div>

          <div className="flex flex-col mt-10">
            <label htmlFor="role" className="text-[var(--primary-text)]">
              Role
              <span className="text-[var(--asterisk)]">*</span>
            </label>
            <select
              name="role"
              id="role"
              className="bg-white p-2 rounded-md shadow-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select your role</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="CNF/SS">Super Stockist</option>
              <option value="Distributor">Distributors</option>
            </select>
          </div>

          <div className="flex flex-col mt-6">
            <label htmlFor="email" className="text-[var(--primary-text)]">
              Email <span className="text-[var(--asterisk)]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white p-2 rounded-md shadow-md"
            />
          </div>

          <div className="flex flex-col mt-6">
            <label htmlFor="password" className="text-[var(--primary-text)]">
              Password <span className="text-[var(--asterisk)]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-white p-2 rounded-md shadow-md"
            />
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex gap-1">
              <input type="checkbox" />
              <label htmlFor="remember" className="text-[var(--primary-text)]">
                Remember Me
              </label>
            </div>
            <p className="text-[var(--primary-text)]">Forgot Password?</p>
          </div>

          <div className="flex flex-col items-center gap-2 mt-6">
            <button
              className="bg-[#003cbe] text-white px-16 lg:px-8 py-2 rounded-sm"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="text-[var(--secondary-text)]">or Create an Account</p>
            <p className="text-[var(--secondary-text)]">
              Forgot password? Click Here
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
