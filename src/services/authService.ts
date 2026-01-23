//authService.ts
import { loginResponseSchema, type LoginResponse } from "@/model/schemas/authSchema";
import api from "@/services/api";

 

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/udp.php?objectcode=u_ajaxtest",{type : "login", email, password });  
    console.log(response);
    const parsed = loginResponseSchema.parse(response.data);
    return parsed;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await api.post("/auth/register", { name, email, password });
    return response.data;
  },
 
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

export default authService;
