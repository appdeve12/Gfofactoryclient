import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Pagination, Card } from 'react-bootstrap';
import CustumButton from '../../components/common/CustumButton';
import { deleteparticularstockinward, getallstockinwards } from '../../services/allService';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const StockInward = () => {
    const userDt=useSelector(state=>state.auth.userdata);
    console.log("userDt",userDt.user)
    const userdatarole=userDt.user.role;
  const navigate=useNavigate()
  const [stockInwardData, setStockInwardData] = useState([]);
  const [deletemodal,setdeletemodal]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [seleteddeleetdid,setseleteddeleetdid]=useState("")
  const rowsPerPage = 5;

  const [addStockInward, setAddStockInward] = useState(false);

  const fetchStockInwardData = async () => {
    try {
      const response = await getallstockinwards();
      if (response.status === 200) {
        setStockInwardData(response.data.materials);
      }
    } catch (error) {
      console.error('Error fetching stock inward data:', error);
    }
  };

  useEffect(() => {
    fetchStockInwardData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = stockInwardData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(stockInwardData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
const addstockopen=()=>{
navigate("/add-stock-inward")
}
const editstock=(index)=>{
  navigate(`/edit-stock-inward/${index}`)
}
const deleteModal=(index)=>{
  setseleteddeleetdid(index)
setdeletemodal(true)
}
const handleClose=()=>{
  setdeletemodal(true)
}
const handleConfirm=async()=>{
  debugger;

if(seleteddeleetdid){
  const response=await deleteparticularstockinward(seleteddeleetdid)
  if(response.status==200){
toast.success("Deleted Succefully")
fetchStockInwardData()
  }
}
}
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Material Stock Inward</h4>
          <Button variant="outline-primary" size="sm" onClick={()=>addstockopen()}>Add Stock</Button>
        </Card.Header>

        <Card.Body>
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
              {userdatarole=="supervisior" &&   <th>Action</th>}  
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
                           {userdatarole=="supervisior" &&   <td>
                      {/* Actions like edit/delete can go here */}
                      <Button variant="outline-primary" size="sm"onClick={()=>editstock(item._id)}>Edit</Button>{' '}
                      <Button variant="outline-danger" size="sm"onClick={()=>deleteModal(item._id)}>Delete</Button>
                    </td>}
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
      {deletemodal && <DeleteModal handleClose={handleClose} handleConfirm={handleConfirm} show={deletemodal}></DeleteModal>}
    </Container>
  );
};

export default StockInward;
