import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import Menu from "../pages/Shop/Menu";
import Signup from "../components/Signup";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import CartPage from "../pages/Shop/CartPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path : "/cart-page",
        element : <CartPage/>

      },
      {
        path: "/update-profile",
        element: <UpdateProfile/>
      },
      
      
    ],
  },
  {
    path : "/signup",
    element: <Signup/>
  }
  
  
]);

export default router;
