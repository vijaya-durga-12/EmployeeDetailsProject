import React from "react";
import { Container } from "react-bootstrap";

const HomePage = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container className="text-center">
        <h1 style={{ color: "rgb(7 30 50)" }}>Welcome to the Home Page</h1>
      </Container>
    </div>
  );
};

export default HomePage;
