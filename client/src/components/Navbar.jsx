import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import { UserContext } from "../context/userContext"
import profilepic from "../assets/blank-profile.png"

export default function Navbar() {
  const [state, dispatch] = useContext(UserContext)
  let history = useHistory()

  const logout = () => {
    console.log(state)
    dispatch({
      type: "LOGOUT",
    })
    history.push("/auth")
  }

  return (
    <div>
      <div className="container">
        <nav>
          <div className="container d-flex flex-row align-items-center justify-content-between">
            <div>Navbar</div>
            <ul className="d-flex flex-row align-items-center navbar-nav">
              <li className="mx-3 nav-item dropdown">
                <div className="dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={profilepic} alt="profile pic" className="rounded-circle" style={{ width: '50px' }} />
                </div>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li className="text-center">
                    <div className="dropdown-item nav-link" onClick={logout}>
                      Logout
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
