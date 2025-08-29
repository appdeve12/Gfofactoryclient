import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './cantainers/Layout/Layout';
import Dashboard from './cantainers/home/Dashboard';
import StockInward from "./cantainers/StockIn/StockInward";
import StockOutward from "./cantainers/stockout/StockOutward";
import Login from './cantainers/login/Login';
import SignUp from './cantainers/signup/SignUp';
import { ToastContainer } from 'react-toastify';
import ViewAllAdmin from './cantainers/signup/ViewAllAdmin';
import AddEditStockInward from './cantainers/StockIn/AddEditStockInward';
import AddStockOutward from './cantainers/stockout/AddStockOutward';
import Profile from './cantainers/profile/Profile';
import EditStockInward from "./cantainers/StockIn/EditStockInward"
import Addmaterial from './cantainers/addMaterials/Addmaterial';
import AddEditMaterialName from './cantainers/addMaterials/AddEditMaterialName';
function App() {
  return (
    <Router>
      <Routes>
        {/* Default "/" route redirect to "/login" */}
        <Route path="/" element={<Login />} />

        {/* Login and Signup routes */}


        {/* Protected routes inside Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="alladmin" element={<ViewAllAdmin />} />
          
        <Route path="register-user" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="stock-inward" element={<StockInward />} />
          
          <Route path="add-stock-inward" element={<AddEditStockInward />} />
          <Route path="edit-stock-inward/:id" element={<EditStockInward />} />
          <Route path="stock-outward" element={<StockOutward />} />
          
          <Route path="add-stock-outward" element={<AddStockOutward />} />
                    <Route path="add-material-name" element={<AddEditMaterialName />} />
          <Route path="edit-material-name/:id" element={<AddEditMaterialName />} />
          <Route path="materialdata" element={<Addmaterial />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
       
  );
}

export default App;
