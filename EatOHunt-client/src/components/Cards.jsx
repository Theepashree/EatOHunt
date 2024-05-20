/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../Contexts/AuthProvider";
import Swal from 'sweetalert2'

const Cards = ({ item }) => {
  const {name,price,image,recipe, _id} = item;
  const [isHeartFillted, setIsHeartFillted] = useState(false);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();
  const location = useLocation();

  //add to cart
  const handleAddtoCart = (item) =>{
    // console.log("btn is clicked",item)
    if(user && user?.email){
      const cartItem = {menuItemId: _id,name, quantity:1, image, price, email:user.email};
      console.log(cartItem);
      fetch("https://eatohunt.onrender.com/carts",{
        method : "POST",
        headers: {
          'content-type' : "application/json"
        },
        body:JSON.stringify(cartItem)
      }).then((res) => res.json()).then((data) =>{
        // console.log(data)
        if(data.insertedId){
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });

        }
      });
    }else{
      Swal.fire({
        title: "Please Login?",
        text: "Without an account can't able to add products",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Signup Now!"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signup',{state:{from:location}})
        }
      });
    }

  };

  const handleHeartClick = () => {
    setIsHeartFillted(!isHeartFillted);
  };
  return (
    <div className="card w-96 shadow-xl relative bg-white">
      <div
        className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green ${
          isHeartFillted ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="h-5 w-5 cursor-pointer" />
      </div>
      <Link to={`/menu/Rs{item._id}`}>
        <figure>
          <img
            src={item.image}
            alt=""
            className="hover:scale-105 transition-all duration-200 md:h-72"
          />
        </figure>
      </Link>
      <div className="card-body">
        <Link to={`/menu/Rs{item._id}`}>
          {" "}
          <h2 className="card-title text-[#4A4A4A]">{item.name}</h2>
        </Link>
        <p className="text-[#4A4A4A]">Description of the item</p>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold text-[#4A4A4A]">
            <span className="text-sm text-red">&#8377;</span>
            {item.price}
          </h5>
          <button className="btn bg-green text-white border-none" onClick={() => handleAddtoCart(item)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
