import React, { useState, useEffect } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Editemployee = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    designation: "",
    gender: "",
    courses: [],
    file: null,
  });

  useEffect(() => {
    // Fetch employee data by ID
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/employeedata/${id}`
        );
        const result = await response.json();
        setData({
          ...result,
          courses: result.courses ? result.courses.split(",") : [],
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const { name, email, mobilenumber, designation, gender, courses, file } =
    data;

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
      setData({ ...data, file: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const subm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobilenumber", mobilenumber);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("courses", courses);
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8080/employeesdata/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const result = await response.json();
      console.log(result); // Log the response from the server
      // Optionally, redirect or show a success message
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4">
        <h3 className="mb-4">Edit Employee</h3>
        <Form onSubmit={subm}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Name:
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={changefun}
              placeholder="Enter name"
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Email:
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={changefun}
              placeholder="Enter mail id"
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMobileNumber">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Mobile No:
            </Form.Label>
            <Form.Control
              type="text"
              name="mobilenumber"
              value={mobilenumber}
              onChange={changefun}
              placeholder="Enter mobile number"
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDesignation">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Designation:
            </Form.Label>
            <Form.Control
              as="select"
              name="designation"
              value={designation}
              onChange={changefun}
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGender">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Gender:
            </Form.Label>
            <div
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            >
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
              <Form.Check
                inline
                label="Other"
                name="gender"
                type="radio"
                id="genderOther"
                value="Other"
                checked={gender === "Other"}
                onChange={changefun}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCourses">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Course:
            </Form.Label>
            <div
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            >
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
            <Form.Label style={{ width: "100px", display: "inline-block" }}>
              Upload Image:
            </Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={changefun}
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            />
          </Form.Group>
          <Button
            type="submit"
            style={{
              fontSize: "18px",
              padding: "5px 10px",
              backgroundColor: "yellowgreen",
            }}
          >
            UPDATE
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Editemployee;
