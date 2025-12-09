import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

// Auth
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// All Reservations
export const getReservations = (params = {}) =>
  API.get("/reservations", { params }); 
export const addReservation = (data) => API.post("/reservations", data);
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);
export const updateReservation = (id, data) =>
  API.put(`/reservations/${id}`, data);
export const getReservation = (id) => API.get(`/reservations/${id}`);
export const getReservationPDF = (id) =>
  API.get(`/reservations/pdf/${id}`, { responseType: "blob" });
export const filterReservations = (query) =>
  API.get("/reservations/filter", { params: query });
export const getAvailableSlots = (query) =>
  API.get("/reservations/available-slots", { params: query });
export const getReservationById = (id) => api.get(`/reservations/${id}`);
