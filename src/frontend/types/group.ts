import { User } from './user'

export interface Group {
  id: string
  name: string
  description?: string
  avatar?: string
  memberCount: number
  isPrivate: boolean
  members?: User[]
  createdAt: string
  adminId: string
}

export interface GroupFormData {
  name: string
  description: string
  isPrivate: boolean
}

export interface GroupActivity {
  id: string
  groupId: string
  userId: string
  username: string
  type: 'JOIN' | 'READ' | 'FINISHED' | 'ACHIEVEMENT'
  content: string
  timestamp: string
}
