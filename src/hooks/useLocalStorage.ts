import { useState, useEffect } from "react"

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storageValue, setStorageValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storageValue))
    } catch (error) {
      console.error(error)
    }
  }, [key, storageValue])

  return [storageValue, setStorageValue] as const
}

export default useLocalStorage
