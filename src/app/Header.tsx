import { Flex } from "antd"
import { Logo } from "./Logo"
import { SPACE } from "./constant"

export const HeaderHeight = 56

export const Header = () => {
  return (
    <Flex align='center' gap={SPACE.NORMAL} style={{ height: HeaderHeight, padding: `0 ${SPACE.LARGE}px` }}>
      <Logo />
      <h2>Brook UI</h2>
    </Flex>
  )
}
