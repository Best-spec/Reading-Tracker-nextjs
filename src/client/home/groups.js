// --- Data from API ---
let groups = [];
let selectedGroupId = null;

async function loadGroups() {
    try {
        const data = await ReadFlowAPI.Group.getAll();
        groups = data.map(g => ({
            id: g.id,
            name: g.name,
            description: g.description || 'ไม่มีคำอธิบาย',
            joinCode: g.join_code || '',
            members: g.members?.map(m => ({
                name: m.user?.username || 'ผู้ใช้',
                minutes: m.total_minutes || 0
            })) || []
        }));
        renderGroups();
        renderGroupDetails();
    } catch (error) {
        console.error('Error loading groups:', error);
        alert('ไม่สามารถโหลดข้อมูลกลุ่มได้');
    }
}

function renderSidebar() {
    const current = window.location.pathname.split('/').pop();
    const menu = [
        { icon: 'layout-dashboard', label: 'Dashboard', href: 'dashboard.html' },
        { icon: 'library', label: 'My Library', href: 'books.html' },
        { icon: 'calendar', label: 'Calendar', href: 'calendar.html' },
        { icon: 'users', label: 'Groups', href: 'groups.html' },
        { icon: 'bar-chart-2', label: 'Statistics', href: 'stats.html' },
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

function formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const parts = [];
    if (hrs > 0) parts.push(`${hrs} ชม.`);
    if (mins > 0) parts.push(`${mins} นาที`);
    return parts.length ? parts.join(' ') : '0 นาที';
}

function getSelectedGroup() {
    return groups.find(g => g.id === selectedGroupId);
}

function renderGroups() {
    const filter = document.getElementById('search-groups')?.value?.toLowerCase?.() || '';
    const wrapper = document.getElementById('groups-list');
    wrapper.innerHTML = groups
        .filter(g => !filter || g.name.toLowerCase().includes(filter) || g.description.toLowerCase().includes(filter) || g.joinCode.toLowerCase().includes(filter))
        .map(group => {
            const totalMinutes = group.members.reduce((acc, cur) => acc + cur.minutes, 0);
            return `
                <div class="group-card ${group.id === selectedGroupId ? 'active' : ''}" onclick="selectGroup(${group.id})">
                    <div class="group-header">
                        <div class="group-name">${group.name}</div>
                        <span class="group-meta">${group.members.length} สมาชิก</span>
                    </div>
                    <div class="group-meta">รหัส: ${group.joinCode}</div>
                    <div class="group-meta">เวลารวม ${formatTime(totalMinutes)}</div>
                    <div class="group-stats">
                        <div class="group-stat"><span>เฉลี่ย/คน</span><span>${formatTime(Math.round(totalMinutes / Math.max(group.members.length, 1)))}</span></div>
                        <div class="group-stat"><span>สูงสุด</span><span>${formatTime(Math.max(...group.members.map(m => m.minutes)))}</span></div>
                    </div>
                </div>
            `;
        }).join('');
}

function selectGroup(id) {
    selectedGroupId = id;
    renderGroups();
    renderGroupDetails();
}

function renderGroupDetails() {
    const group = getSelectedGroup();
    const details = document.getElementById('details-content');
    const emptyState = document.getElementById('empty-state');

    if (!group) {
        details.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    details.style.display = 'block';

    document.getElementById('detail-group-name').innerText = group.name;
    document.getElementById('detail-group-desc').innerText = group.description;

    const totalMinutes = group.members.reduce((acc, cur) => acc + cur.minutes, 0);
    const avgMinutes = Math.round(totalMinutes / Math.max(group.members.length, 1));

    document.getElementById('total-reading').innerText = formatTime(totalMinutes);
    document.getElementById('avg-reading').innerText = `เฉลี่ย ${formatTime(avgMinutes)} ต่อสมาชิก`;
    document.getElementById('member-count').innerText = `${group.members.length} คน`;
    document.getElementById('group-code').innerText = `รหัสกลุ่ม: ${group.joinCode}`;

    const rows = group.members
        .slice()
        .sort((a, b) => b.minutes - a.minutes)
        .map((member, idx) => `
            <div class="leader-row">
                <span class="rank">#${idx + 1}</span>
                <span class="name">${member.name}</span>
                <span class="time">${formatTime(member.minutes)}</span>
            </div>
        `)
        .join('');

    document.getElementById('leaderboard-rows').innerHTML = rows;
}

function openCreateGroupModal() {
    document.getElementById('create-group-modal').style.display = 'flex';
    document.getElementById('create-group-form').reset();
}

function closeCreateGroupModal() {
    document.getElementById('create-group-modal').style.display = 'none';
}

function openJoinGroupModal() {
    document.getElementById('join-group-modal').style.display = 'flex';
    document.getElementById('join-group-form').reset();
}

function closeJoinGroupModal() {
    document.getElementById('join-group-modal').style.display = 'none';
}

function openInviteModal() {
    const group = getSelectedGroup();
    if (!group) return;
    const link = `${window.location.origin}${window.location.pathname}?join=${encodeURIComponent(group.joinCode)}`;
    document.getElementById('invite-link').value = link;
    document.getElementById('invite-modal').style.display = 'flex';
}

function closeInviteModal() {
    document.getElementById('invite-modal').style.display = 'none';
}

function copyInviteLink() {
    const linkInput = document.getElementById('invite-link');
    navigator.clipboard.writeText(linkInput.value).then(() => {
        alert('คัดลอกลิงก์เรียบร้อยแล้ว');
    }).catch(() => {
        alert('ไม่สามารถคัดลอกลิงก์ได้ลองอีกครั้ง');
    });
}

async function leaveGroupAPI() {
    if (!selectedGroupId) return;
    if (!confirm('ยืนยันการออกจากกลุ่ม?')) return;
    
    try {
        await ReadFlowAPI.Group.leave(selectedGroupId);
        selectedGroupId = null;
        await loadGroups();
    } catch (error) {
        console.error('Error leaving group:', error);
        alert('ไม่สามารถออกจากกลุ่มได้');
    }
}

async function createGroup(name, description) {
    try {
        await ReadFlowAPI.Group.create({ name, description });
        await loadGroups();
    } catch (error) {
        console.error('Error creating group:', error);
        alert('ไม่สามารถสร้างกลุ่มได้');
    }
}

function generateJoinCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

window.addEventListener('load', async () => {
    renderSidebar();
    await loadGroups();

    document.getElementById('search-groups').addEventListener('input', renderGroups);

    document.getElementById('create-group-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('group-name').value.trim();
        const desc = document.getElementById('group-desc').value.trim();
        await createGroup(name, desc || 'ไม่มีคำอธิบาย');
        selectedGroupId = groups[0]?.id || null;
        renderGroups();
        renderGroupDetails();
        closeCreateGroupModal();
    });

    document.getElementById('join-group-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const code = document.getElementById('join-code').value.trim().toUpperCase();
        // Note: Backend would need an endpoint to join by code
        alert('ฟีเจอร์เข้าร่วมกลุ่มด้วยรหัสยังไม่พร้อมใช้งาน');
        closeJoinGroupModal();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const joinCodeParam = urlParams.get('join');
    if (joinCodeParam) {
        document.getElementById('join-code').value = joinCodeParam;
        openJoinGroupModal();
    }
});
