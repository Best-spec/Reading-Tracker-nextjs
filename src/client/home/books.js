// --- Data Logic ---
let books = [];
let isLoading = false;

async function loadBooks() {
    try {
        isLoading = true;
        const data = await ReadFlowAPI.Book.getAll();
        books = data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            totalPages: book.total_pages,
            readPages: book.current_page || 0,
            cover: book.cover_url || 'https://via.placeholder.com/70x100?text=No+Cover',
            readMinutes: book.reading_time || 0,
            status: book.status
        }));
        renderBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        alert('ไม่สามารถโหลดข้อมูลหนังสือได้');
    } finally {
        isLoading = false;
    }
}

// Fallback data for offline mode
function getFallbackBooks() {
    return [
        { id: 1, title: "The Psychology of Money", author: "Morgan Housel", totalPages: 300, readPages: 150, cover: "https://images.unsplash.com/photo-1592492159418-39f319320569?w=200&h=300&fit=crop", readMinutes: 180, status: 'READING' },
        { id: 2, title: "Deep Work", author: "Cal Newport", totalPages: 280, readPages: 238, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=300&fit=crop", readMinutes: 220, status: 'READING' }
    ];
}

// --- Sidebar ---
function renderSidebar() {
    const current = window.location.pathname.split('/').pop();
    const menu = [
        { icon: 'layout-dashboard', label: 'Dashboard', href: 'dashboard.html' },
        { icon: 'library', label: 'My Library', href: 'books.html' },
        { icon: 'bar-chart-2', label: 'Statistics', href: 'stats.html' },
        { icon: 'calendar', label: 'Calendar', href: 'calendar.html' },
        { icon: 'users', label: 'Groups', href: 'groups.html' },
        { icon: 'users', label: 'Friends', href: 'friends.html' },
        { icon: 'user', label: 'Profile', href: 'profile.html' },
        { icon: 'settings', label: 'Settings', href: 'settings.html' }
    ];

    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) {
        console.error('nav-menu element not found');
        return;
    }
    navMenu.innerHTML = menu.map(item => `
        <button class="nav-item ${current === item.href ? 'active' : ''}" onclick="window.location.href='${item.href}'">
            <i data-lucide="${item.icon}" style="width: 20px;"></i>
            <span>${item.label}</span>
        </button>
    `).join('');
    lucide.createIcons();
}

// --- Render function ---
function renderBooks() {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = books.map(book => {
        const progress = Math.round((book.readPages / book.totalPages) * 100);
        return `
            <div class="book-card">
                <div class="book-info-row">
                    <img src="${book.cover || 'https://via.placeholder.com/70x100?text=No+Cover'}" class="book-cover">
                    <div class="book-details">
                        <h3 title="${book.title}">${book.title}</h3>
                        <p>${book.author || 'ไม่ระบุผู้เขียน'}</p>
                    </div>
                </div>
                
                <div style="margin-top: 0.5rem;">
                    <div class="progress-stats">
                        <span>ความคืบหน้า</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-muted); text-align: right;">
                        ${book.readPages} / ${book.totalPages} หน้า
                    </p>
                </div>

                <div class="card-actions">
                    <button class="btn btn-icon" onclick="editBook(${book.id})" title="แก้ไข">
                        <i data-lucide="edit-2" style="width:16px;"></i>
                    </button>
                    <button class="btn btn-icon btn-delete" onclick="deleteBook(${book.id})" title="ลบ">
                        <i data-lucide="trash-2" style="width:16px;"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}

// --- CRUD Operations ---
function openModal(bookId = null) {
    const modal = document.getElementById('book-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('book-form');
    form.reset();
    
    if (bookId) {
        const book = books.find(b => b.id === bookId);
        title.innerText = "แก้ไขข้อมูลหนังสือ";
        document.getElementById('edit-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('total-pages').value = book.totalPages;
        document.getElementById('read-pages').value = book.readPages;
        document.getElementById('cover-url').value = book.cover;
    } else {
        title.innerText = "เพิ่มหนังสือใหม่";
        document.getElementById('edit-id').value = "";
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        totalPages: parseInt(document.getElementById('total-pages').value),
        current_page: parseInt(document.getElementById('read-pages').value),
        coverUrl: document.getElementById('cover-url').value
    };

    try {
        if (id) {
            // Update via API
            await ReadFlowAPI.Book.update(id, bookData);
        } else {
            // Create via API
            await ReadFlowAPI.Book.create(bookData);
        }
        closeModal();
        await loadBooks();
    } catch (error) {
        console.error('Error saving book:', error);
        alert('ไม่สามารถบันทึกข้อมูลหนังสือได้');
    }
});

function editBook(id) {
    openModal(id);
}

async function deleteBook(id) {
    if (confirm('จะลบหนังสือเล่มนี้จริงๆ เหรอ?')) {
        try {
            await ReadFlowAPI.Book.delete(id);
            await loadBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('ไม่สามารถลบหนังสือได้');
        }
    }
}

// --- Timer Functions ---
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

function toggleTimer() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    if (!isTimerRunning) {
        isTimerRunning = true;
        startBtn.innerHTML = '<i data-lucide="pause"></i> Pause';
        startBtn.classList.remove('btn-success');
        startBtn.classList.add('btn-warning');
        stopBtn.disabled = false;
        lucide.createIcons();
        
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    const startBtn = document.getElementById('start-btn');
    startBtn.innerHTML = '<i data-lucide="play"></i> Resume';
    startBtn.classList.remove('btn-warning');
    startBtn.classList.add('btn-success');
    lucide.createIcons();
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    timerSeconds = 0;
    updateTimerDisplay();
    
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    startBtn.innerHTML = '<i data-lucide="play"></i> Start';
    startBtn.classList.remove('btn-warning');
    startBtn.classList.add('btn-success');
    stopBtn.disabled = true;
    lucide.createIcons();
}

function resetTimer() {
    timerSeconds = 0;
    updateTimerDisplay();
    if (isTimerRunning) {
        pauseTimer();
    }
}

function updateTimerDisplay() {
    const hrs = Math.floor(timerSeconds / 3600);
    const mins = Math.floor((timerSeconds % 3600) / 60);
    const secs = timerSeconds % 60;
    document.getElementById('time-display').innerText = 
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// --- Page Switch Function ---
function switchPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
    
    document.getElementById(`section-${page}`).classList.add('active');
    document.getElementById(`tab-${page}`).classList.add('active');
    lucide.createIcons();
}

// --- Init ---
window.onload = async () => {
    renderSidebar();
    await loadBooks();
    lucide.createIcons();
};
