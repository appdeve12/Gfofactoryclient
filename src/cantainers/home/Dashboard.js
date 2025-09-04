import React, { useEffect, useState } from 'react';
import { checkmaterial, dashboardstats, getallMaterialName, updateLimit } from '../../services/allService';
import {
  Table,
  Container,
  Pagination,
  Card,
  Form,
  Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { storeallmaterial } from '../../redux/materilslice';
import DashboardData from './DashboardData';
import { ExportToExcel } from './ExportToExcel';
import LimitModal from './LimitModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const navigate = useNavigate();

  const handleOrderToPlace = (material) => {
    // Navigate to new page with material id
    navigate(`/dashboard/place-order/${material.material_id}`);
  };

    const userDt = useSelector(state => state.auth.userdata);
    console.log("userDt",userDt)
  const fileName = "stockoutwad"; // here enter filename for your excel file
  const dispatch=useDispatch()
const [placedMaterialIds, setPlacedMaterialIds] = useState([]);


  const [search, setSearch] = useState('');
  const [openModel,setopenModel]=useState(false);
    const [isLimitExceed,setisLimitExceed]=useState(false);
    console.log("isLimitExceed",isLimitExceed)
  const [selectedmaterial,setselectedmaterial]=useState("");
  const [seletedmaterialId,setseletedmaterialId]=useState(null)
  const [limitdata,setlimitdata]=useState(null)
  const [data, setData] = useState([]);             // All data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
    const [exceldata, setexceldata] = useState([]);   
  console.log(filteredData)

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch data from API
  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardstats();
      console.log(response,"response")
      if (response.status === 200) {
        console.log("true")
        const formattedData = response.data.data.map((item) => ({
          material_Name: item.material_name,
          total_stock_in: item.total_stock_in,
          total_stock_out: item.total_stock_out,
          current_stock: item.current_stock,
          type:item.type,
          limit:item.limit,
          ...item
        }));
         const customHeadings =response.data.data.map((item) => ({
       "Material Name":item.material_name,
       "Total Stock In": item.total_stock_in,
           "Total Stock Out":  item.total_stock_out,
             "Current Stock":  item.current_stock, 
             "type":item.type,
             "limit":item.limit
     }))
         // ✅ Check if any stock is below limit
      const isExceed = formattedData.some(item => item.current_stock >= item.limit);
      setisLimitExceed(isExceed); 
setexceldata(customHeadings)
        setData(formattedData);
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const fetchmaterialData = async () => {
    try {
      const response = await getallMaterialName();
      if (response.status === 200) {
        const data = response.data || [];
dispatch(storeallmaterial(data))
      }
    } catch (error) {
      console.error('Error fetching stock inward data:', error);
    }
  };

  useEffect(() => {
    fetchmaterialData();
  }, []);
  // Filter by search
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const selectedmaterialdata=selectedmaterial.toLowerCase();
    const result = data.filter(item =>{
        const nameMatch =  item.material_Name.toLowerCase().includes(lowerSearch)
         const typeMatch = item?.type.toLowerCase().includes(selectedmaterialdata);
         return nameMatch  && typeMatch;
    })
 
    setFilteredData(result);
    setCurrentPage(1); // Reset page
  }, [search, data,selectedmaterial]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
const handedropchnage=(e)=>{
  const selectedmaterial=e.target.value;
  setselectedmaterial(selectedmaterial)
}
const addoreditmodelopen=(limit)=>{
  console.log("open",limit)
  setseletedmaterialId(limit.material_id)
  setlimitdata(limit.limit)
setopenModel(true)
}
const handleclosemodel=()=>{
  setopenModel(false)
}
const handleConfirm=async(data)=>{
  console.log(data);
  const updateLimits=await updateLimit(seletedmaterialId,data)
  if(updateLimits.status==200){
    toast.success("Limit Update Successfully");
      setopenModel(false)
        fetchmaterialData();
        fetchDashboardStats()
  }
  try{

  }catch(error){

  }
}

const fetchcheckorderplaced = async () => {
  try {
    const response = await checkmaterial(); // your API call

    if (response?.data?.success) {
      // Extract unique material IDs that have any orders
      const materialIds = [
        ...new Set(response.data.data.map((order) => order.material))
      ];
      setPlacedMaterialIds(materialIds);
    }
  } catch (error) {
    console.error("Error checking placed orders:", error);
  }
};

useEffect(() => {
  fetchcheckorderplaced();
}, []);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Auto Stock Calculator</h4>
        </Card.Header>

        <Card.Body>
          <div className='d-flex' style={{justifyContent:"space-between"}}>    
            <div>
            <Form.Control
          style={{width:"40vw"}}
            type="text"
            placeholder="Search material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          </div>
          <div>
             <Form.Select aria-label="Default select example " onChange={(e) => handedropchnage(e)} style={{ maxWidth: '300px' }} >
                        <option>Select The Type</option>
                        <option value="raw material">Raw Material</option>
                        <option value="ready material">Ready Material</option>
          
                      </Form.Select></div>
          <div>
         <ExportToExcel apiData={exceldata} fileName={fileName} />
         </div>
         </div>
      
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Material Name</th>
                <th>Total Stock In</th>
                <th>Total Stock Out</th>
                <th>Current Stock</th>
                <th>Limit</th>
        {userDt.user.role=="supervisior" &&  <th>Action</th>} 
               {userDt.user.role=="supervisior" ?  <th>Placed Order</th>:<th>Placed Order</th>} 
                
              </tr>
            </thead>
<tbody>
  {currentRows.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center">
        No records found.
      </td>
    </tr>
  ) : (
    currentRows.map((item, index) => {
      const isExceed = item.current_stock <= item.limit; // check per row
      return (
     <tr
    key={index}
    className={isExceed ? "stock-exceed" : ""}

  >
    <td>{indexOfFirstRow + index + 1}</td>
    <td>{item.material_Name}</td>
    <td>{item.total_stock_in}</td>
    <td>{item.total_stock_out}</td>
    <td>{item.current_stock}</td>
    <td>{item.limit}</td>
    
    {userDt.user.role === "supervisior" && (
      <td>
        {item.limit ? (
          <Button onClick={() => addoreditmodelopen(item)}>Edit Limit</Button>
        ) : (
          <Button onClick={() => addoreditmodelopen(item)}>Add Limit</Button>
        )}
      </td>
    )}

 <td>
  {isExceed ? (
    <Button variant="warning" onClick={() => handleOrderToPlace(item)}>
      Order to Be Place
    </Button>
  ) : (
    <Button variant="secondary" disabled>
      Stock is Sufficient
    </Button>
  )}
</td>

  </tr>
      );
    })
  )}
</tbody>

          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Card.Body>
      </Card>
      <LimitModal handleClose={handleclosemodel} handleConfirm={handleConfirm} openModel={openModel} limitdata={limitdata}/>
    </Container>
  );
};

export default Dashboard;
