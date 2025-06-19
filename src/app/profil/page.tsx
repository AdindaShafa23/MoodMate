"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Volume2, Vibrate, Check, VolumeX } from "lucide-react"

interface ChildProfile {
  name: string
  age: string
  avatar: number
  autism: boolean
  adhd: boolean
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("#BFDBFE")
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [animationEnabled, setAnimationEnabled] = useState(true)

  useEffect(() => {
    const storedProfile = localStorage.getItem("childProfile")
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, [])

  const avatarEmojis = [
    "👦🏻", // Light skin boy
    "👧🏻", // Light skin girl
    "👦🏽", // Medium skin boy
    "👧🏽", // Medium skin girl
    "👶🏻", // Baby light skin
    "👶🏽", // Baby medium skin
    "🧒🏻", // Child light skin
    "🧒🏽", // Child medium skin
  ]

  // Colors that match the image more closely
  const colorOptions = [
    "#87CEEB", // Light blue
    "#FFD700", // Gold/Yellow
    "#DDA0DD", // Plum/Purple
    "#FFB6C1", // Light pink
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-10">
      <Navbar />

      <h1 className="text-center text-blue-600 font-semibold text-4xl mt-6 mb-8">Profil & Pengaturan</h1>

      {profile ? (
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl mb-3">
            {avatarEmojis[profile.avatar] || "👦🏻"}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
          <p className="text-gray-500 text-sm">Usia : {profile.age} Tahun</p>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl mb-3">👦🏻</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Profil tidak ditemukan</h2>
          <p className="text-gray-500 text-sm">Silakan buat profil anak terlebih dahulu</p>
        </div>
      )}

      {/* Pilih Warna */}
      <div className="mb-8">
        <h3 className="text-blue-600 font-medium mb-3 text-sm">Pilih Warna</h3>
        <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
          <p className="mb-3 text-gray-600 text-sm">Pilih Warna</p>
          <div className="flex gap-4 justify-start">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-3 transition-all ${
                  selectedColor === color ? "border-blue-500 scale-110" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pengaturan Sensorik */}
      <div>
        <h3 className="text-blue-600 font-medium mb-3 text-sm">Pengaturan Sensorik</h3>
        <div className="space-y-3">
          <SensorItem
            label="Notifikasi Suara"
            icon={
              soundEnabled ? (
                <Volume2 className="text-gray-600 w-5 h-5" />
              ) : (
                <VolumeX className="text-gray-400 w-5 h-5" />
              )
            }
            enabled={soundEnabled}
            onToggle={() => setSoundEnabled(!soundEnabled)}
          />
          <SensorItem
            label="Getaran"
            icon={
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <Vibrate className="text-white w-4 h-4" />
              </div>
            }
            enabled={vibrationEnabled}
            onToggle={() => setVibrationEnabled(!vibrationEnabled)}
          />
          <SensorItem
            label="Animasi"
            icon={
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <Check className="text-white w-4 h-4" />
              </div>
            }
            enabled={animationEnabled}
            onToggle={() => setAnimationEnabled(!animationEnabled)}
          />
        </div>
      </div>
    </div>
  )
}

function SensorItem({
  label,
  icon,
  enabled,
  onToggle,
}: {
  label: string
  icon: React.ReactNode
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`bg-white w-full flex justify-between items-center px-4 py-4 rounded-2xl shadow-sm transition-all ${
        enabled ? "opacity-100" : "opacity-60"
      }`}
    >
      <p className="text-gray-700 font-medium text-sm">{label}</p>
      {icon}
    </button>
  )
}
