import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginRedux } from "../redux/userslice";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const dispatch =useDispatch();

  const { username, password } = credentials;

  const handleChange = async (e) => {
    await setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);
    if (!username || !password) {
      setAlertMessage("Username and password are required");
      setShowAlert(true);
      return;
    } else if (username && password) {
      const fetchdata = await fetch("http://localhost:8080/logindataenter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error));
      console.log(fetchdata);
      
      if (fetchdata.success) {
        alert(fetchdata.success);
      }
      else{
        dispatch(loginRedux(fetchdata));
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      }
    }
  };

  return (
    <div>
      <br></br>
      <br></br>
      <Container
        style={{
          width: "500px",
          height: "400px",
          borderRadius: "20px",
          backgroundColor: "gray",
        }}
      >
        <center>
          <br></br>
          <h2 className="my-2" style={{ color: "rgb(255, 153, 102)" }}>
            Login Page
          </h2>
          {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
          <center>
            <Form
              onSubmit={handleSubmit}
              className="my-5"
              style={{ fontSize: "20px" }}
            >
              <Form.Group
                as={Row}
                className="mb-3 mx-5"
                controlId="formUsername"
              >
                <Form.Label column sm="3" className="text-white">
                  Username:
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    style={{
                      borderRadius: "10px",
                      display: "inline-block",
                      width: "calc(100% - 50px)",
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3 mx-5"
                controlId="formPassword"
              >
                <Form.Label column sm="3" className="text-white">
                  Password:
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{
                      borderRadius: "10px",
                      display: "inline-block",
                      width: "calc(100% - 50px)",
                    }}
                  />
                </Col>
              </Form.Group>
              <Button
                type="submit"
                style={{ backgroundColor: "rgb(255, 153, 102)" }}
              >
                Login
              </Button>
            </Form>
          </center>
        </center>
      </Container>
    </div>
  );
};

export default LoginPage;
