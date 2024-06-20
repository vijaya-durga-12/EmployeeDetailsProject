import React, { useState } from "react";
import { Card, Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    designation: "",
    gender: "",
    courses: [],
    file: null,
    preview: "", // To store base64 representation of the image
  });

  const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility

  const {
    name,
    email,
    mobilenumber,
    designation,
    gender,
    courses,
    file,
    preview,
  } = data;

  const navigate = useNavigate();

  const changefun = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setData({
        ...data,
        courses: checked
          ? [...courses, value]
          : courses.filter((course) => course !== value),
      });
    } else if (type === "file") {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setData({ ...data, file: selectedFile });
        convertBase64(selectedFile)
          .then((base64String) => {
            setData({ ...data, preview: base64String });
          })
          .catch((error) => {
            console.error("Error converting image to base64:", error);
          });
      }
    } else {
      setData({ ...data, [name]: value });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobilenumber", mobilenumber);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("courses", courses.join(","));
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8080/employeesdata", formData);

      if (response.data) { // Checking for response.data instead of response.message
        console.log("Data added successfully!", response.data);
        // Optionally, reset the form fields after successful submission
        setData({
          name: "",
          email: "",
          mobilenumber: "",
          designation: "",
          gender: "",
          courses: [],
          file: null,
          preview: "", // Reset image preview
        });
        setShowAlert(true); // Show the alert

        // Redirect to employee list after 2 seconds
        setTimeout(() => {
          navigate('/employeelist');
        }, 2000);
      } else {
        throw new Error("Failed to add data");
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      // Optionally, show an error alert or message to the user
      setShowAlert(true); // Show the alert for error
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4">
        <h3 className="mb-4">Create Employee</h3>
        <Form onSubmit={handleSubmit}>
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
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMobileNumber">
            <Form.Label>Mobile Number:</Form.Label>
            <Form.Control
              type="text"
              name="mobilenumber"
              value={mobilenumber}
              onChange={changefun}
              placeholder="Enter mobile number"
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
                checked={gender === "Male"}
                onChange={changefun}
              />
              <Form.Check
                inline
                label="Female"
                name="gender"
                type="radio"
                id="genderFemale"
                value="Female"
                checked={gender === "Female"}
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
            <Form.Control
              type="file"
              name="file"
              onChange={changefun}
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit
          </Button>
          {/* Alert for successful submission */}
          {showAlert && (
            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className="mt-3">
              Data added successfully!
            </Alert>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default CreateEmployee;
