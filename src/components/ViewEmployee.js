import React, { useEffect, useState } from "react";
import { Table, Container, Button, Modal, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewEmployee = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8080/employeedata");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployeeList(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEdit = (id) => {
    setToastMessage(`Editing employee with ID ${id}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedEmployee(id);
    setShowModal(true);
  };

  const redirectToCreateEmployee = () => {
    navigate("/create");
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/deletedata/${selectedEmployee}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      setEmployeeList(
        employeeList.filter((employee) => employee.id !== selectedEmployee)
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(74 106 11)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "30px",
        paddingBottom:"250px"
      }}
    >
      <Container className="my-5">
        <h2 className="text-white">Employee List</h2>
        <hr className="border-light" />
        <h3 className="text-center" onClick={redirectToCreateEmployee} style={{color: "yellowgreen", cursor: "pointer"}}>Create Employee</h3>
        <hr className="border-light" />
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#25073c", color: "white" }}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Courses</th>
              <th>Created Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#f8f9fa" }}>
            {employeeList.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.course}</td>
                <td>{new Date(employee.createdate).toLocaleDateString()}</td>
                <td>
                  {employee.fileBase64 && (
                    <img
                      src={`data:image/jpeg;base64,${employee.fileBase64}`}
                      alt="Employee"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(employee.id)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this employee?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          style={{ position: "fixed", bottom: 20, right: 20 }}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </Container>
    </div>
  );
};

export default ViewEmployee;
