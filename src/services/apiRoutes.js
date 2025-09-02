export const BASE_URL = 'http://localhost:5050';

export const API_ROUTES = {
  //AUTH
  LOGIN: '/api/users/login',

  REGISTER: '/api/users/register',
  VIEW_ALL_ADMINS:"/api/users/alladmin",
  BLOCKED_UNBLOCKED_ADMIN:"/api/users/toggle-block",
  RESET_PASSWORD:"/api/users/reset-password",
  MANAGE_PERMISISON:"/api/users/admin/permissions",
  UPDATE_LIMIT:"",
  //STOCK INWARD
  ADD_STOCK_INWARD:"/api/materials/create",
  GET_ALL_STOCK_INWARD:"/api/materials/all",
  GET_PARTICULAR_STOCK_INWARD:"/api/materials",
  DELETE_PARTICULAR_STOCK_INWARD:"/api/materials",
  UPDATE_PARTICULR_STOCK_INWARD:"/api/materials",
//STOCK OYTWARD
CREATE_STOCK_OUTWARD:"/api/stockoutward/create",
GET_ALL_STOCK_OUTWARD:"/api/stockoutward/all",

//DASHBOARD STATS
DASHBOARD_STATS:"/api/stock/autostock",
//MATERIAL

  ADD_MATERIALDATA:"/api/materialsname/create",
  GET_ALL_MATERIALDATA:"/api/materialsname/all",
  GET_PARTICULAR_MATERIALDATA:"/api/materialsname",
  DELETE_PARTICULAR_MATERIALDATA:"/api/materialsname",
  UPDATE_PARTICULR_MATERIALDATA:"/api/materialsname",
  UPDATE_MATERIAL_LIMIT:"/api/materialsname/"
};
