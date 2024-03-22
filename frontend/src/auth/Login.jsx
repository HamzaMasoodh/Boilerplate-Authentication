import style from "./login.module.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { postToServerNoToken } from "../helpers/request";
import { TailSpin } from "react-loader-spinner";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const signUpHandler = async (e) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      toast.error("Fields are required");
      return;
    } else {
      setLoading(true);
      try {
        const response = await postToServerNoToken("user/signup", {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        });
        if (response.status) {
          toast.success(
            `Signup Successfull! Check your email ${email} inbox for verification code.`
          );
          setRightPanelActive(false);
        } else {
          toast.error(`${response.error}`);
          setEmail("");
          setFirstName("");
          setLastName("");
          setPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred during signup.");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
      }
      setLoading(false);
    }
  };
  const loginHandler = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Fields are required");
      return;
    } else {
      setLoading(true);
      try {
        const response = await postToServerNoToken("user/login", {
          email: loginEmail,
          password: loginPassword,
        });

        if (response.status) {
          toast.success(response.success);
          if (response.verified) {
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("userId", response.data.data._id);
            navigate("/");
          } else {
            let user = response.data.data;
            navigate(`/verify-email?person=${user._id}`);
          }
        } else {
          toast.error(`${response.error}`);
          setLoginEmail("");
          setLoginPassword("");
        }
      } catch (error) {
        console.log(error);
        toast.error(`${error.message}`);
        setLoginEmail("");
        setLoginPassword("");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    const container = document.getElementById("container");
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }, []);
  return (
    <div className={`${style['body__login']}`}>
      <div className="text-center mb-5">
        <h1 className={style.h1}>Web App</h1>
      </div>
      <div
        className={`${style.container} ${
          rightPanelActive ? style["right-panel-active"] : ""
        }`}
        id="container"
      >
        <div class={`${style["form-container"]} ${style["sign-up-container"]}`}>
          <form className={style.form} action="#">
            <h2 className={style.h1}>Create Account</h2>
            <span className={style.span}>
              or use your email for registration
            </span>
            <input
              className={style.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
            />
            <input
              className={style.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
            />
            <input
              className={style.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <input
              className={style.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <input
              className={style.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
            />
            <button
              className={style.button}
              onClick={signUpHandler}
              disabled={loading}
            >
              {loading ? (
                 <TailSpin color="#00BFFF" height={30} width={30} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
        <div class={`${style["form-container"]} ${style["sign-in-container"]}`}>
          <form className={style.form} action="#">
            <h1 className={style.h1}>Sign in</h1>
            <span className={style.span}>or use your account</span>
            <input
              className={style.input}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <input
              className={style.input}
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
            />
            <a className={style.a} href="#">
              Forgot your password?
            </a>
            <button
              className={style.button}
              onClick={loginHandler}
              disabled={loading}
            >
              {loading ? (
                 <TailSpin color="#00BFFF" height={30} width={30} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        <div class={style["overlay-container"]}>
          <div class={style.overlay}>
            <div class={`${style["overlay-panel"]} ${style["overlay-left"]}`}>
              <h1 className={style.h1}>Welcome Back!</h1>
              <p className={style.p}>
                To keep connected with us please login with your personal info
              </p>
              <button
                className={`${style.button} ${style.ghost}`}
                onClick={() => setRightPanelActive(false)}
                id="signIn"
              >
                Sign In
              </button>
            </div>
            <div class={`${style["overlay-panel"]} ${style["overlay-right"]}`}>
              <h1 className={style.h1}>Welcome</h1>
              <p className={style.p}>
                Enter your personal details and start journey with us
              </p>
              <button
                className={`${style.button} ${style.ghost}`}
                onClick={() => setRightPanelActive(true)}
                id="signUp"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
