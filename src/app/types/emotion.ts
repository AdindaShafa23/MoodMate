export interface EmotionEntry {
  id: string
  userId: string
  date: string
  emotion: EmotionType
  timestamp: string
  createdAt: string
}

export interface EmotionSummary {
  date: string
  emotions: {
    senang: number
    marah: number
    sedih: number
    takut: number
  }
  total: number
}

export interface DayEmotionData {
  date: string
  emotions: EmotionEntry[]
  emotionCounts: {
    senang: number
    marah: number
    sedih: number
    takut: number
  }
  total: number
}

export interface EmotionColor {
  r: number
  g: number
  b: number
}

export type EmotionType = "senang" | "marah" | "sedih" | "takut"

export interface EmotionState {
  [date: string]: DayEmotionData
}

// Helper function to convert DayEmotionData to EmotionSummary
export function dayDataToSummary(dayData: DayEmotionData): EmotionSummary {
  return {
    date: dayData.date,
    emotions: dayData.emotionCounts,
    total: dayData.total,
  }
}

// Helper function to convert EmotionSummary to DayEmotionData
export function summaryToDayData(summary: EmotionSummary): DayEmotionData {
  return {
    date: summary.date,
    emotions: [], // Empty array since summary doesn't have individual entries
    emotionCounts: summary.emotions,
    total: summary.total,
  }
}