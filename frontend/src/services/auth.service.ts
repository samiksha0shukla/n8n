import { apiCaller, removeToken } from "./api-caller";

export const signIn = async (email: string, password: string) => {
  try {
    const res = await apiCaller.post("auth/signin", { email, password });

    console.log(res.data)
    return res.data
  } catch (error) {
    console.error("Signin error:", error);
    return null;
  }
};

export const signUp = async (email: string, password: string, name?: string) => {
  try {
    const res = await apiCaller.post("auth/signup", { email, password, name });
    return res.data
  } catch (error) {
    console.error("Signup error:", error);
    return null;
  }
};

export function logOut() {
  removeToken();
}
