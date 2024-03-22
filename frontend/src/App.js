import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
// import "./App.css";
import Protect from "./helpers/Protect";
import Login from "./auth/Login";
import VerifyEmail from "./auth/verification";
import Home from "./Home/Home";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getFromServer } from "./helpers/request";
import { TailSpin } from "react-loader-spinner";
import { setLoginUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoginOrSignUpPage =
    location.pathname.includes("/login") ||
    location.pathname.includes("/verify-email");

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("Page loaded or route changed:", location.pathname);
    const storage = localStorage.getItem("accessToken");
    console.log("Token",storage);
    if (storage) {
      setIsLoading(true);
      const fetchResult = async () => {
        console.log("Calling fetchResult");
        const result = await getFromServer("user");
        if (result.status) {
          let item = {};
          item["data"] = result.data;
          localStorage.setItem("authUser", JSON.stringify(item));
          dispatch(setLoginUser(result.data));
          navigate("/");
        } else {
          toast.error(result.message || result.error);
        }
        console.log("fetchResult completed");
        setIsLoading(false);
      };
      fetchResult();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  if (isLoading) {
    return <TailSpin color="#00BFFF" height={80} width={80} />;
  } else {
    return  (
      <>
        {!isLoginOrSignUpPage && 
    <Header />
    }
        <Routes>
          <Route index element={<Protect element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<Home />} />
        </Routes>
        {!isLoginOrSignUpPage && 
    <Footer />
    }
      </>
    );
  }
};

export default App;
