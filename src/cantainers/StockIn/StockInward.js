import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Container,
  Pagination,
  Card,
  Form,
  Modal
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
const [showPopup, setShowPopup] = useState(false);
const [popupItem, setPopupItem] = useState(null);
const [popupShown, setPopupShown] = useState(false); // ✅ सिर्फ एक बार show करने के लिए flag

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
  useEffect(() => {
    fetchStockInwardData(); // initial fetch

    // Polling every 5 seconds
    const interval = setInterval(() => {
      fetchStockInwardData();
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  // Filter by search + date
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const seletedmaterialtype = selectedmaterial.toLowerCase();
    const filtered = stockInwardData.filter(item => {
      const nameMatch = item?.material_Name?.name.toLowerCase().includes(searchLower);
      const typeMatch = item?.material_Name?.type.toLowerCase().includes(seletedmaterialtype);
      const date = new Date(item.created_At);
      const dateMatch =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      return nameMatch && dateMatch && typeMatch;
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
useEffect(() => {
  if (stockInwardData.length > 0) {
    const latestItem = stockInwardData[stockInwardData.length - 1];

    // Agar status "draft" hai aur abhi tak popup show nahi hua
    if (
      latestItem.status === "draft" &&
      !localStorage.getItem(`popupShown_${latestItem._id}`)
    ) {
      setPopupItem(latestItem);
      setShowPopup(true);
      setPopupShown(true);

      // localStorage me flag set
      localStorage.setItem(`popupShown_${latestItem._id}`, "true");
    }
  }
}, [stockInwardData]);

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
                     <th>Cost</th>
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
  <td>{item?.purchase_quantity || 'N/A'}{item?.purchase_unit || 'N/A'}</td>
    <td>{item?.cost || 'N/A'}{item?.cost_unit || 'N/A'}</td>
  <td>{formatDate(item?.purchase_date) || 'N/A'}</td>
  <td>{item?.supplier || 'N/A'}</td>
  <td>{item?.remarks || 'N/A'}</td>
  <td>{item.user?.name || 'N/A'}</td>

  {/* ✅ ACTIONS COLUMN */}
{/* ✅ ACTIONS COLUMN */}
<td>
  {userRole === "supervisior" ? (
    <>
      {/* Supervisor handles requests and can edit their own */}
      {(item.status === "request-pending" || item.status === "edit-approved") && (
        <>
          {item.status === "edit-approved" && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item._id);
              }}
              className="me-2"
            >
              Edit
            </Button>
          )}

          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              supervisioreditrequest(item._id);
            }}
            className="me-2"
            disabled={item.status === "edit-approved"}
          >
            {item.status === "edit-approved" ? "Approved Request" : "Mark To Approve"}
          </Button>
        </>
      )}

      {/* Can edit if created by supervisor */}
      {item.createdByRole === "supervisior" && (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(item._id);
          }}
          className="me-2"
        >
          Edit
        </Button>
      )}

      {/* Can always delete */}
      <Button
        variant="outline-danger"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(item._id);
        }}
      >
        Delete
      </Button>

      {/* Can mark done if not already */}
      {(item.status !== "done" && item.status !== "final-done") && (
        <Button
          variant="outline-success"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            markdone(item._id);
          }}
          disabled={item.status === "request-pending"}
        >
          Mark Done
        </Button>
      )}
    </>
  ) : (
    <>
      {/* USER ROLE = ADMIN */}

      {/* Status: draft */}
      {item.status === "draft" && (
        <>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item._id);
            }}
            className="me-2"
          >
            Edit
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              markdone(item._id);
            }}
          >
            Mark Done
          </Button>
        </>
      )}

      {/* Status: done (show edit request) */}
      {item.status === "done" && item.createdByRole === "admin" && (
        <Button
          variant="outline-warning"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            makearequest(item._id);
          }}
          className="me-2"
        >
          Edit Request
        </Button>
      )}

      {/* Status: request-pending (disable edit request button) */}
      {item.status === "request-pending" && item.createdByRole === "admin" && (
        <Button
          variant="outline-warning"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            makearequest(item._id);
          }}
          className="me-2"
          disabled
        >
          Request Pending
        </Button>
      )}

      {/* Status: edit-approved */}
      {item.status === "edit-approved" && (
        <>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item._id);
            }}
            className="me-2"
          >
            Edit
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              markdone(item._id);
            }}
          >
            Mark Done
          </Button>
        </>
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
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Time Alert</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    You only have 10 minutes to edit this material: <b>{popupItem?.material_Name?.name}</b>.  
    After that, it will automatically be marked as done.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowPopup(false)}>
      Close
    </Button>
  
  </Modal.Footer>
</Modal>

    </Container>
  );
};

export default StockInward;
