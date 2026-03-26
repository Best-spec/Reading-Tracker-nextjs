// Test script for ReadFlow APIs
// Run this after starting the server with: npm run dev

const BASE_URL = 'http://localhost:3000/api';

// Store tokens and IDs for testing
let authToken = '';
let userId = '';
let bookId = '';
let groupId = '';

// Helper function for API calls
async function apiCall(method, endpoint, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json().catch(() => null);
        return { status: response.status, data };
    } catch (error) {
        return { status: 0, error: error.message };
    }
}

// Test Auth APIs
async function testAuth() {
    console.log('\n=== Testing Auth APIs ===');
    
    const testEmail = 'test_' + Date.now() + '@example.com';
    const testPassword = 'password123';
    
    // Register
    console.log('\n1. Testing Register...');
    const registerResult = await apiCall('POST', '/auth/register', {
        username: 'testuser_' + Date.now(),
        email: testEmail,
        password: testPassword
    });
    console.log('Register:', registerResult.status === 201 ? '✅ PASS' : '❌ FAIL', registerResult);
    
    // Login
    console.log('\n2. Testing Login...');
    const loginResult = await apiCall('POST', '/auth/login', {
        email: testEmail,
        password: testPassword
    });
    console.log('Login:', loginResult.status === 200 ? '✅ PASS' : '❌ FAIL', loginResult);
    
    if (loginResult.data?.token || loginResult.status === 200) {
        authToken = loginResult.data?.token || 'dummy-token';
        userId = loginResult.data?.user?.id;
    }
}

// Test Book APIs
async function testBooks() {
    console.log('\n=== Testing Book APIs ===');
    
    // Create Book
    console.log('\n3. Testing Create Book...');
    const createResult = await apiCall('POST', '/books', {
        title: 'Test Book ' + Date.now(),
        author: 'Test Author',
        totalPages: 300
    }, authToken);
    console.log('Create Book:', createResult.status === 201 ? '✅ PASS' : '❌ FAIL', createResult);
    
    if (createResult.data?.id) {
        bookId = createResult.data.id;
    }
    
    // Get All Books
    console.log('\n4. Testing Get All Books...');
    const getAllResult = await apiCall('GET', '/books', null, authToken);
    console.log('Get All Books:', getAllResult.status === 200 ? '✅ PASS' : '❌ FAIL', getAllResult);
    
    // Get Book by ID
    if (bookId) {
        console.log('\n5. Testing Get Book by ID...');
        const getByIdResult = await apiCall('GET', `/books/${bookId}`, null, authToken);
        console.log('Get Book by ID:', getByIdResult.status === 200 ? '✅ PASS' : '❌ FAIL', getByIdResult);
        
        // Update Book
        console.log('\n6. Testing Update Book...');
        const updateResult = await apiCall('PUT', `/books/${bookId}`, {
            title: 'Updated Test Book',
            author: 'Updated Author',
            totalPages: 350
        }, authToken);
        console.log('Update Book:', updateResult.status === 200 ? '✅ PASS' : '❌ FAIL', updateResult);
    }
}

// Test Dashboard APIs
async function testDashboard() {
    console.log('\n=== Testing Dashboard APIs ===');
    
    // Get Dashboard Summary
    console.log('\n7. Testing Dashboard Summary...');
    const summaryResult = await apiCall('GET', '/dashboard/summary', null, authToken);
    console.log('Dashboard Summary:', summaryResult.status === 200 ? '✅ PASS' : '❌ FAIL', summaryResult);
    
    // Get Reading Trend
    console.log('\n8. Testing Reading Trend...');
    const trendResult = await apiCall('GET', '/dashboard/trend', null, authToken);
    console.log('Reading Trend:', trendResult.status === 200 ? '✅ PASS' : '❌ FAIL', trendResult);
    
    // Get Top Books
    console.log('\n9. Testing Top Books...');
    const topBooksResult = await apiCall('GET', '/dashboard/top-books', null, authToken);
    console.log('Top Books:', topBooksResult.status === 200 ? '✅ PASS' : '❌ FAIL', topBooksResult);
}

// Test Friend APIs
async function testFriends() {
    console.log('\n=== Testing Friend APIs ===');
    
    // Get Friends List
    console.log('\n10. Testing Get Friends...');
    const friendsResult = await apiCall('GET', '/friends', null, authToken);
    console.log('Get Friends:', friendsResult.status === 200 ? '✅ PASS' : '❌ FAIL', friendsResult);
    
    // Get Online Friends
    console.log('\n11. Testing Get Online Friends...');
    const onlineFriendsResult = await apiCall('GET', '/friends/online', null, authToken);
    console.log('Get Online Friends:', onlineFriendsResult.status === 200 ? '✅ PASS' : '❌ FAIL', onlineFriendsResult);
    
    // Get Pending Requests
    console.log('\n12. Testing Get Pending Requests...');
    const pendingResult = await apiCall('GET', '/friends/requests/pending', null, authToken);
    console.log('Get Pending Requests:', pendingResult.status === 200 ? '✅ PASS' : '❌ FAIL', pendingResult);
}

// Test Group APIs
async function testGroups() {
    console.log('\n=== Testing Group APIs ===');
    
    // Create Group
    console.log('\n13. Testing Create Group...');
    const createGroupResult = await apiCall('POST', '/groups', {
        name: 'Test Group ' + Date.now(),
        description: 'Test Description'
    }, authToken);
    console.log('Create Group:', createGroupResult.status === 201 ? '✅ PASS' : '❌ FAIL', createGroupResult);
    
    if (createGroupResult.data?.id) {
        groupId = createGroupResult.data.id;
    }
    
    // Get User Groups
    console.log('\n14. Testing Get User Groups...');
    const getGroupsResult = await apiCall('GET', '/groups', null, authToken);
    console.log('Get User Groups:', getGroupsResult.status === 200 ? '✅ PASS' : '❌ FAIL', getGroupsResult);
    
    if (groupId) {
        // Get Group by ID
        console.log('\n15. Testing Get Group by ID...');
        const getGroupResult = await apiCall('GET', `/groups/${groupId}`, null, authToken);
        console.log('Get Group by ID:', getGroupResult.status === 200 ? '✅ PASS' : '❌ FAIL', getGroupResult);
        
        // Get Group Members
        console.log('\n16. Testing Get Group Members...');
        const membersResult = await apiCall('GET', `/groups/${groupId}/members`, null, authToken);
        console.log('Get Group Members:', membersResult.status === 200 ? '✅ PASS' : '❌ FAIL', membersResult);
    }
}

// Test Reading Session APIs
async function testReadingSessions() {
    console.log('\n=== Testing Reading Session APIs ===');
    
    if (!bookId) {
        console.log('⚠️ Skipping reading session tests - no book created');
        return;
    }
    
    // Start Reading Session
    console.log('\n17. Testing Start Reading Session...');
    const startResult = await apiCall('POST', '/reading-sessions/start', {
        bookId: bookId
    }, authToken);
    console.log('Start Reading Session:', startResult.status === 201 ? '✅ PASS' : '❌ FAIL', startResult);
    
    // Get Active Session
    console.log('\n18. Testing Get Active Session...');
    const activeResult = await apiCall('GET', '/reading-sessions/active', null, authToken);
    console.log('Get Active Session:', activeResult.status === 200 ? '✅ PASS' : '❌ FAIL', activeResult);
    
    // Get Reading History
    console.log('\n19. Testing Get Reading History...');
    const historyResult = await apiCall('GET', '/reading-sessions/history', null, authToken);
    console.log('Get Reading History:', historyResult.status === 200 ? '✅ PASS' : '❌ FAIL', historyResult);
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting ReadFlow API Tests...');
    console.log('=====================================');
    
    try {
        await testAuth();
        await testBooks();
        await testDashboard();
        await testFriends();
        await testGroups();
        await testReadingSessions();
        
        console.log('\n=====================================');
        console.log('✅ All API Tests Completed!');
        console.log('\nNext Steps:');
        console.log('- Check server logs for detailed information');
        console.log('- Verify data in database');
        console.log('- Fix any failed tests');
    } catch (error) {
        console.error('\n❌ Test suite failed:', error);
    }
}

// Run tests
runAllTests();
