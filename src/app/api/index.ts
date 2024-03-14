import { message } from "antd";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

interface Res <T> {
  data?: T
  message?: string
  code: number
}

export const request = <T> (config: AxiosRequestConfig): Promise<T | undefined> => {
  const p = axios<Res<T>>(config).then(res => {
    if (res.data.code === 1) {
      throw new Error(res.data.message)
    }
    
    return res.data.data
  })

  p.catch(e => {
    message.error(e.message)
  })

  return p
}
