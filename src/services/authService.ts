//authService.ts
import { loginResponseSchema, type LoginResponse } from "@/model/schemas/authSchema";
import api from "@/services/api";

 

const authService = {
  login: async (userid: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/udp.php?objectcode=u_ajaxtest",{type : "login", userid, password });   
    const parsed = loginResponseSchema.parse(response.data);
    console.log("token", parsed.user.token);
    if (parsed.user.token) { 
      localStorage.setItem("auth_token", parsed.user.token);
    }
    return parsed;
  },

  register: async (
    name: string,
    userid: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await api.post("/auth/register", { name, userid, password });
    return response.data;
  },
 
  getProfile: async () => {
    const response = await api.post( "/udp.php?objectcode=u_ajaxtest", { type: "fetchprofile" } ,{ withCredentials: true }); 
    console.log("getProfile", response.data);
    return response.data;  
  },
  
};

export default authService;
