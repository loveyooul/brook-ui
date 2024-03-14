import styled from "styled-components"
import { FC, useCallback, useEffect } from "react"
import { BrookCLI } from "../server/brook"
import { HeaderHeight } from "./Header"
import { SPACE } from "./constant"
import { Button, Flex, Typography } from "antd"
import { StopOutlined } from "@ant-design/icons"
import { useStop } from "./api/stop"
import { useReadLog } from "./api/readLog"
import { useGetLink } from "./api/getLink"
import { useGetMb } from "./api/getMb"

export interface BrookViewProps {
  brook: BrookCLI
  onStoped: () => void
}

export const BrookView:FC<BrookViewProps> = ({ brook, onStoped }) => {
  const [stop, stopLoading] = useStop()
  const [readLog,, log] = useReadLog()
  const [getLink,, link] = useGetLink()
  const [getMb,, mb] = useGetMb()

  const globalOptions = brook.globalOptions || {}

  const handleStop = useCallback(() => {
    stop(brook.key).then(onStoped)
  }, [brook.key, onStoped, stop])

  const handleFetchLog = useCallback(() => {
    readLog(brook.key).then(() => {
      setTimeout(handleFetchLog, 5000)
    })
  }, [brook.key, readLog])

  const handleFetchMb = useCallback(() => {
    getMb(brook.key).then(() => {
      setTimeout(handleFetchMb, 5000)
    })
  }, [brook.key, getMb])

  useEffect(() => {
    handleFetchLog()
  }, [handleFetchLog])

  useEffect(() => {
    handleFetchMb()
  }, [handleFetchMb])

  useEffect(() => {
    getLink(brook.key)
  }, [brook.key, getLink])

  return (
    <div style={{ height: `calc(100vh - ${HeaderHeight}px - 68px)`, overflowY: 'auto' }}>
      <StatusBar>
        <Flex gap={24}>
          <Flex gap={8}>
            <Typography.Text type='secondary'>pid</Typography.Text>
            <Typography.Text>{brook.pid}</Typography.Text>
          </Flex>

          <Flex gap={8}>
            <Typography.Text type='secondary'>状态</Typography.Text>
            <Typography.Text>{brook.status === 'NOT_START' ? '未开始' : '运行中'}</Typography.Text>
          </Flex>

          <Flex gap={8}>
            <Typography.Text type='secondary'>端口</Typography.Text>
            <Typography.Text>{brook.commandOptions['--listen']}</Typography.Text>
          </Flex>

          <Flex gap={8}>
            <Typography.Text type='secondary'>流量统计</Typography.Text>
            <Typography.Text>{mb || 0}MB</Typography.Text>
          </Flex>

          <Flex gap={8}>
            <Typography.Text type='secondary'>日志路径</Typography.Text>
            <Typography.Text>{globalOptions['--serverLog'] || '未启用'}</Typography.Text>
          </Flex>

          <Flex gap={8}>
            <Typography.Text type='secondary'>Brook Link</Typography.Text>
            <Typography.Text copyable>{link}</Typography.Text>
          </Flex>
        </Flex>
        
        <Flex>
          {/* <Button type="link" icon={<CopyOutlined />}>复制链接</Button> */}
          <Button loading={stopLoading} type="link" danger icon={<StopOutlined />} onClick={handleStop}>停止代理服务</Button>
        </Flex>
      </StatusBar>

      <CodeContainer>
        <code>{log || 'waiting...'}</code>
      </CodeContainer>
    </div>
  )
}

const StatusBar = styled.div`
  background-color: #e0e0e0;
  border-radius: ${SPACE.SMALL}px ${SPACE.SMALL}px 0 0;
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${SPACE.LARGE}px;
  gap: 24px;
`

const CodeContainer = styled.pre`
  margin: 0;
  height: calc(100vh - ${HeaderHeight}px - 112px);
  overflow-y: auto;
  border-radius: 0 0 ${SPACE.NORMAL}px ${SPACE.NORMAL}px;
  padding: ${SPACE.LARGE}px;
  background-color: #292929;
  color: #45c314;
`
