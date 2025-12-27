import { apiCaller } from "./api-caller";
import { Credential, CredentialCreate } from "@/types/workflow";

export const getCredentials = async (): Promise<Credential[]> => {
  const response = await apiCaller.get("/credential/credential");
  if (response.status !== 200) {
    throw new Error((response.data as any)?.detail || "Failed to fetch credentials");
  }
  return response.data as Credential[];
};

export const getCredential = async (id: number): Promise<Credential> => {
  try {
    const response = await apiCaller.get<Credential>(`/credential/credential/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch credential:", error);
    throw error;
  }
};

export const createCredential = async (credential: CredentialCreate): Promise<Credential> => {
  try {
    const response = await apiCaller.post<Credential>("/credential/credential", credential);
    return response.data;
  } catch (error) {
    console.error("Failed to create credential:", error);
    throw error;
  }
};

export const deleteCredential = async (id: number): Promise<void> => {
  try {
    await apiCaller.delete(`/credential/credential/${id}`);
  } catch (error) {
    console.error("Failed to delete credential:", error);
    throw error;
  }
};

// Get credentials for a specific platform
export const getCredentialsByPlatform = async (platform: string): Promise<Credential[]> => {
  const all = await getCredentials();
  return all.filter(c => c.platform === platform);
};
