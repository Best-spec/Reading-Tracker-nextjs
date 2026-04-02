import { LoginCredentials, RegisterData } from '@/types/auth'
import { UpdatePasswordData } from '@/types/settings'

// Export all feature-based API modules
export { authApi } from './api/auth'
export { userApi } from './api/user'
export { booksApi } from './api/books'
export { sessionsApi } from './api/sessions'
export { statsApi } from './api/stats'
export { friendsApi } from './api/friends'
export { groupsApi } from './api/groups'
export { calendarApi } from './api/calendar'
export { challengesApi } from './api/challenges'
export { achievementsApi } from './api/achievements'
export { settingsApi } from './api/settings'

// Export the base request function for direct use if needed
export { request } from './api/base'

// Legacy export for backward compatibility
export const api = {
  // Authentication
  register: (userData: RegisterData) => 
    import('./api/auth').then(m => m.authApi.register(userData)),
  login: (credentials: LoginCredentials) => 
    import('./api/auth').then(m => m.authApi.login(credentials)),
  verifyToken: (token: string) => 
    import('./api/auth').then(m => m.authApi.verifyToken(token)),
  checkAuth: () => 
    import('./api/auth').then(m => m.authApi.checkAuth()),

  // User profile
  getProfile: () => 
    import('./api/user').then(m => m.userApi.getProfile()),
  updateProfile: (profileData: any) => 
    import('./api/user').then(m => m.userApi.updateProfile(profileData)),

  // Books
  getBooks: () => 
    import('./api/books').then(m => m.booksApi.getBooks()),
  createBook: (bookData: any) => 
    import('./api/books').then(m => m.booksApi.createBook(bookData)),
  updateBook: (bookId: string, bookData: any) => 
    import('./api/books').then(m => m.booksApi.updateBook(bookId, bookData)),
  deleteBook: (bookId: string) => 
    import('./api/books').then(m => m.booksApi.deleteBook(bookId)),
  updateProgress: (bookId: string, currentPage: number, status?: string) => 
    import('./api/books').then(m => m.booksApi.updateProgress(bookId, currentPage, status)),
  addBookSection: (bookId: string, sectionData: any) => 
    import('./api/books').then(m => m.booksApi.addBookSection(bookId, sectionData)),

  // Reading sessions
  getReadingSessions: () => 
    import('./api/sessions').then(m => m.sessionsApi.getReadingSessions()),
  getActiveSession: () => 
    import('./api/sessions').then(m => m.sessionsApi.getActiveSession()),
  startSession: (sessionData: { bookId: string, section?: string }) => 
    import('./api/sessions').then(m => m.sessionsApi.startSession(sessionData)),
  stopSession: (sessionData: { sessionId: string; pagesRead: number }) => 
    import('./api/sessions').then(m => m.sessionsApi.stopSession(sessionData)),

  // Statistics
  getStats: () => 
    import('./api/stats').then(m => m.statsApi.getStats()),
  getReadingStats: (period: string = 'month') => 
    import('./api/stats').then(m => m.statsApi.getReadingStats(period)),

  // Friends
  getFriends: () => 
    import('./api/friends').then(m => m.friendsApi.getFriends()),
  searchFriends: (query: string) => 
    import('./api/friends').then(m => m.friendsApi.searchFriends(query)),
  sendFriendRequest: (friendId: string) => 
    import('./api/friends').then(m => m.friendsApi.sendFriendRequest(friendId)),
  acceptFriendRequest: (requestId: string) => 
    import('./api/friends').then(m => m.friendsApi.acceptFriendRequest(requestId)),
  rejectFriendRequest: (requestId: string) => 
    import('./api/friends').then(m => m.friendsApi.rejectFriendRequest(requestId)),
  getFriendActivity: () => 
    import('./api/friends').then(m => m.friendsApi.getActivity()),

  // Groups
  getGroups: () => 
    import('./api/groups').then(m => m.groupsApi.getGroups()),
  createGroup: (groupData: any) => 
    import('./api/groups').then(m => m.groupsApi.createGroup(groupData)),
  joinGroup: (groupId: string) => 
    import('./api/groups').then(m => m.groupsApi.joinGroup(groupId)),
  leaveGroup: (groupId: string) => 
    import('./api/groups').then(m => m.groupsApi.leaveGroup(groupId)),
  getGroupDetails: (groupId: string) => 
    import('./api/groups').then(m => m.groupsApi.getGroupDetails(groupId)),

  // Calendar
  getCalendarData: (year: number, month: number) => 
    import('./api/calendar').then(m => m.calendarApi.getCalendarData(year, month)),
  updateCalendarEntry: (date: string, data: any) => 
    import('./api/calendar').then(m => m.calendarApi.updateCalendarEntry(date, data)),

  // Challenges
  getChallenges: () => 
    import('./api/challenges').then(m => m.challengesApi.getChallenges()),
  createChallenge: (challengeData: any) => 
    import('./api/challenges').then(m => m.challengesApi.createChallenge(challengeData)),
  updateChallengeProgress: (challengeId: string, progress: any) => 
    import('./api/challenges').then(m => m.challengesApi.updateChallengeProgress(challengeId, progress)),

  // Achievements
  getAchievements: () => 
    import('./api/achievements').then(m => m.achievementsApi.getAchievements()),
  unlockAchievement: (achievementId: string) => 
    import('./api/achievements').then(m => m.achievementsApi.unlockAchievement(achievementId)),

  // Settings
  getSettings: () => 
    import('./api/settings').then(m => m.settingsApi.getSettings()),
  updateSettings: (settingsData: any) => 
    import('./api/settings').then(m => m.settingsApi.updateSettings(settingsData)),
  updatePassword: (passwordData: UpdatePasswordData) => 
    import('./api/settings').then(m => m.settingsApi.updatePassword(passwordData))
}
