import { useCallback, useState } from "react"
import { request } from "."

export const getLink = (key: string) => {
  return request<string>({
    url: `/api/link/${key}`,
    method: 'post',
  })
}

export const useGetLink = () => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<string>()

  const req = useCallback<typeof getLink>((...args) => {
    const p = getLink(...args)

    setLoading(true)

    p.then(setRes)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading, res] as const
}
