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

  const [error, setError] = useState("");

  const handleSubmit = async(e) => {
    try{
    debugger;
    e.preventDefault();
    if (formData.email && formData.password) {
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
          toast.error("Invalid email or password")
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
              {error && <Alert variant="danger">{error}</Alert>}
              <Form >
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleValueChange("email", e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => handleValueChange("password", e.target.value)}
                />
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
