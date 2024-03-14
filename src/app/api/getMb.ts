import { useCallback, useState } from "react"
import { request } from "."

export const getMb = (key: string) => {
  return request<string>({
    url: `/api/mb/${key}`,
    method: 'post',
  })
}

export const useGetMb = () => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<string>()

  const req = useCallback<typeof getMb>((...args) => {
    const p = getMb(...args)

    setLoading(true)

    p.then(setRes)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading, res] as const
}
