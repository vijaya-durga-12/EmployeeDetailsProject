import React, { useState, useRef } from "react";
import { Card, Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const CreateEmployee = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    designation: "",
    gender: "", // Radio button value (Male/Female/Other)
    courses: [], // Array to store selected courses
  });

  const { name, email, mobilenumber, designation, gender, courses } = data;

  const [baseImage, setBaseImage] = useState(""); // State for image preview
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const isValidMobileNumber = (number) => /^[0-9]{10}$/.test(number);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const changefun = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setData((prevData) => ({
          ...prevData,
          courses: [...prevData.courses, value],
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          courses: prevData.courses.filter((course) => course !== value),
        }));
      }
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const subm = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setShowAlert(true);
      setAlertMessage("Invalid email format");
      return;
    }

    if (!isValidMobileNumber(mobilenumber)) {
      setShowAlert(true);
      setAlertMessage("Invalid mobile number format");
      return;
    }

    const finaldata = {
      ...data,
      fileBase64: baseImage,
      createdate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch("http://localhost:8080/employeesdatapost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finaldata),
      });

      const result = await response.text();

      if (response.ok) {
        setShowAlert(true);
        setAlertMessage("Employee created successfully!");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/view");
        }, 2000);
      } else {
        throw new Error(result || "Failed to create employee");
      }
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(error.message);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const iconchange = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(9 71 133)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
      }}
    >
      <Container>
        <Card
          className="p-4"
          style={{
            borderColor: "yellowgreen",
            borderRadius: "30px",
            maxWidth: "1000px",
            margin: "auto",
          }}
        >
          <center>
            <h3 className="mb-4" style={{ color: "yellowgreen" }}>
              Create Employee
            </h3>
          </center>
          {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
          <Form onSubmit={subm}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={changefun}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={changefun}
                placeholder="Enter email id"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMobileNumber">
              <Form.Label>Mobile No:</Form.Label>
              <Form.Control
                type="text"
                name="mobilenumber"
                value={mobilenumber}
                onChange={changefun}
                placeholder="Enter mobile number"
                maxLength={10} // Limit input length to 10 digits
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDesignation">
              <Form.Label>Designation:</Form.Label>
              <Form.Control
                as="select"
                name="designation"
                value={designation}
                onChange={changefun}
              >
                <option value="">Select Designation</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>Gender:</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Male"
                  name="gender"
                  type="radio"
                  id="genderMale"
                  value="Male"
                  onChange={changefun}
                />
                <Form.Check
                  inline
                  label="Female"
                  name="gender"
                  type="radio"
                  id="genderFemale"
                  value="Female"
                  onChange={changefun}
                />
                <Form.Check
                  inline
                  label="Other"
                  name="gender"
                  type="radio"
                  id="genderOther"
                  checked={gender === "Other"}
                  value="Other"
                  onChange={changefun}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCourses">
              <Form.Label>Courses:</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="MCA"
                  name="courses"
                  type="checkbox"
                  id="courseMCA"
                  value="MCA"
                  checked={courses.includes("MCA")}
                  onChange={changefun}
                />
                <Form.Check
                  inline
                  label="BSc"
                  name="courses"
                  type="checkbox"
                  id="courseBSc"
                  value="BSc"
                  checked={courses.includes("BSc")}
                  onChange={changefun}
                />
                <Form.Check
                  inline
                  label="BCA"
                  name="courses"
                  type="checkbox"
                  id="courseBCA"
                  value="BCA"
                  checked={courses.includes("BCA")}
                  onChange={changefun}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFile">
              <Form.Label>Upload Image:</Form.Label>
              <div>
                {baseImage ? (
                  <img
                    src={baseImage}
                    alt="Selected"
                    style={{
                      height: "100px",
                      width: "100px",
                      borderRadius: "50px",
                    }}
                  />
                ) : (
                  <FaUserCircle
                    className="icon"
                    size={80}
                    onClick={iconchange}
                    style={{ cursor: "pointer", color: "yellowgreen" }}
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </Form.Group>
            <style>
              {`
              .stylebutton{
                background-color: yellowgreen;
              }
              .stylebutton:hover{
                background-color: blue;
              }
            `}
            </style>
            <Button className="stylebutton" type="submit" block>
              Create Employee
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default CreateEmployee;
