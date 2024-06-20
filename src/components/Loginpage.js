import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { username, password } = data;

  const changefun = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const subm = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      alert("Please fill in both username and password");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8080/logindata", {
        params: { username, password },
      });

      if (response.data.message) {
        alert("Invalid credentials");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4" style={{ backgroundColor: "yellow" }}>
            <h2>Login Page</h2>
          </div>
          <div className="p-4" style={{ backgroundColor: "lightgray", borderRadius: "10px" }}>
            <Form onSubmit={subm}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={username}
                  onChange={changefun}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={changefun}
                  placeholder="Enter password"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-4">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
