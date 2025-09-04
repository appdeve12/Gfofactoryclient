import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Container,
  Pagination,
  Card,
  Form
} from 'react-bootstrap';
import { deleteparticularstockinward, getallstockinwards, getMaterialsForSupervisor, makeeditrequies, markasdone, supervisiorappredrequest } from '../../services/allService';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { storeparticularstockin } from '../../redux/stockInwardSlice';
const StockInward = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const userDt = useSelector(state => state.auth.userdata);
  const userRole = userDt?.user?.role;

  const [stockInwardData, setStockInwardData] = useState([]);
  const [selectedmaterial, setselectedmaterial] = useState("")
  const [filterData, setFilterData] = useState([]);
  console.log("filterData",filterData)
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState('');


  const fetchStockInwardData = async () => {
    try {
      let response;
      if (userRole === 'supervisior') {
        response = await getMaterialsForSupervisor();
        if (response.status === 200) {
          setStockInwardData(response.data.materials);
        }
      } else {
        response = await getallstockinwards();
        if (response.status === 200) {
          setStockInwardData(response.data.materials);
        }
      }
      setFilterData(response.data.materials);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStockInwardData();
  }, []);

  // Filter by search + date
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const seletedmaterialtype = selectedmaterial.toLowerCase();
    const filtered = stockInwardData.filter(item => {
      const nameMatch = item?.material_Name?.name.toLowerCase().includes(searchLower) || item.user?.name.toLowerCase().includes(searchLower);

      const typeMatch = item?.material_Name?.type.toLowerCase().includes(seletedmaterialtype);
      const date = new Date(item.created_At);
      const dateMatch =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      return nameMatch && dateMatch && typeMatch ;
    });

    setFilterData(filtered);
    setCurrentPage(1);
  }, [search, startDate, endDate, stockInwardData, selectedmaterial]);

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
    navigate("/dashboard/add-stock-inward");
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-stock-inward/${id}`);
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
  const handedropchnage = (e) => {
    const selected = e.target.value;
    console.log("selected", selected);
    setselectedmaterial(selected)
  }
  const makearequest = async (item) => {
    console.log(item);
    try {
      const response = await makeeditrequies(item);
      if (response.status == 200) {
        toast.success("Request Edit Marked Successfully")
        fetchStockInwardData();
      }

    } catch (error) {

    }

  }
  const markdone = async (item) => {
    debugger;
    console.log(item);
    try {
      const response = await markasdone(item);
      if (response.status == 200) {
        toast.success("Mark Done Successfully");
        fetchStockInwardData();
      }
    } catch (error) {

    }
  }
  const supervisioreditrequest = async (item) => {
    console.log(item);
    try {
      const response = await supervisiorappredrequest(item);
      if (response.status == 200) {
        toast.success("Request approved successfully");
        fetchStockInwardData();
      }
    } catch (error) {

    }
  }
  const clickonparticlurrow=(item)=>{
    console.log("item",item)
    dispatch(storeparticularstockin(item))
   navigate(`/dashboard/stock-inward-details/${item._id}`);
  }
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4 className="mb-0">Material Stock In</h4>
          <Button variant="outline-primary" size="sm" onClick={handleAddStock}>
            Add Stock
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Search and Filter Controls */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">

            <Form.Control
              type="text"
              placeholder="Search material and user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <Form.Select aria-label="Default select example " onChange={(e) => handedropchnage(e)} style={{ maxWidth: '300px' }} >
              <option>Select The Type</option>
              <option value="raw material">Raw Material</option>
              <option value="ready material">Ready Material</option>

            </Form.Select>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No records found.</td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                <tr key={index} onClick={() => clickonparticlurrow(item)}>
  <td>{indexOfFirstRow + index + 1}</td>
  <td>{item?.material_Name?.name || ""}</td>
  <td>{item?.purchase_quantity || 'N/A'}</td>
  <td>{formatDate(item?.purchase_date) || 'N/A'}</td>
  <td>{item?.supplier || 'N/A'}</td>
  <td>{item?.remarks || 'N/A'}</td>
  <td>{item.user?.name || 'N/A'}</td>

  {/* ✅ ACTIONS COLUMN */}
  <td>
    {userRole === 'supervisior' ? (
      <>
        {(item.status === "request-pending" || item.status === "edit-approved") && (
          <>
            {item.status === "edit-approved" && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={(e) =>{e.stopPropagation(); handleEdit(item._id)}}
                className="me-2"
              >
                Edit
              </Button>
            )}

            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) =>{e.stopPropagation(); supervisioreditrequest(item._id)}}
              className="me-2"
              disabled={item.status=="edit-approved"}
            >
                 {item.status === "edit-approved" ? "Approved Request" : "Mark To Approve"}

            </Button>
          </>
        )}

     {(item?.createdByRole=='supervisior') &&     <Button
                variant="outline-primary"
                size="sm"
                onClick={(e) =>{e.stopPropagation(); handleEdit(item._id)}}
                className="me-2"
              >
                Edit
              </Button>
              }

     
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {e.stopPropagation(); handleDeleteClick(item._id);}}
          >
            Delete
          </Button>
           {item.status === "done" || item.status === "final-done" ? null : (
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) =>{e.stopPropagation(); markdone(item._id)}}
               disabled={item.status === "request-pending"}
          >
            Mark Done
          </Button>
        )}
      
      </>
    ) : (
      <>
        {item.status === "done" || item.status === "final-done" ? null : (
          item.status === "edit-approved" ? (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) =>{e.stopPropagation(); handleEdit(item._id)}}
              className="me-2"
            >
              Edit
            </Button>
          ) : (
            <Button
              variant="outline-warning"
              size="sm"
              onClick={(e) =>{e.stopPropagation(); makearequest(item._id)}}
              className="me-2"
                disabled={item.status === "request-pending"}
            >
              {item.status === "request-pending" ? "Request pending" : "Edit Request"}
            </Button>
          )
        )}

        {item.status === "done" || item.status === "final-done" ? null : (
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) =>{e.stopPropagation(); markdone(item._id)}}
               disabled={item.status === "request-pending"}
          >
            Mark Done
          </Button>
        )}
      </>
    )}
  </td>
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
