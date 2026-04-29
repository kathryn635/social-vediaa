import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});

makeRequest.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});