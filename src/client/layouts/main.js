/**
 * ReadFlow Layout Manager
 * Handles sidebar navigation, header, and common layout elements
 */

const Layout = {
    // Navigation menu items
    menuItems: [
        { icon: 'layout-dashboard', label: 'Dashboard', href: 'Home.html', id: 'dashboard' },
        { icon: 'library', label: 'My Books', href: 'Books.html', id: 'books' },
        { icon: 'clock', label: 'Reading Timer', href: 'Timer.html', id: 'timer' },
        { icon: 'bar-chart-2', label: 'Statistics', href: 'Stats.html', id: 'stats' },
        { icon: 'calendar', label: 'Calendar', href: 'Calendar.html', id: 'calendar' },
        { icon: 'users', label: 'Friends', href: 'Friends.html', id: 'friends' },
        { icon: 'users-round', label: 'Groups', href: 'Groups.html', id: 'groups' },
        { icon: 'user', label: 'Profile', href: 'Profile.html', id: 'profile' },
        { icon: 'settings', label: 'Settings', href: 'Settings.html', id: 'settings' }
    ],

    /**
     * Initialize the layout
     * @param {string} activePage - ID of the active page
     */
    init(activePage = '') {
        this.renderSidebar(activePage);
        this.renderHeader();
        this.setupEventListeners();
        this.updateOnlineStatus();
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    /**
     * Render the sidebar navigation
     */
    renderSidebar(activePage) {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const currentPath = window.location.pathname.split('/').pop() || activePage;
        
        const navHTML = this.menuItems.map(item => {
            const isActive = currentPath.includes(item.href) || currentPath === item.id + '.html';
            return `
                <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}" data-id="${item.id}">
                    <i data-lucide="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `;
        }).join('');

        sidebar.innerHTML = `
            <div class="logo-area">
                <div class="logo-icon">
                    <i data-lucide="book-open"></i>
                </div>
                <span class="logo-text">ReadFlow</span>
            </div>
            <nav class="nav-menu">
                ${navHTML}
            </nav>
            <div class="status-badge">
                <div id="online-status" class="online-pill">
                    <i data-lucide="wifi"></i>
                    <span>Online</span>
                </div>
            </div>
        `;
    },

    /**
     * Render the header with user info
     */
    renderHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        const profile = this.getStoredProfile();
        
        header.innerHTML = `
            <div class="header-content">
                <h1 class="page-title" id="page-title">${document.title || 'ReadFlow'}</h1>
                <div class="header-actions">
                    <button class="icon-btn" id="notifications-btn" title="Notifications">
                        <i data-lucide="bell"></i>
                        <span class="notification-badge" id="notification-count" style="display: none;">0</span>
                    </button>
                    <div class="user-menu">
                        <div class="avatar-sm" id="header-avatar">
                            ${profile?.avatar ? 
                                `<img src="${profile.avatar}" alt="${profile.username}">` : 
                                `<i data-lucide="user"></i>`
                            }
                        </div>
                        <span class="username" id="header-username">${profile?.username || 'User'}</span>
                        <button class="icon-btn" id="user-menu-toggle">
                            <i data-lucide="chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="user-dropdown" style="display: none;">
                            <a href="Profile.html" class="dropdown-item">
                                <i data-lucide="user"></i>
                                <span>Profile</span>
                            </a>
                            <a href="Settings.html" class="dropdown-item">
                                <i data-lucide="settings"></i>
                                <span>Settings</span>
                            </a>
                            <hr class="dropdown-divider">
                            <button class="dropdown-item text-danger" id="logout-btn">
                                <i data-lucide="log-out"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Get stored profile from localStorage
     */
    getStoredProfile() {
        try {
            const profile = localStorage.getItem('readflow_profile');
            return profile ? JSON.parse(profile) : null;
        } catch (e) {
            return null;
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // User menu toggle
        const toggleBtn = document.getElementById('user-menu-toggle');
        const dropdown = document.getElementById('user-dropdown');
        
        if (toggleBtn && dropdown) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Network status
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
    },

    /**
     * Update online status indicator
     */
    updateOnlineStatus() {
        const statusEl = document.getElementById('online-status');
        if (!statusEl) return;

        const isOnline = navigator.onLine;
        statusEl.className = `online-pill ${isOnline ? 'online' : 'offline'}`;
        statusEl.innerHTML = `
            <i data-lucide="${isOnline ? 'wifi' : 'wifi-off'}"></i>
            <span>${isOnline ? 'Online' : 'Offline'}</span>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    /**
     * Handle logout
     */
    async handleLogout() {
        try {
            if (window.ReadFlowAPI) {
                await ReadFlowAPI.Auth.logout();
            }
        } catch (e) {
            console.error('Logout error:', e);
        }
        
        // Clear local storage
        localStorage.removeItem('readflow_token');
        localStorage.removeItem('readflow_profile');
        
        // Redirect to login
        window.location.href = 'Login.html';
    },

    /**
     * Set page title
     */
    setTitle(title) {
        document.title = `${title} | ReadFlow`;
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = title;
        }
    },

    /**
     * Show loading state
     */
    showLoading(containerId = 'main-content') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
        }
    },

    /**
     * Show error state
     */
    showError(message, containerId = 'main-content') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i data-lucide="alert-circle"></i>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                </div>
            `;
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    },

    /**
     * Show empty state
     */
    showEmpty(title, description, action = null) {
        return `
            <div class="empty-state">
                <i data-lucide="inbox"></i>
                <h3>${title}</h3>
                <p>${description}</p>
                ${action ? `<button class="btn btn-primary" onclick="${action.onClick}">${action.text}</button>` : ''}
            </div>
        `;
    }
};

// Auto-initialize layout on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    const token = localStorage.getItem('readflow_token');
    const isAuthPage = ['Login.html', 'Register.html'].some(page => 
        window.location.pathname.includes(page)
    );

    if (!token && !isAuthPage) {
        window.location.href = 'Login.html';
        return;
    }

    Layout.init();
});

// Export for global use
window.ReadFlowLayout = Layout;
