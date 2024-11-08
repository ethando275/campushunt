// axiosInstance.js
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:1000"; // Replace 1000 with your default local port if needed

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
