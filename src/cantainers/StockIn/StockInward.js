import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Container,
  Pagination,
  Card,
  Form
} from 'react-bootstrap';
import { deleteparticularstockinward, getallstockinwards } from '../../services/allService';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StockInward = () => {
  const navigate = useNavigate();
  const userDt = useSelector(state => state.auth.userdata);
  const userRole = userDt?.user?.role;

  const [stockInwardData, setStockInwardData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState('');

  // Fetch all stock inward data
  const fetchStockInwardData = async () => {
    try {
      const response = await getallstockinwards();
      if (response.status === 200) {
        const data = response.data.materials;
        setStockInwardData(data);
        setFilterData(data);
      }
    } catch (error) {
      console.error('Error fetching stock inward data:', error);
    }
  };

  useEffect(() => {
    fetchStockInwardData();
  }, []);

  // Filter by search + date
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = stockInwardData.filter(item => {
      const nameMatch = item.material_Name.toLowerCase().includes(searchLower);
      const date = new Date(item.created_At);
      const dateMatch =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      return nameMatch && dateMatch;
    });

    setFilterData(filtered);
    setCurrentPage(1);
  }, [search, startDate, endDate, stockInwardData]);

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
    navigate("/add-stock-inward");
  };

  const handleEdit = (id) => {
    navigate(`/edit-stock-inward/${id}`);
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
        const response = await deleteparticularstockinward(selectedDeleteId);
        if (response.status === 200) {
          toast.success("Deleted successfully");
          fetchStockInwardData();
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
          <h4 className="mb-0">Material Stock Inward</h4>
          <Button variant="outline-primary" size="sm" onClick={handleAddStock}>
            Add Stock
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

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="form-control"
              maxDate={new Date()}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="form-control"
              maxDate={new Date()}
            />

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setStartDate(null);
                setEndDate(null);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Table */}
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Purchase Quantity</th>
                <th>Purchase Date</th>
                <th>Supplier</th>
                <th>Remarks</th>
                <th>User</th>
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
                    <td>{item.material_Name}</td>
                    <td>{item.purchase_quantity}</td>
                    <td>{formatDate(item.purchase_date)}</td>
                    <td>{item.supplier || 'N/A'}</td>
                    <td>{item.remarks || 'N/A'}</td>
                    <td>{item.user?.name || 'N/A'}</td>
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
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          Delete
                        </Button>
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

export default StockInward;
