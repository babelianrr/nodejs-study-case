import { useContext, useState } from "react";
import { Modal } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/userContext";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default function Auth() {
  let history = useHistory();

  const [state] = useContext(UserContext);

  const checkAuth = () => {
    if (state.isLogin === true) {
      if (state.user.role_id === 1) {
        history.push("/admin");
      } else if (state.user.role_id === 2) {
        history.push("/");
      }
    }
  };
  checkAuth();

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const handleOpenLogin = () => setShowLogin(true)
  const handleCloseLogin = () => setShowLogin(false)
  const handleOpenRegister = () => setShowRegister(true)
  const handleCloseRegister = () => setShowRegister(false)

  return (
    <div>
      <div className="container">
        <nav>
          <div className="container d-flex flex-row align-items-center justify-content-between">
            <div>Navbar</div>
            <div>
              <button className="btn btn-outline-primary btn-sm mx-2" onClick={handleOpenLogin}>Login</button>
              <button className="btn btn-primary btn-sm mx-2" onClick={handleOpenRegister}>Register</button>
            </div>
          </div>
        </nav>
      </div>

      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton></Modal.Header>
        <Login />
      </Modal>
      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton></Modal.Header>
        <Register />
      </Modal>
    </div>
  );
}
