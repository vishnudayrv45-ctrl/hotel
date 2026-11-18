import { useEffect, useState } from 'react'

// Read a value from localStorage (falls back if empty or broken)
export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

// Works like useState, but saves every change to localStorage
export function usePersistent(key, initial) {
  const [value, setValue] = useState(() => load(key, initial))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or blocked: ignore */
    }
  }, [key, value])
  return [value, setValue]
}