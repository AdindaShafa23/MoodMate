"use client"

import { useState, useCallback } from "react"
import type { EmotionState, DayEmotionData, EmotionEntry, EmotionType } from "../types/emotion"

export function useEmotionState() {
  const [emotionState, setEmotionState] = useState<EmotionState>({})
  const [loading, setLoading] = useState(false)

  // Add new emotion entry for a specific date
  const addEmotionEntry = useCallback((date: string, emotion: EmotionType) => {
    setEmotionState((prev) => {
      const dateKey = date
      const currentData = prev[dateKey] || {
        date,
        emotions: [],
        emotionCounts: { senang: 0, marah: 0, sedih: 0, takut: 0 },
        total: 0,
      }

      // Create new emotion entry
      const newEntry: EmotionEntry = {
        id: `${Date.now()}-${Math.random()}`,
        userId: "current-user", // Replace with actual user ID
        date,
        emotion,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }

      // Update emotion counts
      const updatedCounts = { ...currentData.emotionCounts }
      updatedCounts[emotion] += 1

      // Create updated day data
      const updatedData: DayEmotionData = {
        date,
        emotions: [...currentData.emotions, newEntry],
        emotionCounts: updatedCounts,
        total: currentData.total + 1,
      }

      return {
        ...prev,
        [dateKey]: updatedData,
      }
    })
  }, [])

  // Remove emotion entry
  const removeEmotionEntry = useCallback((date: string, entryId: string) => {
    setEmotionState((prev) => {
      const dateKey = date
      const currentData = prev[dateKey]

      if (!currentData) return prev

      const entryToRemove = currentData.emotions.find((e) => e.id === entryId)
      if (!entryToRemove) return prev

      // Update emotion counts
      const updatedCounts = { ...currentData.emotionCounts }
      updatedCounts[entryToRemove.emotion] -= 1

      // Filter out the removed entry
      const updatedEmotions = currentData.emotions.filter((e) => e.id !== entryId)

      // Create updated day data
      const updatedData: DayEmotionData = {
        date,
        emotions: updatedEmotions,
        emotionCounts: updatedCounts,
        total: currentData.total - 1,
      }

      // If no emotions left, remove the date entry
      if (updatedData.total === 0) {
        const { [dateKey]: removed, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [dateKey]: updatedData,
      }
    })
  }, [])

  // Get emotion data for a specific date
  const getEmotionData = useCallback(
    (date: string): DayEmotionData | undefined => {
      return emotionState[date]
    },
    [emotionState],
  )

  // Get all emotion data for a month
  const getMonthData = useCallback(
    (year: number, month: number): DayEmotionData[] => {
      const monthData: DayEmotionData[] = []

      for (let day = 1; day <= 31; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const dayData = emotionState[dateKey]

        if (dayData) {
          monthData.push(dayData)
        }
      }

      return monthData
    },
    [emotionState],
  )

  // Simulate real-time emotion input (for demo)
  const simulateEmotionInput = useCallback(
    (date: string, emotions: EmotionType[]) => {
      setLoading(true)

      emotions.forEach((emotion, index) => {
        setTimeout(() => {
          addEmotionEntry(date, emotion)
          if (index === emotions.length - 1) {
            setLoading(false)
          }
        }, index * 500) // Stagger the inputs to show real-time effect
      })
    },
    [addEmotionEntry],
  )

  // Load sample data for demonstration
  const loadSampleData = useCallback(() => {
    const today = new Date()
    const sampleEmotions: { date: string; emotions: EmotionType[] }[] = []

    // Generate sample data for the past 10 days
    for (let i = 0; i < 10; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      // Random emotions for each day
      const dayEmotions: EmotionType[] = []
      const emotionTypes: EmotionType[] = ["senang", "marah", "sedih", "takut"]

      // Some days have single emotion, some have mixed
      const numEmotions = Math.floor(Math.random() * 4) + 1
      for (let j = 0; j < numEmotions; j++) {
        const randomEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)]
        dayEmotions.push(randomEmotion)
      }

      sampleEmotions.push({ date: dateString, emotions: dayEmotions })
    }

    // Add sample data with staggered timing
    sampleEmotions.forEach(({ date, emotions }) => {
      emotions.forEach((emotion) => {
        addEmotionEntry(date, emotion)
      })
    })
  }, [addEmotionEntry])

  return {
    emotionState,
    loading,
    addEmotionEntry,
    removeEmotionEntry,
    getEmotionData,
    getMonthData,
    simulateEmotionInput,
    loadSampleData,
  }
}