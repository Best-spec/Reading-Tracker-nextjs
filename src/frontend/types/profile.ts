export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar?: string;
  location?: string;
  website?: string;
  joinDate: string;
  isPublic: boolean;
  status?: string;
}

export interface ReadingStats {
  totalBooks: number;
  totalPages: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  favoriteGenre: string;
  averageRating: number;
}

export interface RecentBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'FINISHED' | 'READING' | 'TO_READ' | 'PLAN';
  rating?: number;
  finishedDate?: string;
  pagesRead: number;
  totalPages: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
}

export interface ProfileHook {
  user: UserProfile | null;
  stats: ReadingStats | null;
  recentBooks: RecentBook[];
  achievements: Achievement[];
  loading: boolean;
  isEditing: boolean;
  editForm: Partial<UserProfile>;
  setIsEditing: (editing: boolean) => void;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>;
  handleEditProfile: () => void;
  handleSaveProfile: () => Promise<void>;
}
