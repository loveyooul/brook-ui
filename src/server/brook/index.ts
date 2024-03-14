import { getBrookListByJoker } from './utils';
import { checkPort, getIp } from '../utils/helper';
import { readLastNLines } from '../utils/file';
import fs from 'node:fs'
import readline from 'node:readline'

export type CliValueType = string | boolean;

export type CliValueTypes = CliValueType | CliValueType[];

export type CliStatus = 'NOT_START' | 'STARTED';

export type CliCommand =
  'server' | 'client' | 'wsserver' | 'wsclient' | 'wssserver' | 'wssclient' |
  'quicserver' | 'quicclient' | 'relayoverbrook' | 'dnsserveroverbrook' |
  'link' | 'connect' | 'relay' | 'dnsserver' | 'dnsclient' | 'dohserver' | 'dohclient' | 'dhcpserver' |
  'socks5' | 'socks5tohttp' | 'pac' | 'testsocks5' | 'testbrook' | 'echoserver' | 'echoclient' |
  'ipcountry' | 'completion' | 'mdpage' | 'manpage' | 'help' | 'h';


export interface BrookStartDTO {
  password?: string
  port?: string
  enableLog: boolean
}

export interface BrookCLI {
  key: string
  pid: string
  status: CliStatus
  globalOptions?: Record<string, CliValueTypes>
  command: CliCommand
  commandOptions: Record<string, CliValueTypes>
}


class Brook {
  private list: BrookCLI[]
  private key: number

  constructor() {
    this.list = []
    this.key = 0

    this.update().then(() => {
      this.add()
    })
  }

  private getKey() {
    this.key = this.key + 1
    return `${this.key}`
  }

  add() {
    const newBrook = {
      key: this.getKey(),
      status: 'NOT_START',
    } as BrookCLI

    this.list.push(newBrook)
  }

  async start(key: string, options: BrookStartDTO) {
    const brook = this.list.find(b => b.key === key)

    if (!brook) return

    const command = 'server'
    const port = options.port ? `${options.port}` : '9999'
    const password = options.password || '123456'
    const logPath = options.enableLog ? `/tmp/brook-${Date.now()}-${key}.log` : ''
    const cmd: string[] = ['joker', 'brook']

    checkPort(port)

    if (options.enableLog) {
      cmd.push('--serverLog', logPath)
    }

    cmd.push(command, '--listen', `:${port}`, '--password', password)

    if (logPath) {
      Bun.write(logPath, '')
    }

    const joker = Bun.spawnSync({
      cmd,
      stdin: null,
      stderr: Bun.stderr,
      stdout: null,
    })

    if (!joker.success) throw new Error('start brook failed')

    // for joker last
    await Bun.sleep(200)

    const jokerPid = Bun.spawnSync({
      cmd: ['joker', 'last'],
      stdin: null,
      stderr: null,
      stdout: 'pipe',
    })

    if (!jokerPid.success) {
      this.stop(key)
      throw new Error('start brook failed')
    }

    brook.command = command
    brook.commandOptions = {
      '--listen': `:${port}`,
      '--password': password,
    }

    if (options.enableLog) {
      brook.globalOptions = { '--serverLog': logPath }
    }

    brook.status = 'STARTED'
    brook.pid = jokerPid.stdout.toString().trim()
  }

  async remove(key: string) {
    const brook = this.list.find(b => b.key === key)

    if (!brook) return
    if (brook.status === 'NOT_START') {
      this.list = this.list.filter(b => b.key !== key)
      return
    }

    const joker = Bun.spawnSync({
      cmd: ['joker', 'stop', brook.pid],
      stdin: null,
      stderr: Bun.stderr,
      stdout: Bun.stdout,
    })

    if (!joker.success) throw new Error('remove brook failed')

    this.list = this.list.filter(b => b.key !== key)

    await Bun.sleep(200)
  }

  async stop(key: string) {
    const brook = this.list.find(b => b.key === key)

    if (!brook) return

    const joker = Bun.spawnSync({
      cmd: ['joker', 'stop', brook.pid],
      stdin: null,
      stderr: Bun.stderr,
      stdout: null,
    })

    if (!joker.success) throw new Error('stop brook failed')

    brook.status = 'NOT_START'

    await Bun.sleep(200)
  }

  async getBrookList() {
    await this.update()
    return this.list
  }

  async update() {
    const list = await getBrookListByJoker()
    const processList = this.list.filter(b => b.status === 'STARTED')
    const newBrookList = list.filter(b => !this.list.some(l => l.pid === b.pid || l.key === b.key))

    newBrookList.forEach(b => {
      b.key = this.getKey()
      b.status = 'STARTED'

      this.list.push(b)
    })

    processList.forEach((b) => {
      if (!list.some(l => l.pid === b.pid)) {
        b.status = 'NOT_START'
      }
    })
  }

  async readLog(key: string) {
    const brook = this.list.find(b => b.key === key)

    if (!brook) return ''

    const globalOptions = brook.globalOptions || {}
    const serverLog = globalOptions['--serverLog'] ? globalOptions['--serverLog'] as string : undefined

    if (serverLog) {
      const log = await readLastNLines(serverLog, 100)
      return log
    } else {
      return ''
    }
  }

  getLink(key: string) {
    const brook = this.list.find(b => b.key === key)

    if (!brook) return
    if (brook.status === 'NOT_START') return

    const options = brook.commandOptions || {}
    const port = options['--listen'] ? options['--listen'] as string : undefined
    const password = options['--password'] ? options['--password'] as string : undefined

    if (!port) return
    if (!password) return

    const brookLink = Bun.spawnSync({
      cmd: ['brook', 'link', '-s', `${getIp()}${port}`, '-p', password],
      stdin: null,
      stderr: Bun.stderr,
      stdout: 'pipe',
    })

    const link = brookLink.stdout.toString().trim()

    return link
  }

  async getMb(key: string) {
    return new Promise<number>((resolve) => {
      const brook = this.list.find(b => b.key === key)

      if (!brook) return resolve(0)
      if (brook.status === 'NOT_START') return resolve(0)

      const globalOptions = brook.globalOptions || {}
      const serverLog = globalOptions['--serverLog'] ? globalOptions['--serverLog'] as string : undefined

      if (!serverLog) return resolve(0)

      let total = 0
      const readStream = fs.createReadStream(serverLog);

      const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      });

      rl.on('line', (line) => {
        try {
          const o = JSON.parse(line) || {}

          if (o && o.bytes) {
            total = total + Number(o.bytes)
          }
        } catch (e) {
          // ignore
        }
      });

      rl.on('close', () => {
        resolve(Math.floor(total / 1024 / 1024))
      });
    })
  }
}

export const brook = new Brook()
