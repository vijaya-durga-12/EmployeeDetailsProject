import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/employeedata");
      setEmployees(response.data);
    } catch (error) {
      console.error("There was an error fetching the employees!", error);
    }
  };

  const redirectToCreateEmployee = () => {
    navigate("/createemployee");
  };

  const redirectToEditEmployee = (employeeId) => {
    navigate(`/editemployee/${employeeId}`);
  };

  const deleteEmployee = async (employeeId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/employeesdatadelete/${employeeId}`
      );
      console.log(response.data);
      fetchEmployees(); 
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <hr />
      <div
        onClick={redirectToCreateEmployee}
        style={{ color: "yellowgreen", cursor: "pointer" }}
      >
        <h3>Create Employee</h3>
      </div>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Courses</th>
            <th>Image</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.course}</td>
              <td>
                {employee.preview && (
                  <img
                    src={employee.preview}
                    alt="Employee Preview"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                )}
              </td>
              <td>{new Date(employee.createdate).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => redirectToEditEmployee(employee.id)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => deleteEmployee(employee.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeeList;
