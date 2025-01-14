import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

function CreateBlog() {
  const [input, setInput] = useState({
    blogPic: null,
    title: "",
    city: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const formData = new FormData();
      formData.append("blogFile", input.blogPic);
      formData.append("title", input.title);
      formData.append("city", input.city);
      formData.append("content", input.content);
      formData.append("userId", userId);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/createBlog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const blogData = response.data;
      console.log(blogData);
      toast.success("Blog successfully created");
      navigate("/profile");
    } catch (error) {
      if (error.response.status === 400) {
        toast.warning("No file uploaded");
      } else {
        toast.error("Internal server error");
      }
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setInput({ ...input, blogPic: e.target.files[0] });
  };

  return (
    <div className="flex justify-center w-full items-center min-h-screen bg-gray-900">
      <div className="max-w-xl w-11/12 md:w-full mx-4 px-2 bg-slate-100 shadow-lg rounded-lg overflow-hidden">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="block px-4 py-4 mb-2 text-sm text-gray-700"
          >
          <label
            htmlFor="blog"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Blog Picture
          </label>
          <input type="file" onChange={handleFileChange} name="blogFile" />

          <label
            htmlFor="title"
            className="block mb-2 mt-3 text-sm font-bold text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            value={input.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
            onBlur={(e)=> setInput({ ...input, title: e.target.value.trim() })}
            placeholder="Blog title"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500 whitespaces-pre"
          />

          <label
            htmlFor="city"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            value={input.city}
            onChange={(e) => setInput({ ...input, city: e.target.value })}
            onBlur={(e)=> setInput({ ...input, city: e.target.value.trim() })}
            placeholder="Enter your city"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500 capitalize"
          />

          <label htmlFor="content" className="block mb-2 text-sm font-bold text-gray-700">Blog</label>
          <textarea
            id="main"
            value={input.content}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            onBlur={(e)=> setInput({ ...input, content: e.target.value.trim() })}
            rows="6"
            placeholder="Write your content"
            required
            className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-500"
          />

          <input
            type="submit"
            value="Create"
            className="w-full px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none"
          />
        </form>
        <div className="flex flex-col items-center">
          <Link to="/profile" className="text-blue-600 mb-5">
            {" "}
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
