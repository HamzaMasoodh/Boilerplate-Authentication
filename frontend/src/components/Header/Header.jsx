import React, { useState } from "react";
import style from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const user = useSelector((state) => state.user.user);
  
  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate('/login')
  };

  return (
    <header className={style.header}>
      <div className={style.logo}>Atlas Signature</div>
      <nav className={style.nav}>
        <ul className={style.navList}>
          <li className={style.navItem}>Docs</li>
          <li className={style.navItem}>About</li>
        </ul>
      </nav>
      <div className={style.userDropdown}>
        <div className={style.userProfile}>
          <img
            src={`${user.profileImageUrl}`}
            alt="User"
            className={style.userImage}
          />
          <span
            className={style.userName}
          >{`${user.firstName} ${user.lastName}`}</span>
        </div>
        <div className={style.dropdownContent}>
          <button onClick={() => navigate('/profile')} className={style.dropdownItem}>Profile</button>
          <button onClick={logoutHandler} className={style.dropdownItem}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
