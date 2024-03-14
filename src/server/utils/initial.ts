export const initial = () => {
  setupBrook()
}

const setupBrook = () => {
  if (!hasNami()) installNami()
  if (!hasDenobundle()) installDenobundle()
  if (!hasNico()) installNico()
  if (!hasJoker()) installJoker()
  if (hasBrook()) return

  installBrook()
}

const hasNami = () => {
  const which = Bun.spawnSync({
    cmd: ['which', 'nami'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: null,
  })
  
  return which.success
}

const hasDenobundle = () => {
  const which = Bun.spawnSync({
    cmd: ['which', 'denobundle'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: null,
  })
  
  return which.success
}

const hasJoker = () => {
  const which = Bun.spawnSync({
    cmd: ['which', 'joker'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: null,
  })
  
  return which.success
}

const hasNico = () => {
  const which = Bun.spawnSync({
    cmd: ['which', 'nico'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: null,
  })
  
  return which.success
}

const hasBrook = () => {
  const which = Bun.spawnSync({
    cmd: ['which', 'brook'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: null,
  })
  
  return which.success
}

const installNami = () => {
  console.log(`start install nami`)

  const install = Bun.spawnSync({
    cmd: ['bash', '<(curl https://bash.ooo/nami.sh)'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: Bun.stdout,
  })

  if (!install.success) {
    throw `install nami failed`
  }

  console.log(`nami installed successfully`)
}

const installJoker = () => {
  console.log(`start install joker`)

  const install = Bun.spawnSync({
    cmd: ['nami', 'install', 'joker'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: Bun.stdout,
  })

  if (!install.success) {
    throw `install joker failed`
  }

  console.log(`joker installed successfully`)
}

const installNico = () => {
  console.log(`start install nico`)

  const install = Bun.spawnSync({
    cmd: ['nami', 'install', 'nico'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: Bun.stdout,
  })

  if (!install.success) {
    throw `install nico failed`
  }

  console.log(`nico installed successfully`)
}

const installBrook = () => {
  console.log(`start install brook`)

  const install = Bun.spawnSync({
    cmd: ['nami', 'install', 'brook'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: Bun.stdout,
  })

  if (!install.success) {
    throw `install brook failed`
  }

  console.log(`brook installed successfully`)
}

const installDenobundle = () => {
  console.log(`start install denobundle`)

  const install = Bun.spawnSync({
    cmd: ['nami', 'install', 'denobundle'],
    stdin: null,
    stderr: Bun.stderr,
    stdout: Bun.stdout,
  })

  if (!install.success) {
    throw `install denobundle failed`
  }

  console.log(`denobundle installed successfully`)
}

