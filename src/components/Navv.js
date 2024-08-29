import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userslice";

const Navv = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.users);

  console.log(isAuthenticated);

  const handleLogout = () => {
    dispatch(logoutRedux());
    navigate("/loginpage");
  };

  const handleLogin = () => {
    navigate("/loginpage");
  };

  return (
    <Navbar expand="lg" style={{ width: "100%", backgroundColor: "#495057" }}>
      <Navbar.Brand className="text-white" style={{ fontSize: "20px" }}>
        {isAuthenticated.username ? isAuthenticated.username : <span>Username</span>}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto d-flex flex-grow-1 justify-content-around">
          <Nav.Link as={Link} to="/home" className="text-white mr-3">
            HOME
          </Nav.Link>
          <Nav.Link as={Link} to="/view" className="text-white mr-3">
            EMPLOYEE LIST
          </Nav.Link>
          {isAuthenticated.username ? (
            <Nav.Link
              className="text-white ml-auto"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              LOGOUT
            </Nav.Link>
          ) : (
            <Nav.Link
              className="text-white ml-auto"
              onClick={handleLogin}
              style={{ cursor: "pointer" }}
            >
              LOGIN
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navv;
