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



export const addstockinward=(data)=>{
  return axiosInstance.post(API_ROUTES.ADD_STOCK_INWARD,data)
};
export const getallstockinwards=()=>{
  return axiosInstance.get(API_ROUTES.GET_ALL_STOCK_INWARD)
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
export const dashboardstats=()=>{
  return axiosInstance.get(API_ROUTES.DASHBOARD_STATS)
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