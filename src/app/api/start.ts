import { useCallback, useState } from "react"
import { request } from "."
import { BrookStartDTO } from "../../server/brook"

export const start = (key: string, data: BrookStartDTO) => {
  return request({
    url: `/api/start/${key}`,
    method: 'post',
    data
  })
}

export const useStart = () => {
  const [loading, setLoading] = useState(false)

  const req = useCallback<typeof start>((...args) => {
    const p = start(...args)

    setLoading(true)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading] as const
}
