import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Required to style toast notifications
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { app } from "../Firebase/Firebase"; // Adjust the import path as necessary
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../Store/Signin.Slice.js";

const auth = getAuth(app);

const Signin = () => {
  const [activeRole, setActiveRole] = useState("doctor");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      signInWithEmailAndPassword(
        auth,
        formData.username,
        formData.password
      ).then((result) => {
        const user = result.user;
        toast.success(
          `Welcome ${user.email}! You are signed in as ${activeRole}.`,
          {
            position: "top-right",
            autoClose: 2000,
            onClose: () => {
              navigate("/Clinic-Management/dashboard");
            },
          }
        );
      });

      dispatch(
        setCredentials({
          username: formData.username,
          password: formData.password,
          activeRole: activeRole,
          isAuthenticated: true,
        })
      );
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
      setFormData({
        username: "",
        password: ""
      })
    }
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-sm shadow-lg w-96 xl:w-150 flex flex-col">
        <div className="flex flex-col items-center mb-10 leading-0">
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-800">
            Clinic Management System
          </h2>
          <p>Sign in to access the clinic management system</p>
        </div>

        <div className="flex p-1 gap-1 bg-zinc-300 rounded-sm mb-6">
          <button
            type="button"
            className={`flex-1 rounded-2xl text-gray-500 py-2 transition ${
              activeRole === "doctor"
                ? "bg-gray-100 text-gray-900 font-bold"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleRoleChange("doctor")}
          >
            <i className="ri-user-line mr-2"></i>
            Doctor
          </button>
          <button
            type="button"
            className={`flex-1 rounded-2xl text-gray-500 py-2 transition ${
              activeRole === "receptionist"
                ? "bg-gray-100 text-gray-900 font-bold"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleRoleChange("receptionist")}
          >
            <i className="ri-shield-line mr-2"></i>
            Receptionist
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            {loading
              ? "Sign In..."
              : `Sign In As ${
                  activeRole.charAt(0).toUpperCase() + activeRole.slice(1)
                }`}
          </button>
        </form>
        <ToastContainer />
        <p className="text-center mt-4 font-semibold">
          If you have not registered yet, please
          <Link
            to={"/"}
            className="text-blue-400 font-semibold hover:text-shadow-blue-800 transition duration-300"
          >
            Sign Up
          </Link>
          .
        </p>
        <div className="flex justify-center mt-5">
          <button>
            <img
              src="https://cdn3.iconfinder.com/data/icons/logos-brands-3/24/logo_brand_brands_logos_google-1024.png"
              alt="Google"
              // onClick={handleGoogleSignUp}
              className="w-10 h-10 ml-2 border-2 rounded-full p-2 hover:scale-110 hover:shadow-2xl hover:p-1 transition duration-300"
            />
          </button>
          <button>
            <img
              src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-social-github-1024.png"
              alt="GitHub"
              className="w-10 h-10 ml-2 border-2 rounded-full p-2 hover:scale-110 hover:shadow-2xl hover:p-1 transition duration-300"
              // onClick={handleGithubSignUp}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
