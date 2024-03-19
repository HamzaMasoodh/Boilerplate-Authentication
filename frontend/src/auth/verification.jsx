import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFromServerNoToken, postToServerNoToken } from "../helpers/request";
import style from "./login.module.css";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const person = searchParams.get("person");

  const verify = async () => {
    if (!person) {
      toast.error("No userId found.");
      return;
    }
    setLoading(true);
    setShowResend(false);
    try {
      const response = await getFromServerNoToken(
        `verify-email?userId=${person}&verificationCode=${verificationCode}`
      );
      if (response.status) {
        if (response.verified) {
          toast.success(response.success);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.success(
            "Email verified successfully! You will be redirected shortly."
          );
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } else {
        toast.error(response.error || "Verification failed.");
        setShowResend(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification.");
      setShowResend(true);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      const response = await postToServerNoToken(
        `resend-verification-email?userId=${person}`
      );
      if (response.status) {
        if (response.verified) {
          toast.success(response.success);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.success(
            "Verification email resent successfully. Please check your inbox."
          );
        }
        setShowResend(false);
      } else {
        toast.error(`${response.error}`);
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error(
        "An error occurred while trying to resend the verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeChange = (e) => {
    let value = e.target.value;
    
    value = value.replace(/\D/g, '').slice(0, 6);
  
    setVerificationCode(value);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className={style.containerVerify}>
      <div className="text-center mb-5">
        <h1 className={style.h1}>Atlas Signature</h1>
        <button
          onClick={logout}
          style={{ position: "absolute", right: 20, top: 20 }}
        >
          Logout
        </button>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <TailSpin color="#00BFFF" height={50} width={50} />
        </div>
      ) : (
        <div className="text-center mb-5">
          <p className={style.h1}>
            {showResend
              ? "Verification email sent again. Enter the code above to continue."
              : "Enter 6 digit Verification Code"}
          </p>
          <input
            className={style.inputVerify}
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            type="text"
            pattern="\d*"
            maxLength="6"
            placeholder="Enter Verification Code"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button onClick={verify} className={style.buttonVerify}>
              Verify Email
            </button>
            {showResend && (
              <button
                onClick={resendVerificationEmail}
                className={style.buttonVerify}
                style={{ marginTop: "10px" }}
              >
                Resend Verification Email
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
