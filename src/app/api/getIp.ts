import { useCallback, useState } from "react"
import { request } from "."

export const getIp = () => {
  return request<string>({
    url: '/api/ip',
    method: 'get'
  })
}

export const useGetIp = () => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<string>()

  const req = useCallback<typeof getIp>((...args) => {
    const p = getIp(...args)

    setLoading(true)

    p.then((res) => setRes(res))

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading, res] as const
}
