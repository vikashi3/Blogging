import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/login`,
        input
      );
      const token = response.data;
      console.log(token);
      toast.success("Successfully Login");
      localStorage.setItem("token", token);
      navigate("/profile");
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("User not registered");
      } else if (error.response.status === 401) {
        toast.warning("Incorrect password");
      } else {
        toast.error("Internal server error");
      }
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="max-w-md mx-4 px-2 bg-slate-100 shadow-lg rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            onBlur={(e)=> setInput({ ...input, email: e.target.value.trim()})}
            placeholder="Email"
            autoComplete="true"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500"
          />

          <label
            htmlFor="password"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            onBlur={(e)=> setInput({ ...input, password: e.target.value.trim()})}
            placeholder="Password"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500"
          />

          <input
            type="submit"
            value="Login"
            className="w-full px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer focus:bg-blue-700"
          />
        </form>
        <div className="flex flex-col items-center">
          <div className="flex gap-4 w-full justify-center pb-2">
            <span className="text-slate-500">Don't have an Account?</span>
            <Link to="/signup" className="hover:text-green-600 text-blue-500"> SignUp</Link>
          </div>
          <Link to="/" className="text-blue-600 mb-5 hover:text-red-600">
            {" "}
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
