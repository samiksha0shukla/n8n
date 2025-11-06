// API service layer for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(email: string, password: string, name?: string) {
    const response = await this.request<{ access_token: string; token_type: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async signin(email: string, password: string) {
    const response = await this.request<{ access_token: string; token_type: string; user: any }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  logout() {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Workflow endpoints
  async getWorkflows() {
    return this.request<any[]>('/workf/workflow');
  }

  async getWorkflow(id: string) {
    return this.request<any>(`/workf/workflow/${id}`);
  }

  async createWorkflow(workflow: any, userId: number) {
    return this.request(`/workf/workflow?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  async updateWorkflow(id: string, workflow: any) {
    return this.request(`/workf/workflow/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    });
  }

  // Credential endpoints
  async getCredentials() {
    return this.request<any[]>('/credential');
  }

  async createCredential(credential: any) {
    return this.request('/credential', {
      method: 'POST',
      body: JSON.stringify(credential),
    });
  }

  async deleteCredential(id: number) {
    return this.request(`/credential/${id}`, {
      method: 'DELETE',
    });
  }

  // Webhook handler
  async executeWorkflow(workflowId: number, data: any = {}) {
    return this.request(`/webh/webhook/handler/${workflowId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();