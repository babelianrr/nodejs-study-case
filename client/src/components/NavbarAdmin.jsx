import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../context/userContext";
import logo from "../assets/waysbucks.png";
import profilepic from "../assets/blank-profile.png";
import { API } from "../config/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faIceCream, faBeer, faReceipt } from '@fortawesome/free-solid-svg-icons';

import LangSelector from "../LangSelector";

const logoutIcon = <FontAwesomeIcon icon={faSignOutAlt} />
const icecreamIcon = <FontAwesomeIcon icon={faIceCream} />
const beerIcon = <FontAwesomeIcon icon={faBeer} />
const receiptIcon = <FontAwesomeIcon icon={faReceipt} />

export default function NavbarAdmin() {
  const { t } = useTranslation();
  const [state, dispatch] = useContext(UserContext);
  const [profile, setProfile] = useState({});

  let history = useHistory();

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    history.push("/auth");
  };

  const getProfile = async (id) => {
    try {
      const response = await API.get("/profile/" + state.user.id);
      setProfile(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);


  return (
    <div>
      <div className="container">
        <nav>
          <div className="container d-flex flex-row align-items-center justify-content-between">
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <img src={logo} alt="logo" style={{ width: '60px' }} />
            </Link>
            <LangSelector />
            <ul className="d-flex flex-row align-items-center navbar-nav">
              <li className="mx-3 nav-item dropdown">
                <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={profile?.image ? profile.image : profilepic} alt="profile pic" className="rounded-circle" style={{ width: '50px' }} />
                </div>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link to="/product-admin" style={{ textDecoration: "none" }}>
                    <li>
                      <div className="d-flex flex-row align-items-center nav-item">
                        <div className="dropdown-item text-center nav-link">
                          <span className="text-red">{beerIcon} <span className="fw-9">{t('products')}</span></span>
                        </div>
                      </div>
                    </li>
                  </Link>
                  <Link to="/topping-admin" style={{ textDecoration: "none" }}>
                    <li>
                      <div className="d-flex flex-row align-items-center nav-item">
                        <div className="dropdown-item text-center nav-link">
                          <span className="text-red">{icecreamIcon} <span className="fw-9">{t('toppings')}</span></span>
                        </div>
                      </div>
                    </li>
                  </Link>
                  <Link to="/transaction-admin" style={{ textDecoration: "none" }}>
                    <li>
                      <div className="d-flex flex-row align-items-center nav-item">
                        <div className="dropdown-item text-center nav-link">
                          <span className="text-red">{receiptIcon} <span className="fw-9">{t('transactions')}</span></span>
                        </div>
                      </div>
                    </li>
                  </Link>
                  <li><hr className="dropdown-divider" /></li>
                  <li className="text-center">
                    <div onClick={logout} className="dropdown-item nav-link">
                      <span className="text-red">{logoutIcon} <span className="fw-9">{t('logout')}</span></span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
