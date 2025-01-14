import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Signup() {
  const [input, setInput] = useState({
    profilePic: null,
    name: "",
    email: "",
    password: "",
    contact: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", input.profilePic);
      formData.append("name", input.name);
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("contact", input.contact);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const token = response.data;
      localStorage.setItem("token", token);
      toast.success("Successfully Registered");
      navigate("/profile");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.warning("No file uploaded");
      } else if (error.response?.status === 409) {
        toast.warning("User already registered");
      } else {
        toast.error("Internal server error");
      }
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setInput({ ...input, profilePic: e.target.files[0] });
  };

  const handleInputChange = (e, key) => {
    setInput({ ...input, [key]: e.target.value });
  };

  const handleBlur = (e, key) => {
    setInput({ ...input, [key]: e.target.value.trim() });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="max-w-lg mx-4 px-2 bg-slate-100 shadow-lg rounded-lg overflow-hidden">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="block px-4 py-4 mb-2 text-sm text-gray-700"
        >
          <label
            htmlFor="profile"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Profile Picture
          </label>
          <input type="file" onChange={handleFileChange} name="file" />

          <label
            htmlFor="name"
            className="block mb-2 mt-3 text-sm font-bold text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            value={input.name}
            onChange={(e) => handleInputChange(e, "name")}
            onBlur={(e) => handleBlur(e, "name")}
            placeholder="Name"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500 capitalize"
          />

          <label
            htmlFor="email"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            value={input.email}
            onChange={(e) => handleInputChange(e, "email")}
            onBlur={(e) => handleBlur(e, "email")}
            placeholder="Email"
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
            onChange={(e) => handleInputChange(e, "password")}
            onBlur={(e) => handleBlur(e, "password")}
            placeholder="Password"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500"
          />

          <label
            htmlFor="contact"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Contact
          </label>
          <input
            type="tel"
            value={input.contact}
            onChange={(e) => handleInputChange(e, "contact")}
            onBlur={(e) => handleBlur(e, "contact")}
            placeholder="Contact"
            required
            className="w-full px-3 py-2 mb-6 border rounded-md focus:outline-none focus:border-blue-500"
          />

          <input
            type="submit"
            value="Signup"
            className="w-full px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer focus:bg-blue-700"
          />
        </form>
        <div className="flex flex-col items-center">
          <div className="flex gap-4 w-full justify-center pb-2">
            <span>Already have an Account?</span>
            <Link to="/login" className="hover:text-green-600 text-blue-500">
              Login
            </Link>
          </div>
          <Link to="/" className="text-blue-600 mb-5 hover:text-red-600">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
