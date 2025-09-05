import axiosInstance from './axiosInstance';
import { API_ROUTES } from './apiRoutes';

export const loginUser = (data) => {
  return axiosInstance.post(API_ROUTES.LOGIN, data);
};

export const registerAdmin = (data) => {
  return axiosInstance.post(API_ROUTES.REGISTER, data);
};
export const viewalladmindata = () => {
  return axiosInstance.get(API_ROUTES.VIEW_ALL_ADMINS);
};
export const blockedunblocked=(id,data)=>{
return axiosInstance.post(`${API_ROUTES.BLOCKED_UNBLOCKED_ADMIN}/${id}`,data)
}
export const resetpasswordadmin=(data)=>{
  return axiosInstance.post(API_ROUTES.RESET_PASSWORD,data)
}

export const addstockinward=(data)=>{
  return axiosInstance.post(API_ROUTES.ADD_STOCK_INWARD,data)
};
export const getallstockinwards=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_STOCK_INWARD)
}
export const getMaterialsForSupervisor=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_STOCK_INWARD_FOR_SUPERVISIOR)
}
export const getMaterialDone=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_DONE_MATERIAL)
}

export const getparticulrstockinward=(id)=>{
return axiosInstance.get(`${API_ROUTES.GET_PARTICULAR_STOCK_INWARD}/${id}`)
}
export const editparticulrstockinward=(id,formData)=>{
return axiosInstance.put(`${API_ROUTES.UPDATE_PARTICULR_STOCK_INWARD}/${id}`,formData)
}
export const deleteparticularstockinward=(id)=>{
return axiosInstance.delete(`${API_ROUTES.DELETE_PARTICULAR_STOCK_INWARD}/${id}`)
}

export const addstockoutward=(data)=>{
  return axiosInstance.post(API_ROUTES.CREATE_STOCK_OUTWARD,data)
};
export const getallstockoutwards=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_STOCK_OUTWARD)
}
export const getallstockoutwardsadmin=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_STOCK_OUTWARD_ADMIN)
}
export const getparticulrstockoutward=(id)=>{
  return axiosInstance.get(`${API_ROUTES.GET_PARTICULR_STOCK_OUTWARD}/${id}`)
}
export const updateparticulrstock=(id,data)=>{
  return axiosInstance.put(`${API_ROUTES.UPDATE_PARTICULR_STOCK_OUTWARD}/${id}`,data)
}
export const markStockOutwardAsDone=(id)=>{
  return axiosInstance.patch(`${API_ROUTES.MARK_STOCK_OUTWAD_DONE}/${id}`)
}
export const markEDITREQUEST=(id)=>{
  return axiosInstance.patch(`${API_ROUTES.MARK_EDIT_STOCK_OUTWARD_REQUEST}/${id}`)
}
export const markappovededitrequest=(id)=>{
  return axiosInstance.patch(`${API_ROUTES.MART_APPROVED_STOCK_OUTWARD_REQUEST}/${id}`)
}
export const dashboardstats=()=>{
  return axiosInstance.get(API_ROUTES.DASHBOARD_STATS)
}
export const updateLimit=(id,data)=>{
  return axiosInstance.patch(`${API_ROUTES.UPDATE_MATERIAL_LIMIT}${id}/limit`,data)
}

export const addMaterialName=(data)=>{
  return axiosInstance.post(API_ROUTES.ADD_MATERIALDATA,data)
};
export const getallMaterialName=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_MATERIALDATA)
}
export const getparticulrMaterialdata=(id)=>{
return axiosInstance.get(`${API_ROUTES.GET_PARTICULAR_MATERIALDATA}/${id}`)
}
export const editParicularMaterialData=(id,formData)=>{
return axiosInstance.put(`${API_ROUTES.UPDATE_PARTICULR_MATERIALDATA}/${id}`,formData)
}
export const deleteparticularMaterialData=(id)=>{
return axiosInstance.delete(`${API_ROUTES.DELETE_PARTICULAR_MATERIALDATA}/${id}`)
}
export const updateAdminPermissions=(data)=>{
  return axiosInstance.put(API_ROUTES.MANAGE_PERMISISON,data)
}
export const markasdone=(id)=>{
    return axiosInstance.put(`${API_ROUTES.MARK_AS_DONE}/${id}`)
}
export const makeeditrequies=(id)=>{
    return axiosInstance.put(`${API_ROUTES.MAKE_EDIT_REQUEST}/${id}`)
}
export const supervisiorappredrequest=(id)=>{
    return axiosInstance.put(`${API_ROUTES.SUPERVISIOR_EDIT_REQUEST}/${id}`)
}
export const finalDone=(id)=>{
    return axiosInstance.put(`${API_ROUTES.SUPERVISIOR_FINAL_REVIEW}/${id}`)
}
export const review=(id)=>{
    return axiosInstance.put(`${API_ROUTES.SUPERVISIOR_REVIEW}/${id}`)
}
export const getMaterialHistory=(id)=>{
   return axiosInstance.get(`${API_ROUTES.GET_MATERIAL_HISTORY}/${id}`)
}
export const markplaceOrder=(data)=>{
  return axiosInstance.post(API_ROUTES.PLACE_ORDER,data)
}
export const checkmaterial=(id)=>{
  return axiosInstance.get(`${API_ROUTES.CHECKORDER_PLACED_BY_MATERIAL}/${id}`)
}
export const getorderplacedtomartivulrID=(id)=>{
  return axiosInstance.get(`${API_ROUTES.CHECKORDER_PLACED_BY_MATERIAL}/${id}`)
}
export const allorder=()=>{
  return axiosInstance.get(`${API_ROUTES.ALL_ORDER}`)
}
export const checkstatus=()=>{
  return axiosInstance.get(API_ROUTES.CHECK_BLOCKED)
}