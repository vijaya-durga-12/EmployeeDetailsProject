import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";

const Navv = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/loginpage");
  };

  return (
    <div>
      <Navbar expand="lg" bg="secondary" style={{ width: "100%" }}>
        <Navbar.Brand className="text-white" style={{ fontSize: "20px" }}>
          LOGO
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto d-flex flex-grow-1 justify-content-around">
            <Nav.Link as={Link} to="/home" className="text-white mr-3">
              HOME
            </Nav.Link>
            <Nav.Link as={Link} to="/employeelist" className="text-white mr-3">
              EMPLOYEE LIST
            </Nav.Link>
            <Nav.Link
              className="text-white ml-auto"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              LOGOUT
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Navv;
