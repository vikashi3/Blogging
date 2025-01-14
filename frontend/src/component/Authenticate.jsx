import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function Authenticate(props) {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
    //   toast.error("Not Authoried, Please Login !");
        navigate("/Login");
    }
  }, [navigate]);

  return (
    <div>
      <Component />
    </div>
  );
}

export default Authenticate;
