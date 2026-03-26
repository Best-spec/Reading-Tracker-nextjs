/**
 * Settings Page JavaScript
 * Handles user profile, password, and preference settings
 */

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    lucide.createIcons();
});

// Load current settings
async function loadSettings() {
    try {
        const profile = await ReadFlowAPI.Auth.getProfile();
        const settings = await ReadFlowAPI.Settings.getSettings();
        
        // Populate profile fields
        if (profile) {
            document.getElementById('display-name').value = profile.displayName || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('bio').value = profile.bio || '';
        }
        
        // Populate settings fields
        if (settings) {
            document.getElementById('daily-goal').value = settings.dailyGoal || 1;
            document.getElementById('reading-reminders').checked = settings.readingReminders || false;
            document.getElementById('public-profile').checked = settings.publicProfile || false;
            document.getElementById('email-notifications').checked = settings.emailNotifications || false;
            document.getElementById('friend-requests').checked = settings.friendRequests || true;
            document.getElementById('group-invites').checked = settings.groupInvites || true;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดการตั้งค่า', 'error');
    }
}

// Update profile
async function updateProfile() {
    const displayName = document.getElementById('display-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const bio = document.getElementById('bio').value.trim();
    
    if (!displayName || !email) {
        showNotification('กรุณากรอกชื่อและอีเมล', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('รูปแบบอีเมลไม่ถูกต้อง', 'error');
        return;
    }
    
    try {
        await ReadFlowAPI.Auth.updateProfile({ displayName, email, bio });
        showNotification('อัปเดตโปรไฟล์สำเร็จ', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์', 'error');
    }
}

// Update password
async function updatePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('กรุณากรอกข้อมูลรหัสผ่านให้ครบ', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน', 'error');
        return;
    }
    
    try {
        await ReadFlowAPI.Settings.updatePassword({
            currentPassword,
            newPassword
        });
        
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        showNotification('อัปเดตรหัสผ่านสำเร็จ', 'success');
    } catch (error) {
        console.error('Error updating password:', error);
        showNotification('เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน', 'error');
    }
}

// Update reading preferences
async function updatePreferences() {
    const dailyGoal = parseInt(document.getElementById('daily-goal').value);
    const readingReminders = document.getElementById('reading-reminders').checked;
    const publicProfile = document.getElementById('public-profile').checked;
    
    if (!dailyGoal || dailyGoal < 1 || dailyGoal > 24) {
        showNotification('เป้าหมายการอ่านต่อวันต้องอยู่ระหว่าง 1-24 ชั่วโมง', 'error');
        return;
    }
    
    try {
        await ReadFlowAPI.Settings.updateSettings({
            dailyGoal,
            readingReminders,
            publicProfile
        });
        showNotification('อัปเดตค่ากำหนดการอ่านสำเร็จ', 'success');
    } catch (error) {
        console.error('Error updating preferences:', error);
        showNotification('เกิดข้อผิดพลาดในการอัปเดตค่ากำหนด', 'error');
    }
}

// Update notification settings
async function updateNotifications() {
    const emailNotifications = document.getElementById('email-notifications').checked;
    const friendRequests = document.getElementById('friend-requests').checked;
    const groupInvites = document.getElementById('group-invites').checked;
    
    try {
        await ReadFlowAPI.Settings.updateSettings({
            emailNotifications,
            friendRequests,
            groupInvites
        });
        showNotification('อัปเดตการแจ้งเตือนสำเร็จ', 'success');
    } catch (error) {
        console.error('Error updating notifications:', error);
        showNotification('เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน', 'error');
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
