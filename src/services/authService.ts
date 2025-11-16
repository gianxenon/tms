import api from "@/services/api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/apps/dashboard", { email, password });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await api.post("/auth/register", { name, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

export default authService;
