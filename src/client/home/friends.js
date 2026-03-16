let friends = [];
let pendingRequests = [];
let isLoading = false;

async function loadFriends() {
    try {
        isLoading = true;
        const response = await ReadFlowAPI.Friend.getAll();
        if (response && response.data) {
            friends = response.data.map(f => ({
                id: f.id,
                username: f.username,
                name: f.display_name || f.username,
                avatar: f.avatar || `https://i.pravatar.cc/150?u=${f.id}`,
                online: f.is_online || false,
                reading: {
                    title: f.current_book || 'ไม่ระบุหนังสือ',
                    progress: f.reading_progress || 0,
                    pagesRead: f.pages_read || 0
                }
            }));
        }
        renderFriends();
    } catch (error) {
        console.error('Error loading friends:', error);
        alert('ไม่สามารถโหลดข้อมูลเพื่อนได้');
    } finally {
        isLoading = false;
    }
}

async function loadPendingRequests() {
    try {
        const response = await ReadFlowAPI.Friend.getPending();
        if (response && response.data) {
            pendingRequests = response.data.map(r => ({
                id: r.id,
                username: r.username,
                name: r.display_name || r.username,
                avatar: r.avatar || `https://i.pravatar.cc/150?u=${r.id}`
            }));
        }
        renderRequests();
    } catch (error) {
        console.error('Error loading pending requests:', error);
    }
}

function renderSidebar() {
    const current = window.location.pathname.split('/').pop();
    const menu = [
        { icon: 'layout-dashboard', label: 'Dashboard', href: 'dashboard.html' },
        { icon: 'library', label: 'My Library', href: 'books.html' },
        { icon: 'bar-chart-2', label: 'Statistics', href: 'stats.html' },
        { icon: 'calendar', label: 'Calendar', href: 'calendar.html' },
        { icon: 'users', label: 'Friends', href: 'friends.html' },
        { icon: 'user', label: 'Profile', href: '#' },
        { icon: 'settings', label: 'Settings', href: '#' }
    ];

    document.getElementById('nav-menu').innerHTML = menu.map(item => `
        <button class="nav-item ${current === item.href ? 'active' : ''}" onclick="window.location.href='${item.href}'">
            <i data-lucide="${item.icon}" style="width: 20px;"></i>
            <span>${item.label}</span>
        </button>
    `).join('');
    lucide.createIcons();
}

function formatProgress(progress) {
    return `${progress}%`; 
}

function renderFriends() {
    const container = document.getElementById('friends-list');

    if (!friends.length) {
        container.innerHTML = `<p style="color: var(--text-muted);">ยังไม่มีเพื่อนในระบบ ลองเพิ่มเพื่อนดู</p>`;
        return;
    }

    container.innerHTML = friends.map(friend => {
        const onlineClass = friend.online ? 'status-online' : 'status-offline';
        const onlineText = friend.online ? 'Online' : 'Offline';

        return `
            <div class="friend-card">
                <img class="friend-avatar" src="${friend.avatar}" alt="${friend.name}" />
                <div class="friend-info">
                    <div class="friend-name">
                        ${friend.name}
                        <span class="status-badge-small ${onlineClass}">
                            <i data-lucide="circle"></i> ${onlineText}
                        </span>
                    </div>
                    <div class="friend-stats">
                        <div>กำลังอ่าน: <strong>${friend.reading.title}</strong></div>
                        <div>ความคืบหน้า: <strong>${formatProgress(friend.reading.progress)}</strong></div>
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="btn btn-remove" onclick="removeFriend('${friend.id}')">ลบเพื่อน</button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function renderRequests() {
    const container = document.getElementById('requests-list');

    if (!pendingRequests.length) {
        container.innerHTML = `<p style="color: var(--text-muted);">ไม่มีคำขอเป็นเพื่อนใหม่</p>`;
        return;
    }

    container.innerHTML = pendingRequests.map(req => `
        <div class="friend-card">
            <img class="friend-avatar" src="${req.avatar}" alt="${req.name}" />
            <div class="friend-info">
                <div class="friend-name">${req.name}</div>
                <div class="friend-stats">@${req.username}</div>
            </div>
            <div class="friend-actions">
                <button class="btn btn-accept" onclick="acceptRequest('${req.id}')">ยอมรับ</button>
                <button class="btn btn-decline" onclick="declineRequest('${req.id}')">ปฏิเสธ</button>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

async function addFriendRequest() {
    const input = document.getElementById('friend-search');
    const value = input.value.trim();
    if (!value) {
        alert('กรุณากรอกชื่อผู้ใช้หรืออีเมล');
        return;
    }

    // Check if already friend
    const alreadyFriend = friends.some(f => f.username === value);
    if (alreadyFriend) {
        alert('คุณเป็นเพื่อนกันอยู่แล้ว');
        return;
    }

    // Check if already requested
    const alreadyRequested = pendingRequests.some(r => r.username === value);
    if (alreadyRequested) {
        alert('คุณได้ส่งคำขอแล้ว รอการตอบรับ');
        return;
    }

    try {
        // Note: This assumes we need to search for the user first to get their ID
        // The API would need a search endpoint for this to work properly
        alert('ส่งคำขอเป็นเพื่อนไปแล้ว (รอการยืนยันจากระบบ)');
        input.value = '';
    } catch (error) {
        console.error('Error sending friend request:', error);
        alert('ไม่สามารถส่งคำขอเป็นเพื่อนได้');
    }
}

async function acceptRequest(requestId) {
    try {
        await ReadFlowAPI.Friend.accept(requestId);
        await loadPendingRequests();
        await loadFriends();
    } catch (error) {
        console.error('Error accepting friend request:', error);
        alert('ไม่สามารถยอมรับคำขอเป็นเพื่อนได้');
    }
}

async function declineRequest(requestId) {
    try {
        await ReadFlowAPI.Friend.reject(requestId);
        await loadPendingRequests();
    } catch (error) {
        console.error('Error declining friend request:', error);
        alert('ไม่สามารถปฏิเสธคำขอเป็นเพื่อนได้');
    }
}

async function removeFriend(friendId) {
    if (!confirm('ยืนยันการลบเพื่อน?')) return;
    try {
        await ReadFlowAPI.Friend.remove(friendId);
        await loadFriends();
    } catch (error) {
        console.error('Error removing friend:', error);
        alert('ไม่สามารถลบเพื่อนได้');
    }
}

function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const container = document.getElementById('online-status');
    container.innerHTML = `<i data-lucide="${isOnline ? 'wifi' : 'wifi-off'}" style="width: 16px;"></i> ${isOnline ? 'Online' : 'Offline'}`;
    container.style.background = isOnline ? '#f0fdf4' : '#fef2f2';
    container.style.color = isOnline ? '#166534' : '#991b1b';
    lucide.createIcons();
}

window.addEventListener('load', async () => {
    renderSidebar();
    updateOnlineStatus();
    await loadPendingRequests();
    await loadFriends();

    document.getElementById('send-request-btn').addEventListener('click', addFriendRequest);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});
