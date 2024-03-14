import styled from "styled-components"
import { HeaderHeight } from "./Header"
import { SPACE } from "./constant"

export const Container = styled.div`
  padding: ${SPACE.NORMAL}px;
  background-color: #f5f5f5;
  height: calc(100vh - ${HeaderHeight}px);
  overflow-y: auto;
`