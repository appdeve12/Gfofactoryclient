import React, { useEffect, useState } from 'react';
import {
  Table,
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Form,
  Pagination,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { viewalladmindata } from '../../services/allService';
import { useNavigate } from 'react-router-dom';

const ViewAllAdmin = () => {
  const navigate = useNavigate();

  const [allAdmins, setAllAdmins] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllAdminUsers = async () => {
    try {
      const response = await viewalladmindata();
      if (response.status === 200) {
        const filteredAdmins = response.data.fetchalladmindata.map((admin) => ({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          created_At: admin.created_At,
        }));
        setAllAdmins(filteredAdmins);
        setFilterData(filteredAdmins);
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

  // Filtering logic
  useEffect(() => {
    const lowercasedInput = search.toLowerCase();

    const filtered = allAdmins.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(lowercasedInput);
      const date = new Date(item.created_At);
      const dateMatch =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      return nameMatch && dateMatch;
    });

    setFilterData(filtered);
    setCurrentPage(1);
  }, [search, startDate, endDate, allAdmins]);

  const adduser = () => {
    navigate('/dashboard/register-user');
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filterData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filterData.length / rowsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          {/* Search Input */}
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
            style={{ maxWidth: '200px' }}
          />

          {/* Date Range Picker */}
     

          {/* Clear Filters Button */}


          {/* Add User */}
          <div className="d-flex align-items-center mb-2">
            <h4 className="mb-0 me-3">All Users</h4>
            <Button variant="outline-primary" size="sm" onClick={adduser}>
              Add USER
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && filterData.length > 0 && (
            <>
              <Table bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>{new Date(admin.created_At).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-end">
                  {[...Array(totalPages).keys()].map((num) => (
                    <Pagination.Item
                      key={num + 1}
                      active={num + 1 === currentPage}
                      onClick={() => handlePageChange(num + 1)}
                    >
                      {num + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              )}
            </>
          )}

          {!loading && filterData.length === 0 && (
            <Alert variant="info">No admin users found.</Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewAllAdmin;
  