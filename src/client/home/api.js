// API Client for ReadFlow Backend
const API_BASE_URL = 'http://127.0.0.1:3000/api';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = '../auth/login.html';
                return null;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return await response.text();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Book APIs
const BookAPI = {
    getAll: () => apiRequest('/books'),
    getById: (id) => apiRequest(`/books/${id}`),
    create: (data) => apiRequest('/books', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/books/${id}`, { method: 'DELETE' }),
    updateProgress: (id, currentPage, status) => 
        apiRequest(`/books/${id}/progress`, { 
            method: 'POST', 
            body: JSON.stringify({ currentPage, status }) 
        }),
    getProgress: (id) => apiRequest(`/books/${id}/progress`),
    getAllProgress: () => apiRequest('/progress')
};

// Dashboard APIs
const DashboardAPI = {
    getSummary: () => apiRequest('/dashboard/summary'),
    getTrend: () => apiRequest('/dashboard/trend'),
    getTopBooks: (limit = 5) => apiRequest(`/dashboard/top-books?limit=${limit}`),
    getReadingTime: (period = 'total') => apiRequest(`/dashboard/reading-time?period=${period}`)
};

// Friend APIs
const FriendAPI = {
    getAll: () => apiRequest('/friends'),
    getOnline: () => apiRequest('/friends/online'),
    getPending: () => apiRequest('/friends/pending'),
    sendRequest: (followingId) => 
        apiRequest('/friends/request', { method: 'POST', body: JSON.stringify({ followingId }) }),
    accept: (id) => apiRequest(`/friends/accept/${id}`, { method: 'PUT' }),
    reject: (id) => apiRequest(`/friends/reject/${id}`, { method: 'PUT' }),
    remove: (id) => apiRequest(`/friends/${id}`, { method: 'DELETE' }),
    getStats: (id) => apiRequest(`/friends/${id}/stats`),
    checkStatus: (id) => apiRequest(`/friends/status/${id}`)
};

// Group APIs
const GroupAPI = {
    getAll: () => apiRequest('/groups'),
    getById: (id) => apiRequest(`/groups/${id}`),
    create: (data) => apiRequest('/groups', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/groups/${id}`, { method: 'DELETE' }),
    invite: (id, userId) => 
        apiRequest(`/groups/${id}/invite`, { method: 'POST', body: JSON.stringify({ userId }) }),
    leave: (id) => apiRequest(`/groups/${id}/leave`, { method: 'DELETE' }),
    getMembers: (id) => apiRequest(`/groups/${id}/members`),
    getLeaderboard: (id) => apiRequest(`/groups/${id}/leaderboard`),
    getTotalTime: (id) => apiRequest(`/groups/${id}/total-time`)
};

// Reading Session APIs
const ReadingAPI = {
    start: (bookId, section) => 
        apiRequest('/reading-sessions/start', { method: 'POST', body: JSON.stringify({ bookId, section }) }),
    stop: (sessionId, pagesRead) => 
        apiRequest('/reading-sessions/stop', { method: 'POST', body: JSON.stringify({ sessionId, pagesRead }) }),
    getHistory: () => apiRequest('/reading-sessions/history'),
    getActive: () => apiRequest('/reading-sessions/active')
};

// Auth APIs
const AuthAPI = {
    getProfile: () => apiRequest('/auth/profile'),
    login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' })
};

// Export all APIs
window.ReadFlowAPI = {
    Book: BookAPI,
    Dashboard: DashboardAPI,
    Friend: FriendAPI,
    Group: GroupAPI,
    Reading: ReadingAPI,
    Auth: AuthAPI
};
