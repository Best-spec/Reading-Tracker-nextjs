import { request } from './base'

export const groupsApi = {
  async getGroups() {
    return await request('/api/groups')
  },

  async createGroup(groupData: any) {
    return await request('/api/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    })
  },

  async joinGroup(groupId: string) {
    return await request(`/api/groups/${groupId}/join`, {
      method: 'POST',
    })
  },

  async leaveGroup(groupId: string) {
    return await request(`/api/groups/${groupId}/leave`, {
      method: 'POST',
    })
  },

  async getGroupDetails(groupId: string) {
    return await request(`/api/groups/${groupId}`)
  }
}
