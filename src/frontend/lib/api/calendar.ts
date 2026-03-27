import { request } from './base'

export const calendarApi = {
  async getCalendarData(year: number, month: number) {
    return await request(`/api/calendar/${year}/${month}`)
  },

  async updateCalendarEntry(date: string, data: any) {
    return await request('/api/calendar', {
      method: 'POST',
      body: JSON.stringify({ date, ...data }),
    })
  }
}
