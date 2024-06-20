import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';


const App = () => {
    return (
       <div>
        <Outlet/>
       </div>
    );
};

export default App;
