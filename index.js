const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dealsdray1",
});

// Helper Functions
const validGenders = ["Male", "Female", "Other"];
const validCourses = ["MCA", "BSc", "BCA"];

const isValidGender = (gender) => validGenders.includes(gender);
const isValidCourses = (courses) =>
  courses.every((course) => validCourses.includes(course));
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

// Routes
app.get("/employeedata", async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT id, name, email, mobile, designation, gender, course, createdate, image FROM t_employee1"
    );
    res.send(data);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/employeesdataid/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const [data] = await db.query(
      "SELECT id, name, email, mobile, designation, gender, course, createdate, image FROM t_employee1 WHERE id = ?",
      [employeeId]
    );
    if (data.length === 0) {
      res.status(404).send("Employee not found");
      return;
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/employeesdatapost", async (req, res) => {
  const {
    name,
    email,
    mobilenumber, // Update field name to match client-side
    designation,
    gender,
    course,
    createdate,
    fileBase64,
  } = req.body;
  const image = fileBase64
    ? Buffer.from(fileBase64.split(",")[1], "base64")
    : null;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  if (!isValidMobile(mobilenumber)) {
    // Update field name to match client-side
    return res.status(400).send("Invalid mobile number format");
  }

  if (!isValidGender(gender)) {
    return res.status(400).send("Invalid gender value");
  }

  const courseArray = course ? course.split(",") : [];
  if (!isValidCourses(courseArray)) {
    return res.status(400).send("Invalid course values");
  }

  try {
    const [existingEmployee] = await db.query(
      "SELECT * FROM t_employee1 WHERE email = ?",
      [email]
    );
    if (existingEmployee.length > 0) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const insertQuery =
      "INSERT INTO t_employee1 (name, email, mobile, designation, gender, course, createdate, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      name,
      email,
      mobilenumber, // Update field name to match client-side
      designation,
      gender,
      courseArray.join(","),
      createdate,
      image,
    ];

    await db.query(insertQuery, values);
    res.send("Employee added successfully");
  } catch (err) {
    console.error("Error inserting data into database:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/employeesdata/:id", upload.single("image"), async (req, res) => {
  const employeeId = req.params.id;
  const { name, email, mobilenumber, designation, gender, course, createdate } =
    req.body; // Update field name to match client-side
  const image = req.file ? req.file.buffer : null;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  if (!isValidMobile(mobilenumber)) {
    // Update field name to match client-side
    return res.status(400).send("Invalid mobile number format");
  }

  try {
    const [existingEmployee] = await db.query(
      "SELECT * FROM t_employee1 WHERE email = ? AND id != ?",
      [email, employeeId]
    );
    if (existingEmployee.length > 0) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const updateQuery =
      "UPDATE t_employee1 SET name = ?, email = ?, mobile = ?, designation = ?, gender = ?, course = ?, createdate = ?, image = ? WHERE id = ?";
    const empData = [
      name,
      email,
      mobilenumber, // Update field name to match client-side
      designation,
      gender,
      course,
      createdate,
      image,
      employeeId,
    ];

    await db.query(updateQuery, empData);
    res.send("Employee updated successfully");
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/loginpageupdate", async (req, res) => {
  const { username, password } = req.body;
  const loginData = [username, password];

  try {
    await db.query(
      "INSERT INTO t_login1 (username, password) VALUES (?, ?)",
      loginData
    );
    res.send("Login data added successfully");
  } catch (err) {
    console.error("Error inserting login:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/logindataenter", async (req, res) => {
  var data = req.body;
  var username = data.username;
  var password = data.password;

  if (!username || !password) {
    return res
      .status(400)
      .send({ success: false, message: "Username and password are required" });
  } else {
    if (data.username == "" && data.password == "") {
      res.send({
        message: "please provide username and password",
      });
    } else {
      try {
        const [rows] = await db.query(
          "SELECT * FROM t_login1 WHERE username = ? AND password = ?",
          [data.username, data.password]
        );
        if (rows.length > 0) {
          res.send(rows);
        } else {
          res.send({ success: false, message: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Error during login:", error);
        res
          .status(500)
          .send({ success: false, message: "Internal server error" });
      }
    }
  }
});

app.get("/logindata", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM t_login1");
    res.send(rows);
  } catch (error) {
    console.error("Error fetching login data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/employeesdatadelete/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const [result] = await db.query("DELETE FROM t_employee1 WHERE id = ?", [
      employeeId,
    ]);
    if (result.affectedRows === 0) {
      res.status(404).send("Employee not found");
      return;
    }
    res.send("Employee deleted successfully");
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
