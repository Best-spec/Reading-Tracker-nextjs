/**
 * API Service Layer - ReadFlow Social Reading Tracker
 * Centralized HTTP client with error handling and auth
 */

const API_BASE_URL = 'http://127.0.0.1:3000/api';

// Token management
const TOKEN_KEY = 'readflow_token';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// HTTP Client with interceptors
async function httpClient(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    // Add auth token if available
    const token = getToken();
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...defaultOptions, ...options };
    
    // Merge headers properly
    config.headers = { ...defaultOptions.headers, ...(options.headers || {}) };

    try {
        const response = await fetch(url, config);
        
        // Handle auth errors
        if (response.status === 401) {
            removeToken();
            window.location.href = '/src/client/pages/Login.html';
            return null;
        }

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            throw new Error(data.message || data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// Auth API
const AuthAPI = {
    async login(credentials) {
        const data = await httpClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    async register(userData) {
        const data = await httpClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    async logout() {
        try {
            await httpClient('/auth/logout', { method: 'POST' });
        } finally {
            removeToken();
        }
    },

    async getProfile() {
        return httpClient('/auth/profile');
    },

    async updateProfile(profileData) {
        return httpClient('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    isAuthenticated() {
        return !!getToken();
    }
};

// Books API
const BooksAPI = {
    async getAllBooks() {
        return httpClient('/books');
    },

    async getBookById(id) {
        return httpClient(`/books/${id}`);
    },

    async createBook(bookData) {
        return httpClient('/books', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    },

    async updateBook(id, bookData) {
        return httpClient(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
    },

    async deleteBook(id) {
        return httpClient(`/books/${id}`, {
            method: 'DELETE'
        });
    }
};

// Reading Sessions API
const ReadingSessionAPI = {
    async getSessions() {
        return httpClient('/reading-sessions');
    },

    async startSession(bookId) {
        return httpClient('/reading-sessions', {
            method: 'POST',
            body: JSON.stringify({ bookId, action: 'start' })
        });
    },

    async stopSession(sessionId, data) {
        return httpClient(`/reading-sessions/${sessionId}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data, action: 'stop' })
        });
    },

    async getActiveSession() {
        return httpClient('/reading-sessions/active');
    }
};

// Friends API
const FriendsAPI = {
    async getFriends() {
        return httpClient('/friends');
    },

    async searchUsers(query) {
        return httpClient(`/friends/search?q=${encodeURIComponent(query)}`);
    },

    async sendRequest(userId) {
        return httpClient('/friends/request', {
            method: 'POST',
            body: JSON.stringify({ userId })
        });
    },

    async acceptRequest(userId) {
        return httpClient('/friends/accept', {
            method: 'POST',
            body: JSON.stringify({ userId })
        });
    },

    async rejectRequest(userId) {
        return httpClient('/friends/reject', {
            method: 'POST',
            body: JSON.stringify({ userId })
        });
    },

    async removeFriend(userId) {
        return httpClient(`/friends/${userId}`, {
            method: 'DELETE'
        });
    }
};

// Groups API
const GroupsAPI = {
    async getGroups() {
        return httpClient('/groups');
    },

    async getGroupById(id) {
        return httpClient(`/groups/${id}`);
    },

    async createGroup(groupData) {
        return httpClient('/groups', {
            method: 'POST',
            body: JSON.stringify(groupData)
        });
    },

    async joinGroup(groupId) {
        return httpClient(`/groups/${groupId}/join`, {
            method: 'POST'
        });
    },

    async leaveGroup(groupId) {
        return httpClient(`/groups/${groupId}/leave`, {
            method: 'POST'
        });
    },

    async getLeaderboard(groupId) {
        return httpClient(`/groups/${groupId}/leaderboard`);
    }
};

// Statistics API
const StatsAPI = {
    async getDashboardStats() {
        return httpClient('/stats/dashboard');
    },

    async getReadingTrends(period = 'week') {
        return httpClient(`/stats/trends?period=${period}`);
    },

    async getCalendarData(year, month) {
        return httpClient(`/stats/calendar?year=${year}&month=${month}`);
    },

    async getAchievements() {
        return httpClient('/stats/achievements');
    }
};

// Settings API
const SettingsAPI = {
    async getSettings() {
        return httpClient('/settings');
    },

    async updateSettings(settings) {
        return httpClient('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },

    async updatePassword(passwordData) {
        return httpClient('/settings/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }
};

// Realtime Status (WebSocket/SSE)
const StatusAPI = {
    subscribeToOnlineStatus(callback) {
        const eventSource = new EventSource(`${API_BASE_URL}/status/online`, {
            withCredentials: true
        });
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                callback(data);
            } catch (e) {
                console.error('Status parse error:', e);
            }
        };

        eventSource.onerror = () => {
            console.warn('Status connection error');
        };

        return () => eventSource.close();
    }
};

// Export all APIs
window.ReadFlowAPI = {
    Auth: AuthAPI,
    Books: BooksAPI,
    ReadingSessions: ReadingSessionAPI,
    Friends: FriendsAPI,
    Groups: GroupsAPI,
    Stats: StatsAPI,
    Settings: SettingsAPI,
    Status: StatusAPI,
    httpClient,
    getToken,
    setToken,
    removeToken
};
