import React, { useEffect, useState } from 'react';
import { Form, Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Input from '../../components/common/Input';

const ResetPassword = ({ handleClose, resetpasswordmodal, handleconfirm, adminID }) => {
  const [formData, setFormData] = useState({
    adminId: "",
    newPassword: ""
  });

  const handleValueChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      "adminId": adminID
    }));
  }, [adminID]);

  const handlesubmit = () => {
    handleconfirm(formData);
  };

  return (
    <Modal show={resetpasswordmodal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Input
              label="Enter New Password"
              type="text"
              placeholder="Enter New Password"
              value={formData.newPassword}
              onChange={(e) => handleValueChange("newPassword", e.target.value)}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlesubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResetPassword;
