import api from "../Utils/Api.js";


const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export default {
  login,
  register,
};