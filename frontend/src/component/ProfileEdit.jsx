import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function ProfileEdit() {
  const { userId } = useParams();
  console.log("profileEdit component Edit ID: ", userId);
  const [userData, setUserData] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        if (userId) {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_URL}/profileEdit/${userId}`
          );
          const data = response.data;
          setUserData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const handleupdate = async () => {
    try {
      const formData = new FormData();
      formData.append("profileFile", profilePic);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contact", contact);

      if(profilePic === ""){
        toast.info("Upload Profile pic first")
      }
      if (profilePic === "" && name === "" && email === "" && contact === "") {
        toast.info("No changes made");
        return;
      }
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL}/profile/update/${userId}`,
        formData
      );
      const data = response.data;
      // console.log(data);
      toast.success("Profile Successfully Updated");
      // console.log(data);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center w-full items-center gap-10 py-10 min-h-screen bg-gray-900">
      {userData && (
        <div className="w-80 h-1/2 mx-4 bg-slate-100 shadow-lg rounded-lg hover:shadow-xl transition duration-500">

          <div className="flex flex-col gap-2 px-4 justify-center">
          <img
            className="w-full h-60 p-1 object-cover object-center rounded-t-lg"
            src={`${import.meta.env.VITE_APP_URL}/images/${userData.profilePic}`}
            alt="User Profile"
          />
          <span className="text-sm font-semibold">Profile pic</span>
          <input
          type="file"
          name="profileFile"
          onChange={(e)=> {
          setProfilePic(e.target.files[0])
          }}/>
          </div>
          <div className="flex flex-col gap-1 px-4 justify-center">
            <div className="font-medium text-xl mt-2">{userData.name}</div>
            <input
              type="text"
              className="w-full px-3 py-1 mb-1 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="New name"
              name="newName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <p className="text-gray-700 text-md">{userData.email}</p>
            <input
              type="text"
              className="w-full px-3 py-1 mb-1 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="New email"
              name="newEmail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <p className="text-gray-700 text-md">{userData.contact}</p>
            <input
              type="text"
              className="w-full px-3 py-1 mb-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="New contact"
              name="newContact"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
              }}
            />
            <div className="flex justify-between">
              <Link
                to="/profile"
                type="button"
                className="text-center mb-2 w-24 px-2 py-1 text-md font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
              >
                Back
              </Link>

              <input
                onClick={handleupdate}
                type="button"
                value="Update"
                className="mb-2 w-24 px-2 py-1 text-md font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileEdit;
