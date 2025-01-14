import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./component/Login.jsx";
import Signup from "./component/Signup.jsx";
import CreateBlog from "./component/CreateBlog.jsx";
import Profile from "./component/Profile.jsx";
import ProfileEdit from "./component/ProfileEdit.jsx";
import Edit from "./component/Edit.jsx";
import AllBlogs from "./component/AllBlogs.jsx";
import Authentication from "./component/Authenticate.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AllBlogs />,
      },
      {
        path: "/profile",
        element: <Authentication Component={Profile} />,
      },
      {
        path: "/profileedit/:userId",
        element: <ProfileEdit />,
      },
      {
        path: "/edit/:blogId",
        element: <Edit />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/createBlog",
        element: <Authentication Component={CreateBlog} />,      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
