import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Button, Card, Form, Pagination } from 'react-bootstrap';
import { blockedunblocked, resetpasswordadmin, viewalladmindata } from '../../services/allService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ResetPassword from './ResetPassword';

const ViewAllAdmin = () => {
  const navigate = useNavigate();
const [confirmModal,setConfirmModal]=useState(false)
  const [allAdmins, setAllAdmins] = useState([]);
  const [resetpasswordmodal, setresetpasswordmodal] = useState(false);
  const [adminID, setadminId] = useState("");
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
      if (response) {
        const filteredAdmins = response.data.admins.map((admin) => ({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          created_At: admin.created_At,
          isBlocked: admin.isBlocked
        }));
        setAllAdmins(filteredAdmins);
        setFilterData(filteredAdmins);
        setSearch("")
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

  const handleadmintoggle = async (adminId, text) => {
    try {
      const payload = {
        action: text
      };
      const response = await blockedunblocked(adminId, payload);
      if (response.status === 200) {
        toast.success(`Account ${text === "block" ? "Blocked" : "Unblocked"} Successfully`);
        fetchAllAdminUsers();
      }
    } catch (error) {
      toast.error('Error toggling admin status');
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filterData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filterData.length / rowsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleresetmodal = (adminId) => {
        setSearch("")
    setresetpasswordmodal(true);
    setadminId(adminId);
      
  };

  const handleconfirm = async (data) => {
        setSearch("")
    try {
      const response = await resetpasswordadmin(data);
      if (response.status === 200) {
        toast.success("Password Reset Successfully");
        setresetpasswordmodal(false);
        setSearch("")
        fetchAllAdminUsers();
      }
    } catch (error) {
      toast.error('Error resetting password');
    }
  };

  const handleClose = () => {setresetpasswordmodal(false)  
    setSearch("")};
  const handleConfirmClose = () => {
    setConfirmModal(false)
  };
  const handleConfirmopen=()=>{
        setConfirmModal(true)
  }

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
            autocomplete="off"
          />

          {/* Add User Button */}
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>{new Date(admin.created_At).toLocaleString()}</td>
                      <td>
                        <div className='d-flex' style={{gap:"8px"}}>
                        {admin.isBlocked === false ? (
                          <Button variant="outline-primary" size="sm" onClick={() => handleadmintoggle(admin._id, "block")}>
                            Block
                          </Button>
                        ) : (
                          <Button variant="outline-primary" size="sm" onClick={() => handleadmintoggle(admin._id, "unblock")}>
                            Unblock
                          </Button>
                        )}
                        <Button variant="outline-primary" size="sm" onClick={() => handleresetmodal(admin._id)}>
                          Reset Password
                        </Button>
                        </div>
                      </td>
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

          {filterData.length === 0 && !loading && <Alert variant="info">No admin users found.</Alert>}
        </Card.Body>
      </Card>

      <ResetPassword
        resetpasswordmodal={resetpasswordmodal}
        handleClose={handleClose}
        handleconfirm={handleconfirm}
        adminID={adminID}
      />
    </Container>
  );
};

export default ViewAllAdmin;
