import { useCallback, useState } from "react"
import { request } from "."
import { BrookCLI } from "../../server/brook"

export const getBrookList = () => {
  return request<BrookCLI[]>({
    url: '/api/list',
    method: 'get'
  })
}

export const useGetBrookList = () => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<BrookCLI[]>()

  const req = useCallback<typeof getBrookList>((...args) => {
    const p = getBrookList(...args)

    setLoading(true)

    p.then((res) => setRes(res))

    p.finally(() => {
      setLoading(false)
    })

    return p
  }, [])

  return [req, loading, res] as const
}
