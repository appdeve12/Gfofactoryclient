import React, { useEffect, useState } from 'react';
import { viewalladmindata, updateAdminPermissions } from '../../services/allService';
import { Form, Card, Row, Col, Button } from 'react-bootstrap';

const modules = {
  "Material": ["canAddMaterial", "canEditMaterial", "canDeleteMaterial", "canViewMaterial"],
  "Stock Inward": ["canAddStockIn", "canViewStockInData", "canEditStockInData", "canDeleteStockInData"],
  "Stock Outward": ["canAddStockOut", "canViewStockOut"],
  "Auto Stock": ["canViewAutoStock"]
};

const Permissions = () => {
  const [adminData, setAdminData] = useState([]);
  const [filterdadmin, setfilteradmin] = useState([]);
  const [selectedAdminPermissions, setselectedAdminPermissions] = useState({});
  const [seletedadmin, setseletedadmin] = useState(null);

  // Fetch all admin data
  const fetchalladmindata = async () => {
    try {
      const response = await viewalladmindata();
      if (response.status === 200) {
        const filter = response.data.admins.filter(item => item.isBlocked === false);
        setfilteradmin(filter);
        const updated = filter.map(item => ({
          label: item.name,
          value: item._id
        }));
        setAdminData(updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchalladmindata();
  }, []);

  // Handle dropdown change
  const handedropchnage = (e) => {
    const seleted = e.target.value;
    const findadmin = filterdadmin.find(item => item._id === seleted);
    setseletedadmin(seleted);
    setselectedAdminPermissions(findadmin.permissions);
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (perm) => {
    setselectedAdminPermissions(prev => ({
      ...prev,
      [perm]: !prev[perm]
    }));
  };

  // Save updated permissions
  const handleSave = async () => {
    if (!seletedadmin) return alert("Select an admin first!");
    try {
      const payload={
        adminId:seletedadmin,
        permissions:selectedAdminPermissions
      }
      const response = await updateAdminPermissions(payload);
      if (response.status === 200) {
        alert("Permissions updated successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update permissions");
    }
  };

  return (
    <div className="container mt-4 overflows">
      <h3 className="mb-4">Manage Admin Permissions</h3>

      {/* Admin Dropdown */}
      <Form.Select
        aria-label="Select Admin"
        style={{ maxWidth: '400px' }}
        onChange={handedropchnage}
      >
        <option value="">Select Admin</option>
        {adminData.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Form.Select>

      {/* Permission Cards */}
      {seletedadmin && (
        <div className="mt-4">
          {Object.keys(modules).map((module) => (
            <Card key={module} className="mb-3 shadow-sm">
              <Card.Header as="h5">{module}</Card.Header>
              <Card.Body>
                <Row>
                  {modules[module].map((perm) => (
                    <Col md={3} key={perm} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={perm}
                        checked={selectedAdminPermissions[perm] || false}
                        onChange={() => handleCheckboxChange(perm)}
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ))}

          <Button variant="primary" onClick={handleSave}>Save Permissions</Button>
        </div>
      )}
    </div>
  );
};

export default Permissions;
