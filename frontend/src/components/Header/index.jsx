import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/vendor/bootstrap/css/bootstrap.min.css";
import "../../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../assets/vendor/fontawesome-free/css/all.min.css";
import "../../assets/vendor/glightbox/css/glightbox.min.css";
import "../../assets/vendor/swiper/swiper-bundle.min.css";
import "../../assets/vendor/aos/aos.css";
import "../../assets/css/main.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false);

  const user = useSelector((state) => state.user.user);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 400) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate('/login')
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="header" className={`header d-flex align-items-center fixed-top ${isScrolled ? 'sticked' : ''}`}>
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center">
          {/* Uncomment the line below if you also wish to use an image logo */}
          {/* <img src="/assets/img/logo.png" alt="None" /> */}
          <h1>Web App</h1>
        </Link>

        <i className="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
        <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>

        <nav id="navbar" className="navbar">
          <ul>
            <li>
              <Link to="index" className="active">
                Home
              </Link>
            </li>
            
            <li className="dropdown">
              <Link to="#">
                <span>Docs</span>{" "}
                <i className="bi bi-chevron-down dropdown-indicator"></i>
              </Link>
              <ul>
                <li>
                  <Link to="/drop-down-1">Drop Down 1</Link>
                </li>
                <li className="dropdown">
                  <Link to="#">
                    <span>Deep Drop Down</span>
                    <i className="bi bi-chevron-down dropdown-indicator"></i>
                  </Link>
                  <ul>
                    <li>
                      <Link to="/deep-drop-down-1">Deep Drop Down 1</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-2">Deep Drop Down 2</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-3">Deep Drop Down 3</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-4">Deep Drop Down 4</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-5">Deep Drop Down 5</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/drop-down-2">Drop Down 2</Link>
                </li>
                <li>
                  <Link to="/drop-down-3">Drop Down 3</Link>
                </li>
                <li>
                  <Link to="/drop-down-4">Drop Down 4</Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <Link to="#">
                <span>International</span>{" "}
                <i className="bi bi-chevron-down dropdown-indicator"></i>
              </Link>
              <ul>
                <li>
                  <Link to="/drop-down-1">Drop Down 1</Link>
                </li>
                <li className="dropdown">
                  <Link to="#">
                    <span>Deep Drop Down</span>
                    <i className="bi bi-chevron-down dropdown-indicator"></i>
                  </Link>
                  <ul>
                    <li>
                      <Link to="/deep-drop-down-1">Deep Drop Down 1</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-2">Deep Drop Down 2</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-3">Deep Drop Down 3</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-4">Deep Drop Down 4</Link>
                    </li>
                    <li>
                      <Link to="/deep-drop-down-5">Deep Drop Down 5</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/drop-down-2">Drop Down 2</Link>
                </li>
                <li>
                  <Link to="/drop-down-3">Drop Down 3</Link>
                </li>
                <li>
                  <Link to="/drop-down-4">Drop Down 4</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="pricing">Pricing</Link>
            </li>
            <li>
              <Link to="about">About</Link>
            </li>
            <li>
              <Link to="Blog">Blog</Link>
            </li>
            <li>
              <Link to="contact">Contact</Link>
            </li>
            <li>
              <Link className="get-a-quote" to="get-a-quote">
                Become a Partner
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
