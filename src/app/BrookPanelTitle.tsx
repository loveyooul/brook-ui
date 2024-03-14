import { Badge, Flex, Typography } from "antd"
import { BrookCLI } from "../server/brook"
import { FC, useMemo } from "react"

export interface BrookPanelTitleProps {
  brook: BrookCLI
}

export const BrookPanelTitle:FC<BrookPanelTitleProps> = ({ brook }) => {
  const options = useMemo(() => brook.commandOptions || {}, [brook.commandOptions])
  const port = useMemo(() => options['--listen'], [options])

  if (port) {
    return (
      <Flex gap={8}>
        {
          brook.status === 'NOT_START'
            ? <Badge status="default" />
            : <Badge status="processing" />
        }
        <Typography.Text>brook {brook.command} {port}</Typography.Text>
      </Flex>
    )
  }

  return (
    <Typography.Text>设置 brook</Typography.Text>
  )
}
