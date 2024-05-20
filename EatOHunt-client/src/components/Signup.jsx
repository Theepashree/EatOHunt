import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Contexts/AuthProvider";


const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, login, signUpWithGmail} = useContext(AuthContext);
  //redirecting to home page or specific page

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    
    createUser(email, password)
      .then((result) => {
        //Signed up
        const user = result.user;
        alert("Account creation successfully done!");
        document.getElementById("my_modal_5").close();
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleLogin = () => {
    signUpWithGmail().then((result)=>{
      const user = result.user;
      alert("Login succesfull!")
      navigate(from,{replace:true})

    }).catch((error)=> console.log(error))
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center" >
    <div className=" flex flex-col justify-center bg-white shadow rounded-xl items-center mt-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body"
        method="dialog"
      >
        <h3 className="font-bold text-lg">Create a Account!</h3>

        {/* email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered border-gray-100 bg-white"
            required
            {...register("email")}
          />
        </div>

        {/* passwords */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered border-gray-100 bg-white"
            {...register("password")}
          />
          <label className="label mt-1">
            <a href="#" className="label-text-alt link link-hover">
              Forgot password?
            </a>
          </label>
        </div>

        {/* error text */}

        {/* login button */}
        <div className="form-control mt-6">
          <input
            type="submit"
            value="Signup"
            className="btn bg-green text-white border-none"
          />
        </div>

        <p className="text-center my-2">
          Have an account?{" "}
          <button
            className="underline text-red ml-1"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            Login
          </button>{" "}
        </p>
        <Link
          to="/"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </Link>
      </form>
      {/* Social sign in */}

      <div className="text-center space-x-3 mb-5">
        <button className="btn btn-circle hover:bg-green hover:text-white" onClick={handleLogin}>
          <FaGoogle />
        </button>
        <button className="btn btn-circle hover:bg-green hover:text-white">
          <FaFacebookF />
        </button>
        <button className="btn btn-circle hover:bg-green hover:text-white">
          <FaGithub />
        </button>
      </div>
    </div>
    </div>
   
  );
};

export default Signup;