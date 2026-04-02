export interface StatsData {
  totalSessions: number
  totalHours: number
  totalPages: number
  averagePerDay: number
  currentStreak: number
  longestStreak: number
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export type StatsPeriod = 'week' | 'month' | 'year'
