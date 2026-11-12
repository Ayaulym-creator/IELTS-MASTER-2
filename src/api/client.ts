import { ClientDatabase } from './clientDatabase.js';

export const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('ielts_master_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('ielts_master_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('ielts_master_token');
}

/**
 * Handles client-side persistent execution when deployed statically on Netlify
 * or when the backend server is unreachable.
 */
function handleClientFallback<T = any>(endpoint: string, options: RequestInit = {}): T {
  const clientDb = ClientDatabase.getInstance();
  const method = (options.method || 'GET').toUpperCase();
  const token = getAuthToken();
  const currentUser = token ? clientDb.getUserByToken(token) : null;
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // 1. Auth routes
  if (endpoint === '/auth/register' && method === 'POST') {
    return clientDb.register(body) as unknown as T;
  }

  if (endpoint === '/auth/login' && method === 'POST') {
    return clientDb.login(body.email, body.password) as unknown as T;
  }

  if (endpoint === '/auth/me' && method === 'GET') {
    if (!currentUser) {
      const err: any = new Error('Authentication required.');
      err.status = 401;
      throw err;
    }
    return { user: currentUser } as unknown as T;
  }

  if (endpoint === '/auth/logout' && method === 'POST') {
    if (token) clientDb.revokeSession(token);
    return { success: true } as unknown as T;
  }

  if (endpoint === '/auth/recover-password' && method === 'POST') {
    return {
      success: true,
      message: 'If an account exists with this email address, password recovery instructions have been transmitted.'
    } as unknown as T;
  }

  if (endpoint === '/auth/me/profile' && method === 'PATCH') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.updateStudent(currentUser.id, body) as unknown as T;
  }

  // 2. Content routes
  if (endpoint === '/content/reading') return clientDb.getReadingTasks() as unknown as T;
  if (endpoint.startsWith('/content/reading/')) {
    const id = endpoint.split('/')[3];
    return clientDb.getReadingTask(id) as unknown as T;
  }

  if (endpoint === '/content/listening') return clientDb.getListeningTasks() as unknown as T;
  if (endpoint.startsWith('/content/listening/')) {
    const id = endpoint.split('/')[3];
    return clientDb.getListeningTask(id) as unknown as T;
  }

  if (endpoint === '/content/writing') return clientDb.getWritingTasks() as unknown as T;
  if (endpoint.startsWith('/content/writing/')) {
    const id = endpoint.split('/')[3];
    return clientDb.getWritingTask(id) as unknown as T;
  }

  if (endpoint === '/content/speaking') return clientDb.getSpeakingTasks() as unknown as T;
  if (endpoint.startsWith('/content/speaking/')) {
    const id = endpoint.split('/')[3];
    return clientDb.getSpeakingTask(id) as unknown as T;
  }

  if (endpoint === '/content/grammar') return clientDb.getGrammarTasks() as unknown as T;
  if (endpoint.startsWith('/content/grammar/')) {
    const id = endpoint.split('/')[3];
    return clientDb.getGrammarTask(id) as unknown as T;
  }

  if (endpoint === '/content/vocabulary') return clientDb.getVocabulary() as unknown as T;
  if (endpoint === '/content/mock-tests') return clientDb.getMockTests() as unknown as T;
  if (endpoint.startsWith('/content/mock-tests/')) {
    const id = endpoint.split('/')[3];
    return clientDb.getMockTest(id) as unknown as T;
  }

  // 3. Submissions
  if (endpoint === '/submissions/my') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.getMySubmissions(currentUser) as unknown as T;
  }

  if (endpoint === '/submissions/reading' && method === 'POST') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.submitReading(currentUser, body) as unknown as T;
  }

  if (endpoint === '/submissions/listening' && method === 'POST') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.submitListening(currentUser, body) as unknown as T;
  }

  if (endpoint === '/submissions/writing' && method === 'POST') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.submitWriting(currentUser, body) as unknown as T;
  }

  if (endpoint === '/submissions/speaking' && method === 'POST') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.submitSpeaking(currentUser, body) as unknown as T;
  }

  if (endpoint === '/submissions/grammar' && method === 'POST') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.submitGrammar(currentUser, body) as unknown as T;
  }

  if (endpoint === '/submissions/mock-exam' && method === 'POST') {
    if (!currentUser) throw new Error('Authentication required.');
    return clientDb.submitMockExam(currentUser, body) as unknown as T;
  }

  // 4. Student Management (Admin)
  if (endpoint === '/students/pending') return clientDb.getPendingStudents() as unknown as T;
  if (endpoint === '/students' && method === 'GET') return clientDb.getStudents() as unknown as T;

  if (endpoint.startsWith('/students/') && endpoint.endsWith('/approve') && method === 'POST') {
    const id = endpoint.split('/')[2];
    return clientDb.approveStudent(currentUser || { id: 'admin', fullName: 'Super Admin' } as any, id) as unknown as T;
  }

  if (endpoint.startsWith('/students/') && endpoint.endsWith('/reject') && method === 'POST') {
    const id = endpoint.split('/')[2];
    return clientDb.rejectStudent(currentUser || { id: 'admin', fullName: 'Super Admin' } as any, id, body?.reason) as unknown as T;
  }

  if (endpoint.startsWith('/students/') && endpoint.endsWith('/suspend') && method === 'POST') {
    const id = endpoint.split('/')[2];
    return clientDb.suspendStudent(currentUser || { id: 'admin', fullName: 'Super Admin' } as any, id, body?.reason) as unknown as T;
  }

  if (endpoint.startsWith('/students/') && endpoint.endsWith('/restore') && method === 'POST') {
    const id = endpoint.split('/')[2];
    return clientDb.restoreStudent(currentUser || { id: 'admin', fullName: 'Super Admin' } as any, id) as unknown as T;
  }

  if (endpoint.startsWith('/students/') && method === 'PATCH') {
    const id = endpoint.split('/')[2];
    return clientDb.updateStudent(id, body) as unknown as T;
  }

  if (endpoint.startsWith('/students/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    return clientDb.deleteStudent(id) as unknown as T;
  }

  // 5. Admin Management
  if (endpoint === '/admins' && method === 'GET') return clientDb.getAdmins() as unknown as T;
  if (endpoint === '/admins' && method === 'POST') {
    return clientDb.createAdmin(currentUser || { id: 'admin', fullName: 'Super Admin' } as any, body) as unknown as T;
  }
  if (endpoint.startsWith('/admins/') && method === 'PATCH') {
    const id = endpoint.split('/')[2];
    return clientDb.updateAdmin(id, body) as unknown as T;
  }
  if (endpoint.startsWith('/admins/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    return clientDb.deleteAdmin(id) as unknown as T;
  }

  // 6. Analytics & Logs & Settings
  if (endpoint === '/analytics/overview') return clientDb.getAnalyticsOverview() as unknown as T;
  if (endpoint.startsWith('/logs')) return clientDb.getLogs() as unknown as T;
  if (endpoint === '/settings' && method === 'GET') return clientDb.getSettings() as unknown as T;
  if (endpoint === '/settings' && method === 'PATCH') return clientDb.updateSettings(body) as unknown as T;

  // Fallback default
  return {} as T;
}

export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  let responseText = '';

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    responseText = await response.text();
  } catch (netErr: any) {
    // If backend is unreachable (e.g. Netlify static deployment with no running backend server)
    console.warn(`[IELTS MASTER] Network request to ${endpoint} failed, activating seamless client engine:`, netErr.message);
    return handleClientFallback<T>(endpoint, options);
  }

  // Parse JSON response
  let data: any = null;
  const isJson = response.headers.get('content-type')?.includes('application/json');

  if (isJson || (responseText.trim().startsWith('{') || responseText.trim().startsWith('['))) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  // If server returned 404 HTML (common on Netlify when Express is not running on CDN)
  if (!response.ok && (!data || response.status === 404 || response.status === 405)) {
    console.warn(`[IELTS MASTER] Server returned ${response.status} for ${endpoint}. Seamlessly delegating to client engine.`);
    return handleClientFallback<T>(endpoint, options);
  }

  // If response is not ok, extract meaningful error message
  if (!response.ok) {
    const message = data?.message || data?.error || (response.statusText ? `Request failed (${response.statusText})` : 'Operation failed. Please check your inputs.');
    const error: any = new Error(message);
    error.status = response.status;
    error.code = data?.error || data?.status;
    error.payload = data;
    throw error;
  }

  return (data !== null ? data : responseText) as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};
