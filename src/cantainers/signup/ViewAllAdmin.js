import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert ,Button,Card} from 'react-bootstrap';
import { viewalladmindata } from '../../services/allService';
import { useNavigate } from 'react-router-dom';

const ViewAllAdmin = () => {
    const navigate=useNavigate()
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllAdminUsers = async () => {
    try {
      const response = await viewalladmindata();
      if (response.status === 200) {
        const filteredAdmins = response.data.fetchalladmindata.map(admin => ({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          created_At: admin.created_At,
        }));
        setAllAdmins(filteredAdmins);
      } else {
        setError('Failed to fetch admin data.');
      }
    } catch (err) {
      setError('Error fetching admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminUsers();
  }, []);
  const adduser=()=>{
navigate("/register-user")
  }

  return (
    <Container className="mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">All User</h4>
          <Button variant="outline-primary" size="sm" onClick={()=>adduser()}>Add USER</Button>
        </Card.Header>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && allAdmins.length > 0 && (
        <Table  bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {allAdmins.map(admin => (
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>{new Date(admin.created_At).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && allAdmins.length === 0 && (
        <Alert variant="info">No admin users found.</Alert>
      )}
    </Container>
  );
};

export default ViewAllAdmin;
