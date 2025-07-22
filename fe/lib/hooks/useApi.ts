"use client"

import { useState, useEffect, useCallback } from "react"

interface UseApiOptions {
  immediate?: boolean
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data: T; error?: string }>,
  deps: any[] = [],
  options: UseApiOptions = { immediate: true },
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiCall()
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.error || "An error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    if (options.immediate) {
      fetchData()
    }
  }, [fetchData, options.immediate])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<void>
  loading: boolean
  error: string | null
}

export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<{ success: boolean; data: T; error?: string }>,
  options: UseMutationOptions<T> = {},
): UseMutationReturn<T, V> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (variables: V) => {
      setLoading(true)
      setError(null)

      try {
        const response = await mutationFn(variables)
        if (response.success) {
          options.onSuccess?.(response.data)
        } else {
          const errorMessage = response.error || "An error occurred"
          setError(errorMessage)
          options.onError?.(errorMessage)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        options.onError?.(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, options],
  )

  return {
    mutate,
    loading,
    error,
  }
}
