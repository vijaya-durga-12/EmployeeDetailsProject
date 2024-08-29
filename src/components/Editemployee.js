import React, { useState, useEffect } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const Editemployee = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // To navigate after successful update
  const [data, setData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    designation: "",
    gender: "",
    courses: [],
    file: null,
    fileBase64: "", // Add state to store the base64 string
    createDate: "", // Add state to store the create date
  });

  useEffect(() => {
    // Fetch employee data by ID
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/employeesdataid/${id}`);
        const result = await response.json();
        setData({
          name: result.name || "",
          email: result.email || "",
          mobilenumber: result.mobile || "",
          designation: result.designation || "",
          gender: result.gender || "",
          courses: result.course ? result.course.split(",") : [],
          file: null,
          fileBase64: result.image || "", // Assuming result.image is the base64 string
          createDate: new Date().toISOString().split('T')[0], // Set the create date to today
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const { name, email, mobilenumber, designation, gender, courses, fileBase64, createDate } = data;

  const changefun = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setData({
        ...data,
        courses: checked ? [...courses, value] : courses.filter((course) => course !== value),
      });
    } else if (type === "file") {
      const selectedFile = files[0];
      setData({ ...data, file: selectedFile });
      convertToBase64(selectedFile);
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setData((prevState) => ({
        ...prevState,
        fileBase64: reader.result.split(",")[1], // Extract base64 string
      }));
    };
  };

  const subm = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      mobilenumber,
      designation,
      gender,
      course: courses.join(","),
      fileBase64, // Send base64 string instead of file
      createDate, // Include create date in the submitted data
    };

    try {
      const response = await fetch(`http://localhost:8080/employeesdata/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Employee updated successfully");

        navigate("/view"); 
      } else {
        const result = await response.text();
        throw new Error(result || "Failed to update employee");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(12 102 137)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
      }}
    >
    <Container>
      <Card className="p-4" style={{ borderColor: "#ffc107" }}>
        <center>
          <h3 className="mb-4 text-warning">Edit Employee</h3>
        </center>
        <style>
          {`
            .custom-radio input[type="radio"] {
              display: none;
            }

            .custom-radio input[type="radio"] + label::before {
              content: "";
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 2px solid #ffc107;
              margin-right: 5px;
              vertical-align: middle;
            }

            .custom-radio input[type="radio"]:checked + label::before {
              background-color: #ffc107;
              border-color: #ffc107;
            }

            .custom-checkbox input[type="checkbox"] {
              display: none;
            }

            .custom-checkbox input[type="checkbox"] + label::before {
              content: "";
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 3px;
              border: 2px solid #ffc107;
              margin-right: 5px;
              vertical-align: middle;
            }

            .custom-checkbox input[type="checkbox"]:checked + label::before {
              background-color: #ffc107;
              border-color: #ffc107;
            }

            .custom-checkbox input[type="checkbox"]:checked + label::after {
              content: "\\2714";
              display: inline-block;
              color: white;
              position: relative;
              left: 2px;
              top: -2px;
              font-size: 12px;
            }
              .stylebutton{
              background-color: #ffc107
              }
              .stylebutton: hover{
              background-color:blue
              }
          `}
        </style>
        <Form onSubmit={subm}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Name:</Form.Label>
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
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Email:</Form.Label>
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
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Mobile No:</Form.Label>
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
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Designation:</Form.Label>
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
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Gender:</Form.Label>
            <div style={{ display: "inline-block", width: "calc(100% - 110px)" }}>
              <div className="custom-radio" style={{ display: "inline-block" }}>
                <input
                  type="radio"
                  id="genderMale"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={changefun}
                />
                <label htmlFor="genderMale" style={{ display: "inline-block", cursor: "pointer" }}>Male</label>
              </div>
              <div className="custom-radio" style={{ display: "inline-block", marginLeft: "10px" }}>
                <input
                  type="radio"
                  id="genderFemale"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={changefun}
                />
                <label htmlFor="genderFemale" style={{ display: "inline-block", cursor: "pointer" }}>Female</label>
              </div>
              <div className="custom-radio" style={{ display: "inline-block", marginLeft: "10px" }}>
                <input
                  type="radio"
                  id="genderOther"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={changefun}
                />
                <label htmlFor="genderOther" style={{ display: "inline-block", cursor: "pointer" }}>Other</label>
              </div>
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCourses">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Course:</Form.Label>
            <div style={{ display: "inline-block", width: "calc(100% - 110px)" }}>
              <div className="custom-checkbox" style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  id="courseMCA"
                  name="courses"
                  value="MCA"
                  checked={courses.includes("MCA")}
                  onChange={changefun}
                />
                <label htmlFor="courseMCA" style={{ display: "inline-block", cursor: "pointer" }}>MCA</label>
              </div>
              <div className="custom-checkbox" style={{ display: "inline-block", marginLeft: "10px" }}>
                <input
                  type="checkbox"
                  id="courseBSc"
                  name="courses"
                  value="BSc"
                  checked={courses.includes("BSc")}
                  onChange={changefun}
                />
                <label htmlFor="courseBSc" style={{ display: "inline-block", cursor: "pointer" }}>BSc</label>
              </div>
              <div className="custom-checkbox" style={{ display: "inline-block", marginLeft: "10px" }}>
                <input
                  type="checkbox"
                  id="courseBCA"
                  name="courses"
                  value="BCA"
                  checked={courses.includes("BCA")}
                  onChange={changefun}
                />
                <label htmlFor="courseBCA" style={{ display: "inline-block", cursor: "pointer" }}>BCA</label>
              </div>
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFile">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Upload Image:</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={changefun}
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCreateDate">
            <Form.Label style={{ width: "100px", display: "inline-block" }}>Create Date:</Form.Label>
            <Form.Control
              type="text"
              name="createDate"
              value={createDate}
              onChange={changefun}
              placeholder="Enter create date"
              style={{ display: "inline-block", width: "calc(100% - 110px)" }}
              readOnly // Make the field read-only
            />
          </Form.Group>
          <Button
          className="stylebutton"
            type="submit"
            style={{ fontSize: "18px", padding: "5px 10px",  }}
          >
            UPDATE
          </Button>
        </Form>
      </Card>
    </Container>
    </div>
  );
};

export default Editemployee;
