import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Container,
  Pagination,
  Card,
  Form
} from 'react-bootstrap';
import { deleteparticularMaterialData, getallMaterialName,} from '../../services/allService';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DeleteModal from '../StockIn/DeleteModal';
import { storeallmaterial } from '../../redux/materilslice';
import { useDispatch } from 'react-redux';
const Addmaterial = () => {
    const dispatch=useDispatch()
  const navigate = useNavigate();
  const userDt = useSelector(state => state.auth.userdata);
  const userRole = userDt?.user?.role;

  const [materialData, setmaterialData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState('');

  // Fetch all stock inward data
  const fetchmaterialData = async () => {
    try {
      const response = await getallMaterialName();
      if (response.status === 200) {
        const data = response.data || [];
        setmaterialData(data);
        setFilterData(data);
        dispatch(storeallmaterial(data))

      }
    } catch (error) {
      console.error('Error fetching stock inward data:', error);
    }
  };

  useEffect(() => {
    fetchmaterialData();
  }, []);

  // Filter by search + date
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = materialData.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchLower);
   
      return nameMatch;
    });

    setFilterData(filtered);
    setCurrentPage(1);
  }, [search, materialData]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filterData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filterData.length / rowsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Helpers
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddStock = () => {
    navigate("/dashboard/add-material-name");
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-material-name/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setSelectedDeleteId('');
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedDeleteId) {
        const response = await deleteparticularMaterialData(selectedDeleteId);
        if (response.status === 200) {
          toast.success("Deleted successfully");
          fetchmaterialData();
        }
      }
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="mb-0">Material Data</h4>
          <Button variant="outline-primary" size="sm" onClick={handleAddStock}>
            Add Material
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Search and Filter Controls */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <Form.Control
              type="text"
              placeholder="Search material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '200px' }}
            />

          

       
          </div>

          {/* Table */}
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Description</th>
                
                {userRole === 'supervisior' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No records found.</td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                   
                    {userRole === 'supervisior' && (
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(item._id)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        {/* <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          Delete
                        </Button> */}
                      </td>
                    )}
                  </tr>
                ))
              )}
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
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          handleClose={handleCloseModal}
          handleConfirm={handleConfirmDelete}
        />
      )}
    </Container>
  );
};

export default Addmaterial;


