import { useCallback, useState } from "react"
import { request } from "."

export const stop = (key: string) => {
  return request({
    url: `/api/stop/${key}`,
    method: 'post',
  })
}

export const useStop = () => {
  const [loading, setLoading] = useState(false)

  const req = useCallback<typeof stop>((...args) => {
    const p = stop(...args)

    setLoading(true)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading] as const
}
