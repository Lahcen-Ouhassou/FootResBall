import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Inject token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Auth
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// Reservations
export const getReservations = () => API.get("/reservations");
export const addReservation = (data) => API.post("/reservations", data);
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);
export const updateReservation = (id, data) =>
  API.put(`/reservations/${id}`, data);
export const getReservationPDF = (id) =>
  API.get(`/reservations/pdf/${id}`, { responseType: "blob" });
export const filterReservations = (query) =>
  API.get("/reservations/filter", { params: query });
