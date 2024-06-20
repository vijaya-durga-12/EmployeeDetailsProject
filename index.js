const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");

const app = express();
const port = 8080;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dealsdray1",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Employee endpoints
// GET all employees
app.get("/employeedata", (req, res) => {
  db.query("SELECT * FROM t_employee1", (err, data) => {
    if (err) {
      console.error("Error fetching employees:", err);
      res.status(500).send(err);
      return;
    }
    res.json(data);
  });
});

// GET employee by ID
app.get("/employees/:id", (req, res) => {
  const employeeId = req.params.id;
  db.query("SELECT * FROM t_employee1 WHERE id = ?", [employeeId], (err, data) => {
    if (err) {
      console.error("Error fetching employee:", err);
      res.status(500).send(err);
      return;
    }
    if (data.length === 0) {
      res.status(404).send("Employee not found");
      return;
    }
    res.json(data[0]);
  });
});

// POST new employee
app.post('/employeesdata', upload.single('file'), (req, res) => {
    const { name, email, mobilenumber, designation, gender, courses } = req.body;
    const file = req.file; // This contains file details if uploaded
  
    // Inserting data into MySQL database
    const insertQuery = 'INSERT INTO employees (name, email, mobilenumber, designation, gender, courses, filename) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, email, mobilenumber, designation, gender, courses.join(','), file.filename];
  
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).json({ message: 'Failed to add data to database' });
      } else {
        console.log('Data added to database successfully');
        res.status(200).json({ message: 'Data received and saved successfully!' });
      }
    });
  });
  

// PUT update employee by ID
app.put("/employeesdata/:id", upload.single("file"), (req, res) => {
  const employeeId = req.params.id;
  const { name, email, mobilenumber, designation, gender, courses } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  // Validate mobile number format (simple numeric check)
  if (!isValidMobile(mobilenumber)) {
    return res.status(400).send("Invalid mobile number format");
  }

  const updateQuery = `
    UPDATE t_employee1 
    SET name = ?, email = ?, mobile = ?, designation = ?, gender = ?, courses = ?, image = ?
    WHERE id = ?`;

  const empData = [
    name,
    email,
    mobilenumber,
    designation,
    gender,
    courses.join(","),
    imagePath,
    employeeId,
  ];

  db.query(updateQuery, empData, (err) => {
    if (err) {
      console.error("Error updating employee:", err);
      res.status(500).send(err);
      return;
    }
    res.send("Employee updated successfully");
  });
});

// Login endpoints
// GET all login data
app.get("/logindata", (req, res) => {
  db.query("SELECT * FROM t_login1", (err, data) => {
    if (err) {
      console.error("Error fetching logins:", err);
      res.status(500).send(err);
      return;
    }
    res.json(data);
  });
});

// POST new login data
app.post("/loginpage", (req, res) => {
  const { username, password } = req.body;

  // Validate username (email format)
  if (!isValidEmail(username)) {
    return res.status(400).send("Invalid email format");
  }

  const loginData = [username, password];

  db.query(
    "INSERT INTO t_login1 (username, password) VALUES (?, ?)",
    loginData,
    (err) => {
      if (err) {
        console.error("Error inserting login:", err);
        res.status(500).send(err);
        return;
      }
      res.send("Login data added successfully");
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Function to validate mobile number format (simple numeric check)
function isValidMobile(mobilenumber) {
  return /^\d+$/.test(mobilenumber);
}
