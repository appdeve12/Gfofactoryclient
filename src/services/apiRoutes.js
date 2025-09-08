export const BASE_URL = 'https://gfofactoryserver.onrender.com';

export const API_ROUTES = {
  //AUTH
  LOGIN: '/api/users/login',

  REGISTER: '/api/users/register',
  CHECK_BLOCKED:"/api/users/checkblockedstatus",
  VIEW_ALL_ADMINS:"/api/users/alladmin",
  BLOCKED_UNBLOCKED_ADMIN:"/api/users/toggle-block",
  RESET_PASSWORD:"/api/users/reset-password",
  MANAGE_PERMISISON:"/api/users/admin/permissions",
  UPDATE_LIMIT:"",
  GET_MATERIAL_HISTORY:"/api/materials/history",
  //STOCK INWARD
  ADD_STOCK_INWARD:"/api/materials/create",
  GET_ALL_STOCK_INWARD:"/api/materials/all",
  GET_ALL_DONE_MATERIAL:"/api/materials/alldonematerial",
  GET_ALL_STOCK_INWARD_FOR_SUPERVISIOR:"/api/materials/allforsupervisior",
  GET_PARTICULAR_STOCK_INWARD:"/api/materials",
  DELETE_PARTICULAR_STOCK_INWARD:"/api/materials",
  UPDATE_PARTICULR_STOCK_INWARD:"/api/materials",

//STOCK OYTWARD
CREATE_STOCK_OUTWARD:"/api/stockoutward/create",
GET_ALL_STOCK_OUTWARD:"/api/stockoutward/all",
GET_ALL_STOCK_OUTWARD_ADMIN:"/api/stockoutward/alladmin",
GET_PARTICULR_STOCK_OUTWARD:"/api/stockoutward/stock-outward",
UPDATE_PARTICULR_STOCK_OUTWARD:"/api/stockoutward/edit",
MARK_STOCK_OUTWAD_DONE:"/api/stockoutward/mark-done",
MARK_EDIT_STOCK_OUTWARD_REQUEST:"/api/stockoutward/request-edit",
MART_APPROVED_STOCK_OUTWARD_REQUEST:"/api/stockoutward/approve-edit-request",

//DASHBOARD STATS
DASHBOARD_STATS:"/api/stock/autostock",
//MATERIAL

  ADD_MATERIALDATA:"/api/materialsname/create",
  GET_ALL_MATERIALDATA:"/api/materialsname/all",
  GET_PARTICULAR_MATERIALDATA:"/api/materialsname",
  DELETE_PARTICULAR_MATERIALDATA:"/api/materialsname",
  UPDATE_PARTICULR_MATERIALDATA:"/api/materialsname",
  UPDATE_MATERIAL_LIMIT:"/api/materialsname/",
  ACTIVE_INACTIVE_MATERIAL_DATA:"/api/materialsname/toggle-active",

  //ADMIN Mark As Done (Admin)
  MARK_AS_DONE:"/api/materials/done",
  // Make Edit Request (Admin if mistake found)
  MAKE_EDIT_REQUEST:"/api/materials/request-edit",
  //SUPERVISIOR EDIT APPROVED REQUEST
  SUPERVISIOR_EDIT_REQUEST:"/api/materials/approve-edit",
  //SUPERVISIOR FINAL_APPROVAL
  SUPERVISIOR_FINAL_REVIEW:"/api/materials/approve-edit",

  SUPERVISIOR_REVIEW:"/api/materials/review",
  PLACE_ORDER:"/api/order/place-order",
  CHECKORDER_PLACED_BY_MATERIAL:"/api/order/orders-by-material",
  ALL_ORDER:"/api/order/my-orders"
};
