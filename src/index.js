import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import Home from './components/Home';
import CreateEmployee from './components/Createemployee';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { store } from './redux';
import { Provider } from 'react-redux';
import Editemployee from './components/Editemployee';
import ViewEmployee from './components/ViewEmployee';
import Adminnav from './components/Adminnav';


const router=createBrowserRouter(
  createRoutesFromElements(
    // <Route path="/" element={<App/>}>
    // <Route path="/loginpage" element={<LoginPage />} />
    // <Route path="/home" element={<Home />} />
    // <Route path="/employeelist" element={<EmployeeList />} />
    // <Route path="/createemployee" element={<CreateEmployee />} />
    // <Route path="/editemployee/:id" element={<EditEmployee />} />
    // </Route>
    <Route path="/" element={<App/>}>
    <Route path="/home" element={<Home />} />
    <Route path="/loginpage" element={<LoginPage />} />
    <Route path="/adminnav" element={<Adminnav />} />
    <Route path="/edit/:id" element={<Editemployee />} />
    <Route path="/create" element={<CreateEmployee />} />
    <Route path="/view" element={<ViewEmployee />} />
    </Route>
  )
)

const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(
 <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  </React.StrictMode>,
);

reportWebVitals();
