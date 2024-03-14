import { useCallback, useState } from "react"
import { request } from "."

export const readLog = (key: string) => {
  return request<string>({
    url: `/api/log/${key}`,
    method: 'post',
  })
}

export const useReadLog = () => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<string>()

  const req = useCallback<typeof readLog>((...args) => {
    const p = readLog(...args)

    setLoading(true)

    p.then(setRes)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading, res] as const
}
