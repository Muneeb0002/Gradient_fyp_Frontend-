import api from "../api/axios.api.js";
 
export const fetchAdminUsersList = async (credentials) => {
  const response = await api.post("/admin/list-users", {
    createdBy: credentials.createdBy,
    createdByPass: credentials.createdByPass,
  });
 
  return response.data;
};
 

export const createAdminAccount = async (adminData) => {
  console.log("📤 CREATE ADMIN REQUEST:", adminData);

  const response = await api.post("/admin/create-admin", {
    firstName: adminData.firstName,
    lastName: adminData.lastName,
    email: adminData.email,
    password: adminData.password,
    createdBy: adminData.createdBy,
    createdByPass: adminData.createdByPass,
  });

  console.log("✅ CREATE ADMIN RESPONSE:", response.data);

  return response.data;
};


export const fetchAdmins = async () => {
  console.log("📡 GET /admin/list-admins HIT");

  const response = await api.get("/admin/list-admins");

  console.log("📦 RAW RESPONSE:", response);
  console.log("✅ ADMIN DATA:", response.data);

  return response.data;
};


export const fetchUsers = async () => {
  const res = await api.get("/admin/list-users");

  // 🔥 DEBUG: terminal check
  console.log("👥 USERS API RESPONSE:", res.data);

  return res.data; // { success, total, data }
};


export const fetchAdminHistoryList = async () => {
  // GET request bina kisi body ke direct hit hogi
  const response = await api.get("/admin/list-history");
  
  // Console mein check karne ke liye ke data aaya ya nahi
  console.log("--- API RESPONSE (History) ---", response.data);
  
  return response.data; // { success: true, total: 235, data: [...] }
};



// Delete Admin API Call
export const deleteAdminApi = async (email) => {
  // Body none hai, isliye sirf URL pass ho raha hai
  const response = await api.delete(`/admin/delete-admin/${email}`);
  return response.data;
};


