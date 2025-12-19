// Central API base URL used across the frontend.
// Priority:
// 1) Explicit Vercel/Env config via VITE_API_URL (no trailing slash)
// 2) In production, default to the Render backend URL
// 3) In development, default to localhost
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, '')) ||
  (import.meta.env.PROD ? 'https://kodescruxx-backend-gnlc.onrender.com' : 'http://localhost:8000');

// Helper to get authentication token
async function getAuthToken(): Promise<string | null> {
  // First try localStorage (where we store it after Stack Auth sync)
  const token = localStorage.getItem('token');
  if (token) return token;

  // If not in localStorage, try to get it from Stack Auth directly
  try {
    const { stackClientApp } = await import('../stack');
    const authJson = await stackClientApp.getAuthJson();
    return authJson?.accessToken || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

export interface ApiRequest {
  language?: string;
  code?: string;
  topic?: string;
  level?: string;
  logic?: string;
  snippet?: string;
  framework?: string;       // For test generation
  refactor_type?: string;   // For code refactoring
}

export interface ApiResponse {
  response: string;
}

export interface QuotaStatus {
  success: boolean;
  quota_used: number;
  quota_limit: number;
  quota_remaining: number;
  reset_at: string;
  is_exhausted: boolean;
}

export interface ExecuteCodeResponse {
  success: boolean;
  output: string;
  error?: string;
  language: string;
  stage?: string;
  exit_code?: number;
  version?: string;
}

// Custom error for quota exhaustion
export class QuotaExhaustedError extends Error {
  public quotaInfo: any;

  constructor(quotaInfo: any) {
    super(quotaInfo.message || 'Daily quota exhausted');
    this.name = 'QuotaExhaustedError';
    this.quotaInfo = quotaInfo;
  }
}

class ApiService {
  private async request<T>(endpoint: string, data: ApiRequest): Promise<T> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      // Handle quota exhaustion (429)
      if (response.status === 429) {
        const errorData = await response.json();
        throw new QuotaExhaustedError(errorData);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  private async streamRequest(
    endpoint: string,
    data: ApiRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      // Handle quota exhaustion (429)
      if (response.status === 429) {
        const errorData = await response.json();
        throw new QuotaExhaustedError(errorData);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hasReceivedData = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.chunk) {
                hasReceivedData = true;
                onChunk(json.chunk);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.startsWith('data: ')) {
        try {
          const json = JSON.parse(buffer.slice(6));
          if (json.chunk) {
            hasReceivedData = true;
            onChunk(json.chunk);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }

      // If no data was received, the backend might be slow to start
      if (!hasReceivedData) {
        // This shouldn't happen, but handle gracefully
        onChunk('\n\n⚠️ No response received. Please try again.');
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  async explainCode(language: string, topic: string, level: string, code?: string): Promise<string> {
    const result = await this.request<ApiResponse>('/explain', { language, topic, level, code });
    return result.response;
  }

  async debugCode(language: string, code: string, topic?: string): Promise<string> {
    const result = await this.request<ApiResponse>('/debug', { language, code, topic });
    return result.response;
  }

  async generateCode(language: string, topic: string, level: string): Promise<string> {
    const result = await this.request<ApiResponse>('/generate', { language, topic, level });
    return result.response;
  }

  async convertLogic(logic: string, language: string): Promise<string> {
    const result = await this.request<ApiResponse>('/convert_logic', { logic, language });
    return result.response;
  }

  async analyzeComplexity(code: string): Promise<string> {
    const result = await this.request<ApiResponse>('/analyze_complexity', { code });
    return result.response;
  }

  async traceCode(code: string, language: string): Promise<string> {
    const result = await this.request<ApiResponse>('/trace_code', { code, language });
    return result.response;
  }

  async getSnippets(language: string, topic: string): Promise<string> {
    const result = await this.request<ApiResponse>('/get_snippets', { language, snippet: topic });
    return result.response;
  }

  async getProjects(level: string, topic: string): Promise<string> {
    const result = await this.request<ApiResponse>('/get_projects', { level, topic });
    return result.response;
  }

  async getRoadmaps(level: string, topic: string): Promise<string> {
    const result = await this.request<ApiResponse>('/get_roadmaps', { level, topic });
    return result.response;
  }

  // Streaming versions
  async streamExplainCode(
    language: string,
    topic: string,
    level: string,
    code: string | undefined,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/explain', { language, topic, level, code }, onChunk);
  }

  async streamDebugCode(
    language: string,
    code: string,
    topic: string | undefined,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/debug', { language, code, topic }, onChunk);
  }

  async streamGenerateCode(
    language: string,
    topic: string,
    level: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/generate', { language, topic, level }, onChunk);
  }

  async streamConvertLogic(
    logic: string,
    language: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/convert_logic', { logic, language }, onChunk);
  }

  async streamAnalyzeComplexity(
    code: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/analyze_complexity', { code }, onChunk);
  }

  async streamTraceCode(
    code: string,
    language: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/trace_code', { code, language }, onChunk);
  }

  async streamGetSnippets(
    language: string,
    topic: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/get_snippets', { language, snippet: topic }, onChunk);
  }

  async streamGetProjects(
    level: string,
    topic: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/get_projects', { level, topic }, onChunk);
  }

  async streamGetRoadmaps(
    level: string,
    topic: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/get_roadmaps', { level, topic }, onChunk);
  }

  async executeCode(code: string, language: string, stdin?: string): Promise<ExecuteCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/execute_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          stdin: stdin || '',
          version: '*'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  // Room management methods
  async createRoom(data: {
    name: string;
    host_name: string;
    language?: string;
    code?: string;
    max_users?: number;
    is_public?: boolean;
  }): Promise<{ success: boolean; room: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  async getRoom(roomId: string): Promise<{ success: boolean; room: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  async listRooms(): Promise<{ success: boolean; rooms: any[]; count: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  async deleteRoom(roomId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  async getChatHistory(roomId: string): Promise<{ success: boolean; messages: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/chat`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend is running on port 8000.`);
      }
      throw error;
    }
  }

  // New AI Developer Features
  async streamReviewCode(
    code: string,
    language: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/review_code', { code, language }, onChunk);
  }

  async streamGenerateTests(
    code: string,
    language: string,
    framework: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/generate_tests', { code, language, framework }, onChunk);
  }

  async streamRefactorCode(
    code: string,
    language: string,
    refactor_type: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    await this.streamRequest('/stream/refactor_code', { code, language, refactor_type }, onChunk);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }

  async getRecentActivity(limit: number = 10) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/dashboard/recent?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
  }

  async logActivity(feature: string, language?: string, success: boolean = true, duration_ms?: number) {
    // Mocked response - Activity logging disabled
    return { success: true };
    /*
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/activity/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ feature, language, success, duration_ms })
    });
    if (!response.ok) throw new Error('Failed to log activity');
    return response.json();
    */
  }

  // Workflow endpoints
  async createWorkflow(name: string, nodes: string, edges: string, description?: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/workflows?name=${encodeURIComponent(name)}&nodes=${encodeURIComponent(nodes)}&edges=${encodeURIComponent(edges)}${description ? `&description=${encodeURIComponent(description)}` : ''}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to create workflow');
    return response.json();
  }

  async getWorkflows() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/workflows`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return response.json();
  }

  async runWorkflow(workflowId: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to run workflow');
    return response.json();
  }

  async getWorkflowExecution(executionId: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/workflows/executions/${executionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch execution');
    return response.json();
  }

  // Quota management
  async getQuotaStatus(): Promise<QuotaStatus> {
    // Mocked response - Quota disabled
    return {
      success: true,
      quota_used: 0,
      quota_limit: 999999,
      quota_remaining: 999999,
      reset_at: new Date(Date.now() + 86400000).toISOString(),
      is_exhausted: false
    };

    /*
    const token = await getAuthToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/quota/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quota status');
    }

    return response.json();
    */
  }
}

export const apiService = new ApiService();
