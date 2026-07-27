import api from "./api";

const login = async (email, password) => {
  const response = await api.post("/user/login", { email, password });
  return response.data; // { status, message, token, user }
};

const forgotPassword = async (email) => {
  const response = await api.post("/user/forgot-password", { email });
  return response.data; // { status, message }
};

const resetPassword = async (id, token, password, confirm_password) => {
  const response = await api.put(`/user/reset-password/${id}/${token}`, {
    password,
    confirm_password,
  });
  return response.data; // { status, message }
};

const logout = async () => {
  try {
    await api.post("/user/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

const authService = { login, forgotPassword, resetPassword, logout };

export default authService;