export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `/api${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Ensures HTTP-only JWT cookies are sent to the backend proxy
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    
    // Attempt to parse JSON response
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || response.statusText || 'API request failed');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}
