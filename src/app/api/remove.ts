import { useCallback, useState } from "react"
import { request } from "."

export const remove = (key: string) => {
  return request({
    url: `/api/remove/${key}`,
    method: 'post',
  })
}

export const useRemove = () => {
  const [loading, setLoading] = useState(false)

  const req = useCallback<typeof remove>((...args) => {
    const p = remove(...args)

    setLoading(true)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading] as const
}
