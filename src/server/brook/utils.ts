import { CliValueTypes, CliValueType, BrookCLI, CliCommand } from "."

export const getBrookListByJoker = async () => {
  await Bun.sleep(200)

  const joker = Bun.spawnSync({
    cmd: ['joker', 'list'],
    stdout: 'pipe',
    stderr: null,
    stdin: null,
  })

  const list = joker.stdout.toString().split('\n').filter(i => i)

  return list.map(cmd => parserBrookCli(cmd))
}

const isOption = (arg: string) => {
  return arg.startsWith('-')
}

const isCommand = (v: string) => {
  if (v === 'server') return true
  if (v === 'client') return true
  if (v === 'wsserver') return true
  if (v === 'wsclient') return true
  if (v === 'wssserver') return true
  if (v === 'wssclient') return true
  if (v === 'quicserver') return true
  if (v === 'quicclient') return true
  if (v === 'relayoverbrook') return true
  if (v === 'dnsserveroverbrook') return true
  if (v === 'link') return true
  if (v === 'connect') return true
  if (v === 'relay') return true
  if (v === 'dnsserver') return true
  if (v === 'dnsclient') return true
  if (v === 'dohserver') return true
  if (v === 'dohclient') return true
  if (v === 'dhcpserver') return true
  if (v === 'socks5') return true
  if (v === 'socks5tohttp') return true
  if (v === 'pac') return true
  if (v === 'testsocks5') return true
  if (v === 'testbrook') return true
  if (v === 'echoserver') return true
  if (v === 'echoclient') return true
  if (v === 'ipcountry') return true
  if (v === 'completion') return true
  if (v === 'mdpage') return true
  if (v === 'manpage') return true
  if (v === 'help') return true
  if (v === 'h') return true

  return false
}

const getServerCommandOptionName = (option: string) => {
  if (option === '-l') return '--listen'
  if (option === '-p') return '--password'

  return option
}

const getGlobalOptionName = (option: string) => {
  if (option === '-h') return '--help'
  if (option === '-v') return '--version'

  return option
}

const getOptionValue = (nextToken?: string) => {
  if (!nextToken) return true
  if (!isOption(nextToken)) {
    return nextToken
  }

  return true
}

const updateOptions = (options: Record<string, CliValueTypes>, name: string, value: CliValueType) => {
  if (options[name]) {
    const original = options[name]

    if (Array.isArray(original)) {
      options[name] = original.concat(value)
    } else {
      options[name] = [original, value]
    }
  } else {
    options[name] = value
  }
}

const parserBrookCli = (cmd: string) => {
  const brookCliValues = {} as BrookCLI
  const arr = cmd.split(' ').filter(i => i)
  const pid = arr[0]
  const tokens = arr.splice(5)

  let token = tokens.shift()

  brookCliValues.key = pid
  brookCliValues.pid = pid
  brookCliValues.status = 'STARTED'

  // globalOptions & command
  while (token) {
    if (isCommand(token)) {
      brookCliValues.command = token as CliCommand
      token = tokens.shift()
      break
    } else {
      const options = brookCliValues.globalOptions || {}
      const optionName = getGlobalOptionName(token)
      const value = getOptionValue(tokens[0])

      if (typeof value === 'string') tokens.shift()

      updateOptions(options, optionName, value)

      brookCliValues.globalOptions = options
      token = tokens.shift()
    }
  }

  // command options
  while (token) {
    if (brookCliValues.command === 'server') {
      const options = brookCliValues.commandOptions || {}
      const optionName = getServerCommandOptionName(token)
      const value = getOptionValue(tokens[0])

      if (typeof value === 'string') tokens.shift()

      updateOptions(options, optionName, value)

      brookCliValues.commandOptions = options
      token = tokens.shift()
    }
  }

  return brookCliValues
}
