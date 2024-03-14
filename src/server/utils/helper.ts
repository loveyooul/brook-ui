export const checkPort = (port: string) => {
  const lsof = Bun.spawnSync({
    cmd: ['lsof', '-i', `:${port}`],
    stdin: null,
    stderr: Bun.stderr,
    stdout: null,
  })

  if (lsof.success) {
    throw new Error(`port ${port} is already in use`)
  }
}

export const getIp = (() => {
  let ip: string

  return () => {
    if (ip) return ip

    const curl = Bun.spawnSync({
      cmd: ['curl', 'http3.ooo', '-4'],
      stdin: null,
      stderr: null,
      stdout: 'pipe',
    })
  
    if (!curl.success) {
      throw new Error('get ip failed')
    }
  
    ip = curl.stdout.toString('utf-8').trim()

    return ip
  }
})()
