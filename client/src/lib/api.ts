import axios from "axios";

// const BE_BASE_URL = "http://192.168.254.126:5000/api";
const BE_BASE_URL = `http://${window.location.hostname}:5000/api`;
const api = axios.create({
  baseURL: BE_BASE_URL,
  withCredentials: true,
});

// api.interceptors.request.use(async (request) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     request.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return request;
// });

api.interceptors.response.use(async (response) => {
  return response;
});

export default api;
