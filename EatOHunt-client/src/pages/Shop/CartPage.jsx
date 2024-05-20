import React, { useContext, useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import { FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import { AuthContext } from "../../Contexts/AuthProvider";

const CartPage = () => {
  const [cart, refetch] = useCart();
  const { user, loading } = useContext(AuthContext);
  const [cartItems, setcartItems] = useState([]);

  //calculate price
  const calculatePrice = (item) => {
    return item.price * item.quantity
  }

  //handledIncrease function
  const handleIncrease = (item) => {
    // console.log(item._id);
    fetch(`http://localhost:5000/carts/${item._id}`,{
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({quantity: item.quantity + 1})

    })
      .then((res) => res.json())
      .then((data) => {
        const updatedCart = cartItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }
          return cartItem;
        });
        refetch();
        setcartItems(updatedCart);
      });

      refetch();
  };

  //handledecrease function
  const handleDecrease = (item) => {
    // console.log(item._id);
    if(item.quantity > 1){
      fetch(`http://localhost:5000/carts/${item._id}`,{
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({quantity: item.quantity - 1})

    })
      .then((res) => res.json())
      .then((data) => {
        const updatedCart = cartItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            };
          }
          return cartItem;
        });
        refetch();
        setcartItems(updatedCart);
      });

      refetch();
    }
    else{
      alert("Item can't be zero")
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your cart.</div>;
  }

  //calculate total price
  const cartSubTotal = cart.reduce((total, item) => {
    return total+calculatePrice(item);
  },0)

  const orderTotal = cartSubTotal;

  //handle delete btn
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/carts/${item._id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            }
          });
      }
    });
  };
  return (
    <div className="section-container">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
        <div className="py-36 flex flex-col  justify-center items-center gap-8">
          {/* texts */}
          <div className="space-y-7 px-4">
            <h2 className="md:text-5xl text-black text-4xl font-bold md:leading-snug">
              Items Added to the
              <span className="text-green"> Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Table for the cart*/}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-green text-white rounded-sm">
              <tr>
                <th>#</th>
                <th>Food</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {cart.map((item, index) => (
                <tr key={index}>
                  <td className="text-black">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={item.image} alt="" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-black">{item.name}</td>
                  <td className="text-black">
                    <button
                      className="btn btn-xs border-none text-black bg-green"
                      onClick={() => handleDecrease(item)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={() => console.log(item.quantity)}
                      className="w-10 mx-2 bg-white text-center overflow-hidden appearance-none"
                    />
                    <button
                      className="btn btn-xs border-none text-black bg-green"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </td>
                  <td className="text-black">&#8377;{calculatePrice(item).toFixed(2)}</td>
                  <th>
                    <button
                      className="btn btn-ghost text-red btn-xs"
                      onClick={() => handleDelete(item)}
                    >
                      <FaTrash />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* customer details */}
      <div className="my-12 flex flex-col md:flex-row justify-between items-start">
        <div className="md:w-1/2 space-y-3">
          <h3 className="font-medium">Customer Details</h3>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>User_id: {user.uid}</p>
        </div>
        <div className="md:w-1/2 space-y-3">
          <h3 className="font-medium">Shopping Details</h3>
          <p> Total Items: {cart.length}</p>
          <p> Total price: &#8377;{orderTotal.toFixed(2)}</p>
          <button className="btn bg-green border-none text-white">
            {" "}
            Proceed Checkout{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
