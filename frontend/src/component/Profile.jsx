import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { IoMdAdd } from "react-icons/io";
import "./index.css";
import FadeLoader from "react-spinners/FadeLoader";

function Profile() {
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `${token}`,
        };
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/profile/${userId}`,
          { headers }
        );
        const userData = response.data;
        setIsLoading(false);
        setUserData(userData);
      } catch (error) {
        console.log("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized access. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Error fetching user data.");
        }
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Successfully Logout");
    navigate("/");
  };

  const handleDelete = async (blogId) => {
    try {
      console.log(blogId);
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this blog?"
      );
      if (confirmDelete) {
        const response = await axios.delete(`${import.meta.env.VITE_APP_URL}/delete/${blogId}`);
        setUserData((prevUserData) => ({
          ...prevUserData,
          blogs: prevUserData.blogs.filter((blog) => blog._id !== blogId),
        }));

        toast.success("Your blog has been deleted");
      }
    } catch (error) {
      console.log("Error deleting blog:", error);
      toast.error("Error deleting blog.");
    }
  };

  const profileClick = (userId) => {
    navigate(`/profileEdit/${userId}`);
  };

  return (
    <div className="flex flex-wrap justify-center w-full gap-y-10 gap-x-20 py-10 min-h-screen bg-gray-900">
      <div className="w-11/12 h-20 -mt-10 flex justify-between items-center pb-2 border-b border-slate-600">
        <div
          onClick={() => {
            profileClick(userData._id);
          }}
          className="light flex items-end gap-4 w-auto py-1 mt-2 px-4 rounded-2xl bg-slate-700 cursor-pointer"
        >
          <img
            src={`${import.meta.env.VITE_APP_URL}/images/${userData.profilePic}`}
            className="xl:h-12 xl:w-12 w-10 h-10 rounded-full object-cover"
            alt="profilePic"
          />
          <span className="hidden sm:block text-gray-300 font-normal tracking-wider text-2xl">
            {userData.name}'s Blogs
          </span>
        </div>
        <div className="flex gap-6">
          <Link to="/createBlog">
            <input
              type="button"
              value="Create"
              className="w-24 px-4 py-2 cursor-pointer text-md font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none"
            />
          </Link>
          <Link>
            <input
              onClick={handleLogout}
              type="button"
              value="Logout"
              className="w-24 px-4 py-2 cursor-pointer text-md font-bold text-white bg-rose-500 rounded-md hover:bg-rose-700 focus:outline-none"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 justify-center w-full h-auto">
        {isLoading ? (
          <FadeLoader color="#36d7b7" size={40} />
        ) : (
          <>
            {userData && userData.blogs && userData.blogs.length > 0 ? (
              userData.blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="relative w-96 sm:w-1/2 xl:w-1/2 h-auto mx-4 my-auto bg-slate-100 shadow-lg rounded-lg hover:shadow-xl"
                >
                  <img
                    className="w-full h-80 p-1 object-cover object-center rounded-lg"
                    src={`${import.meta.env.VITE_APP_URL}/images/${blog.blogPic}`}
                    alt="Blog"
                  />
                  <div className="px-6 py-4">
                    <div className="xl:flex xl:flex-row flex-col justify-between">
                      <div className="font-bold text-lg xl:text-2xl">
                        {blog.title}
                      </div>
                      <Link
                        to={`/edit/${blog._id}`}
                        className="text-md text-gray-400 hover:text-orange-600 mt-2"
                      >
                        Edit
                      </Link>
                    </div>
                    <p className="text-gray-900 mb-2 text-sm text-cyan-800 mt-2 font-medium">
                      {blog.city}
                    </p>
                    <p className="text-gray-700 mb-2 text-md overflow-auto">
                      {blog.content}
                    </p>
                  </div>
                  <div className="w-full flex justify-center pb-4">
                    <input
                      onClick={() => {
                        handleDelete(blog._id);
                      }}
                      type="button"
                      value="Delete"
                      className="w-20 px-4 py-1 cursor-pointer text-md font-bold text-white bg-rose-500 rounded-md hover:bg-rose-700 focus:outline-none"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-80 w-80 rounded-lg shadow-md bg-slate-300">
                <Link to="/createBlog">
                  <IoMdAdd className="text-gray-400 h-52 w-52" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
