import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

export const fetchTasks = () => API.get("/tasks");
export const addTask = (task) => API.post("/tasks", task);
export const updateTask = (id, updates) => API.put(`/tasks/${id}`, updates);
export const completeTask = (id) => API.put(`/tasks/${id}/complete`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
