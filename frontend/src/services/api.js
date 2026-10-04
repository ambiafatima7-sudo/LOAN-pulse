import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

const PUBLIC = ["login/", "register/"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token && !PUBLIC.includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const expired = err.response?.data?.code === "token_not_valid";
    if (expired) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;