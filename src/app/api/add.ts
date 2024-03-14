import { useCallback, useState } from "react"
import { request } from "."

export const add = () => {
  return request({
    url: `/api/add`,
    method: 'post',
  })
}

export const useAdd = () => {
  const [loading, setLoading] = useState(false)

  const req = useCallback<typeof add>((...args) => {
    const p = add(...args)

    setLoading(true)

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading] as const
}
