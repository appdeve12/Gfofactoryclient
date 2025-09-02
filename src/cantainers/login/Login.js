import React, { useState } from "react";
import { Form, Card, Container, Row, Col, Alert } from "react-bootstrap";
import Input from "../../components/common/Input";

import CustumButton from "../../components/common/CustumButton";
import { loginUser } from "../../services/allService";
  import {  toast } from 'react-toastify';
  import { useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
import { storetoken, storeuserdata } from "../../redux/authSlice";
const Login = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
const validateFunction=()=>{
  const newError={};
  if(!formData.email.trim()){
    newError.email="Email is required"
  }
    if(!formData.password.trim()){
    newError.password="Password is required"
  }
      if(!formData.email.includes('@')){
    newError.email="Email is Invalid"
  }
  if (formData.password.length < 6) newError.password = "Password must be at least 6 characters";
  return newError;
}
  const handleSubmit = async(e) => {
    try{
    debugger;
    e.preventDefault();
        const validationErrors = validateFunction();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted Successfully:", formData);
    const response=await loginUser(formData)
    if(response.status==200){
      console.log(response.data)
      localStorage.setItem("token",response.data.token)
      dispatch(storetoken(response.data.token))
      dispatch(storeuserdata(response.data))
      toast.success("Login Successfully")
      setTimeout(()=>{
navigate("/dashboard")
      },2000)
    }
    } else {
        toast.success("Invalid email or password")
      // Add login logic here
      console.log("Logging in with:", formData);
    }}catch(error){
      console.log(error.response.data.message)
          toast.error(`${error.response.data.message}`)
    }
  };

  const handleValueChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center" style={{backgroundColor:"darkgray"}}>
      <Row>
        <Col>
          <Card style={{ minWidth: "350px", maxWidth: "400px" }} className="p-4 shadow-sm rounded">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
             
              <Form >
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleValueChange("email", e.target.value)}
                />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => handleValueChange("password", e.target.value)}
                />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                <CustumButton type="submit" name="Login" onClick={handleSubmit}/>
              </Form>
              {/* <div className="mt-3 text-center">
                <a href="#forgot-password" style={{ fontSize: "0.9rem" }}>
                  Forgot password?
                </a>
              </div> */}
              {/* <div className="mt-3 text-center" style={{ fontSize: "0.9rem" }}>
                Don't have an account? <a href="#signup">Sign Up</a>
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
   
  );
};

export default Login;
