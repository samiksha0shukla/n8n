import { apiCaller, removeToken, setToken } from "./api-caller";

export const signIn = async (email: string, password: string) => {
  const res = await apiCaller.post("/auth/signin", { email, password });
  
  if (res.status !== 200) {
    throw new Error(res.data?.detail || "Sign in failed");
  }
  
  // Store the token
  if (res.data?.access_token) {
    setToken(res.data.access_token);
  }
  
  return res.data;
};

export const signUp = async (email: string, password: string, name?: string) => {
  const res = await apiCaller.post("/auth/signup", { email, password, name });
  
  if (res.status !== 200) {
    throw new Error(res.data?.detail || "Sign up failed");
  }
  
  return res.data;
};

export function logOut() {
  removeToken();
}

