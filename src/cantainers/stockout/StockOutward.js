import React, { useEffect, useState } from 'react';
import { deleteparticularstockinward, deleteparticularstockoutward, getallstockoutwards, getallstockoutwardsadmin, markappovededitrequest, markEDITREQUEST, markStockOutwardAsDone } from '../../services/allService';
import {
  Table,
  Button,
  Container,
  Pagination,
  Card,
  Form
} from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '../../services/apiRoutes';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteModal from './DeleteStockOutward';
const StockOutward = () => {
  const userDt = useSelector(state => state.auth.userdata);
  const userRole = userDt?.user?.role;
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
const [popupItem, setPopupItem] = useState(null);
const [popupShown, setPopupShown] = useState(false); 
  const [stockoutsData, setStockoutsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedmaterial, setselectedmaterial] = useState("");
  const [selectedstatus, setselectedstatus] = useState("")
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState('');
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
useEffect(() => {

  if (stockoutsData.length > 0) {
    const latestItem = stockoutsData[stockoutsData.length - 1];
    console.log("latestItem",latestItem)

    // Agar status pending hai aur pehle se popup show nahi hua
    if (latestItem.status === "pending" && !localStorage.getItem("popup")) {
      console.log("true")
      setPopupItem(latestItem);
      setShowPopup(true);
      setPopupShown(true);

      // localStorage me flag set
      localStorage.setItem("popup", "true");
    }
  }
}, [stockoutsData]);







  const fetchStockOutward = async () => {
    try {
      let response;
      if (userRole === 'supervisior') {
        response = await getallstockoutwards();
        if (response.status === 200) {
          setStockoutsData(response.data.stockOutwardEntries);
          setFilteredData(response.data.stockOutwardEntries);
        }
      } else {
        response = await getallstockoutwardsadmin();
        if (response.status === 200) {
          setStockoutsData(response.data.stockOutwardEntries);
          setFilteredData(response.data.stockOutwardEntries);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // Initial fetch
  useEffect(() => {
    fetchStockOutward();
  }, []);
  useEffect(() => {
    fetchStockOutward();


    const interval = setInterval(() => {
      fetchStockOutward();
    }, 5000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    const lowercased = search.toLowerCase();

    const filtered = stockoutsData.filter((item) => {
      const seletedmaterialtype = selectedmaterial.toLowerCase();
      const seletedstatustype = selectedstatus.toLowerCase();
      const nameMatch = item?.material_Name?.name.toLowerCase().includes(lowercased) || item.user?.name.toLowerCase().includes(lowercased);
      const nameStatus = item?.status.toLowerCase().includes(seletedstatustype);
      const typeMatch = item?.material_Name?.type.toLowerCase().includes(seletedmaterialtype);
      const date = new Date(item.date);
      const dateMatch =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);

      return nameMatch && dateMatch && typeMatch && nameStatus;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, startDate, endDate, stockoutsData, selectedmaterial, selectedstatus]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddStockOutward = () => {
    navigate('/dashboard/add-stock-outward');
  };
  const handedropchnage = (e) => {
    const selected = e.target.value;
    console.log("selected", selected);
    setselectedmaterial(selected)
  }
  const handedropstatuschnage = (e) => {
    const selected = e.target.value;
    console.log("selected", selected);
    setselectedstatus(selected)
  }
  const handleEditRequest = async (id) => {
    try {


      const response = await markEDITREQUEST(id)

      if (response.status === 200) {
        toast.success("Edit request sent successfully!");
        fetchStockOutward();
      }
    } catch (error) {
      console.error("Edit request error:", error);
      toast.error("Failed to send edit request.");
    }
  };
  const handleMarkAsDone = async (id) => {
    try {

      const res = await markStockOutwardAsDone(id);

      if (res.status === 200) {
        toast.success("Marked as done!");
        fetchStockOutward();
      }
    } catch (error) {
      console.error("Error marking as done:", error);
      toast.error("Failed to mark as done.");
    }
  };
  const handleApproveEditRequest = async (id) => {
    try {

      const res = await markappovededitrequest(id);

      if (res.status === 200) {
        toast.success("Marked as done!");
        fetchStockOutward();
      }
    } catch (error) {
      console.error("Error marking as done:", error);
      toast.error("Failed to mark as done.");
    }
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
          const response = await deleteparticularstockoutward(selectedDeleteId);
          if (response.status === 200) {
            toast.success("Deleted successfully");
            fetchStockOutward();
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
          <h4 className="mb-0">Material Stock Outward</h4>
          <Button variant="outline-primary" size="sm" onClick={handleAddStockOutward}>
            Add Stock Outward
          </Button>
        </Card.Header>

        <Card.Body>

          <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
            <Form.Control
              type="text"
              placeholder="Search material and user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
            <Form.Select aria-label="Default select example " style={{ maxWidth: '300px' }} onChange={(e) => handedropchnage(e)} >
              <option>Select The Type</option>
              <option value="raw material">Raw Material</option>
              <option value="ready material">Ready Material</option>

            </Form.Select>
            <Form.Select aria-label="Default select example " style={{ maxWidth: '300px' }} onChange={(e) => handedropstatuschnage(e)} >
              <option>Select The Status Type</option>
              <option value="done">Done</option>
              <option value="pending">Pending</option>

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


          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Quantity Used</th>
                <th>Date</th>
                <th>Purpose</th>
                <th>Invoice</th>
                <th>User</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstRow + index + 1}</td>
                    <td>{item?.material_Name?.name || "N/A"}</td>
                    <td>{item?.quantity_used || "N/A"}{item?.quantity_unit || "N/A"}</td>
                    <td>{formatDate(item.date) || "N/A"}</td>
                    <td>{item?.purpose || 'N/A'}</td>
                    <td>
                      {item?.file?.type?.startsWith('image/') ? (
                        // Show small clickable image preview
                        <a href={`${BASE_URL}${item.file.url}`} target="_blank" rel="noreferrer">
                          <img
                            src={`${BASE_URL}${item.file.url}`}
                            alt="preview"
                            style={{ width: '50px', height: 'auto', cursor: 'pointer' }}
                          />
                        </a>
                      ) : item?.file?.type === 'application/pdf' ? (
                        // Show clickable PDF link
                        <a href={`${BASE_URL}${item.file.url}`} target="_blank" rel="noreferrer">
                          📄 View PDF
                        </a>
                      ) : (
                        // If no file or unknown type
                        'N/A'
                      )}
                    </td>

                    <td>{item.user?.name || 'N/A'}</td>
                    <td>{item.status || 'N/A'}</td>
                    <td>


                      {userRole === 'admin' && item.status === 'pending' && (
                        <>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => navigate(`/dashboard/edit-stock-outward/${item._id}`)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleMarkAsDone(item._id)}
                          >
                            Done
                          </Button>
                        </>
                      )}
                      {userRole === 'supervisior' && item.status === 'pending' && (
                        <>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => navigate(`/dashboard/edit-stock-outward/${item._id}`)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleMarkAsDone(item._id)}
                          >
                            Done
                          </Button>

                       
                        </>
                      )}
                      {userRole === 'admin' && item.status === 'done' && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEditRequest(item._id)}
                        >
                          Request Edit
                        </Button>
                      )}
                      {userRole === 'supervisior' && item.status === 'pending-approved' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveEditRequest(item._id)}
                        >
                          Approve Edit Request
                        </Button>
                      )}
                               {userRole === 'supervisior' &&<Button
                               style={{marginLeft:"3px"}}
                            variant="success"
                            size="sm"
                            onClick={() => handleDeleteClick(item._id)}
                          >
                            Delete
                          </Button>}
                    </td>


                  </tr>
                ))
              )}
            </tbody>
          </Table>
      {deleteModalOpen && (
        <DeleteModal
          show={deleteModalOpen}
          handleClose={handleCloseModal}
          handleConfirm={handleConfirmDelete}
        />
      )}
          {/* Pagination */}
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
<Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Info</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    This material <b>{popupItem?.material_Name?.name}</b> will be
    automatically marked as <b>done</b> by the system after 10 minutes of creation.
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

export default StockOutward;
