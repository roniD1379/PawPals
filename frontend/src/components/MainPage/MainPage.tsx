import "./MainPage.css";
import logo from "../../assets/images/logo_img.png";
import { FaHome, FaPlus, FaUser } from "react-icons/fa";
import { useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import Profile from "../Profile/Profile";
import Feed from "../Feed/Feed";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { globals } from "../utils/Globals";
import { clearTokens } from "../utils/AuthUtils";
import api from "../utils/AxiosInterceptors";

function MainPage() {
  const navigate = useNavigate();

  const [showSection, setShowSection] = useState("nav-feed");

  const handleNavbarClick = (id: string) => {
    const navBtns = document
      .getElementById("main-page-nav")
      ?.getElementsByTagName("button");
    if (navBtns) {
      for (let i = 0; i < navBtns?.length; i++) {
        if (navBtns[i].id === id) {
          navBtns[i].classList.add("main-page-nav-btn-active");
        } else {
          navBtns[i].classList.remove("main-page-nav-btn-active");
        }
      }
    }

    setShowSection(id);
  };

  const logout = async () => {
    await api
      .post(globals.auth.logout, {
        refreshToken: localStorage.getItem("refreshToken"),
      })
      .then(() => {
        clearTokens();
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showFeed = () => {
    handleNavbarClick("nav-feed");
  };

  return (
    <div className="MainPage">
      <main className="main-page-main">
        <header className="main-page-header">
          <img className="main-page-header-img" src={logo} alt="logo_image" />
          <div className="main-page-header-titles">
            <div className="main-page-header-main-title">PawPals</div>
            <div className="main-page-header-sub-title">
              Find your perfect fury friend
            </div>
          </div>
          <button
            className="btn logout-btn"
            title="Logout"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </header>
        <div>
          {showSection === "nav-feed" && <Feed />}
          {showSection === "nav-create-post" && (
            <CreatePost showFeed={showFeed} />
          )}
          {showSection === "nav-profile" && <Profile />}
        </div>
        <nav id="main-page-nav" className="main-page-nav">
          <button
            id="nav-feed"
            className="main-page-nav-btn main-page-nav-btn-active"
            onClick={() => handleNavbarClick("nav-feed")}
          >
            <FaHome size={20} />
          </button>
          <button
            id="nav-create-post"
            className="main-page-nav-btn"
            onClick={() => handleNavbarClick("nav-create-post")}
          >
            <FaPlus size={20} />
          </button>
          <button
            id="nav-profile"
            className="main-page-nav-btn"
            onClick={() => handleNavbarClick("nav-profile")}
          >
            <FaUser size={20} />
          </button>
        </nav>
      </main>
    </div>
  );
}

export default MainPage;
