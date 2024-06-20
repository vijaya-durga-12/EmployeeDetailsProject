import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import Adminnav from './components/Adminnav';
import Home from './components/Home';
import EmployeeList from './components/Employeelist';
import CreateEmployee from './components/Createemployee';
import EditEmployee from './components/Editemployee';
import reportWebVitals from './reportWebVitals';

const App = () => {
    return (
        <BrowserRouter>
            <Adminnav />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/employeelist" element={<EmployeeList />} />
                <Route path="/createemployee" element={<CreateEmployee />} />
                <Route path="/editemployee/:id" element={<EditEmployee />} />
            </Routes>
        </BrowserRouter>
    );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
