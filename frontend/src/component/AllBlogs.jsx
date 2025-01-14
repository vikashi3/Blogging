import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./index.css";
import PacmanLoader from "react-spinners/PacmanLoader";
// import { BsSearch } from "react-icons/bs";
import blog from "../assets/blog.png";

function AllBlogs() {
  const [userData, setUserData] = useState([]);
  const [selectedUserData, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_URL}/allblogs`);
        // const response = await axios.get(`http://localhost:3000/allblogs`);
        const data = response.data.reverse();
        setIsLoading(false);
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleClick = (user) => {
    setSelectedUser(user);
    document.body.style.overflow = "hidden";
  };

  const closeDetails = () => {
    setSelectedUser(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="flex flex-col flex-wrap justify-center w-full bg-slate-900 items-center py-5 min-h-screen bg-gray-100">
      <div className="w-11/12 flex gap-5 justify-between items-center pb-4 border-b border-slate-600">
        <img
          src={blog}
          alt="blog cards"
          className="h-10 w-10 md:h-16 md:w-16 cursor-not-allowed"
        />
        <div className="w-full flex gap-5 justify-end items-center">
          <Link to="/login">
            <input
              type="button"
              value="Login"
              className="md:w-24 px-3 py-1 md:px-4 md:py-2 text-md font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700 cursor-pointer focus:outline-none"
            />
          </Link>
          <Link to="/signup">
            <input
              type="button"
              value="Signup"
              className="md:w-24 px-3 py-1 md:px-4 md:py-2 text-md font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 cursor-pointer focus:outline-none"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-y-5 lg:gap-y-6 mt-10 w-11/12">
        <div class="flex gap-5 items-center w-11/12 md:w-1/2 lg:w-1/3 mx-auto">
          <input
            type="search"
            placeholder="search blog title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            class="w-full px-4 py-2 rounded-lg border border-gray-500 bg-slate-800 focus:outline-none hover:border-blue-500 placeholder-gray-200 text-gray-200 focus:ring-0.5 focus:ring-blue-500 cursor-pointer"
          />
          {/* <BsSearch className="w-12 h-12 text-blue-200 hover:text-cyan-400 transform hover:translate-x-1 transition duration-500 ease-in-out" /> */}
        </div>

        <h1 className="text-gray-200 md:text-6xl font-semibold text-4xl">
          Blog-cards
        </h1>
        <p className="text-slate-200 md:text-lg text-sm w-4/5 md:w-full text-center lg:text-left">
          Craft your unique digital cards and discover a world of creativity
          from others.
        </p>
      </div>
      <div className="flex flex-wrap justify-center w-full min-h-screen mt-8 md:mt-0">
        <div className="flex justify-center mt-36 md:mt-40">
          {isLoading && <PacmanLoader color="#36d7b7" size={30} />}
        </div>
        {Array.isArray(userData) &&
          userData
            .filter((data) =>
              search.toLowerCase() === ""
                ? data
                : data.title.toLowerCase().includes(search)
            )
            .map((user) => (
              <li
                className="list-none m-2"
                key={user._id}
                onClick={() => handleClick(user)}
              >
                <div className="w-80 sm:w-72 h-[350px] cursor-pointer overflow-hidden mx-0 sm:mx-4 bg-slate-200 hover:shadow-md hover:shadow-white rounded-lg mt-6 transition duration-700 transform hover:scale-105">
                  <img
                    className="w-full h-52 p-1 object-cover object-top-center rounded-t-lg"
                    src={`${import.meta.env.VITE_APP_URL}/images/${user.blogPic}`}
                    // src={`http://localhost:3000/images/${user.blogPic}`}
                    alt="User Profile"
                  />
                  <div className="px-4 py-1 h-36 overflow-hidden">
                    <p className="text-gray-800 font-semibold text-xl mb-2 normal-case truncate">
                      {user.title}
                    </p>
                    <p className="text-gray-700 mb-2 text-md overflow-hidden">
                      {user.content}
                    </p>
                  </div>
                </div>
              </li>
            ))}
      </div>
      {selectedUserData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 flex justify-center items-center">
          <div className="relative flex flex-col xl:flex-row xl:justify-around bg-slate-100 rounded-lg p-3 sm:p-3.5 w-11/12 xl:w-2/3 h-4/5 xl:h-3/4 text-lg sm:text-lg gap-y-1 sm:gap-y-2 font-sans overflow-auto">
            <div className="w-full xl:w-1/2 xl:pt-4 xl:pr-4 flex flex-col items-start">
              {" "}
              <img
                className="w-full h-60 md:h-80 xl:h-96 object-cover object-center rounded-lg"
                src={`${import.meta.env.VITE_APP_URL}/images/${selectedUserData.blogPic}`}
                // src={`http://localhost:3000/images/${selectedUserData.blogPic}`}
                alt="User Profile"
              />
              <p className="text-xs mt-2 text-gray-500">
                Created: {selectedUserData.updatedAt.split("T")[0]}{" "}
              </p>
              <p className="mt-2 text-sm md:text-lg lg:text-xl font-thin">
                <b className="font-semibold text-gray-800">Author: </b>
                {selectedUserData.author.name}{" "}
              </p>
              <p className="text-sm lg:text-lg">
                {selectedUserData.author.email}
              </p>
              <p className="text-sm lg:text-lg">{selectedUserData.city} </p>
            </div>
            <div
              id="main"
              className="flex flex-col xl:w-1/2 text-gray-700 font-thin mt-4 mb-2 text-xl tracking-wide pr-2 xl:overflow-auto"
            >
              <p className="text-sm sm:text-lg md:text-xl mb-2 font-medium sm:font-normal tracking-wider">
                <b className="font-bold sm:font-semibold text-gray-800">
                  Title:{" "}
                </b>{" "}
                {selectedUserData.title}
              </p>
              <p className="text-sm sm:text-lg md:text-xl mb-2 font-medium sm:font-normal tracking-wider">
                <b className="font-bold sm:font-semibold text-gray-800">
                  Blog:{" "}
                </b>{" "}
                {selectedUserData.content}
              </p>
            </div>
          </div>
          <button
            className="absolute xl:bottom-10 bottom-6 sm:mt-4 w-40 mx-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={closeDetails}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default AllBlogs;
