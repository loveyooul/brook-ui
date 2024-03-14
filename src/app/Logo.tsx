import styled from "styled-components"
import logo from './assets/logo.png'
import { SPACE } from "./constant"

console.log(logo)

export const Logo = styled.div<{
  $size?: number
  $radius?: number
}>`
  width: ${props => props.$size || 32}px;
  height: ${props => props.$size || 32}px;
  background-image: url(${logo});
  background-size: ${props => props.$size || 32}px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${props => props.$radius || SPACE.NORMAL}px;
`
