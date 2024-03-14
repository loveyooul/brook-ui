import styled from "styled-components"
import { Form, Input, type FormProps, Switch, Typography, Flex, Button } from "antd"
import { useGetIp } from "./api/getIp"
import { useEffect, useCallback, FC, useMemo } from "react"
import { BrookCLI, BrookStartDTO } from "../server/brook"
import { SPACE } from "./constant"
import { WifiOutlined } from "@ant-design/icons"
import { HeaderHeight } from "./Header"
import { useStart } from "./api/start"

export interface BrookFormProps {
  brook: BrookCLI,
  onStarted: () => void
}

export const BrookForm:FC<BrookFormProps> = ({ brook, onStarted }) => {
  const [form] = Form.useForm<BrookStartDTO>()
  const [getIp, , ip] = useGetIp()
  const [start, starting] = useStart()

  const initialFormValue:BrookStartDTO = useMemo(() => {
    const options = brook.commandOptions || {}
    const port = (options['--listen'] ? options['--listen'] : undefined) as string | undefined
    const password = (options['--password'] ? options['--password'] : undefined) as string | undefined

    return {
      enableLog: true,
      port: port ? port.replace(':', '') : port,
      password
    }
  }, [brook.commandOptions])

  const handleStart = useCallback(() => {
    form.submit()
  }, [form])

  const handleFinish = useCallback<Required<FormProps<BrookStartDTO>>['onFinish']>((values) => {
    start(brook.key, values).then(onStarted)
  }, [brook.key, onStarted, start])

  useEffect(() => {
    getIp()
  }, [getIp])

  return (
    <Flex gap={SPACE.HUGE} vertical align='center' justify='center' style={{ minHeight: `calc(100vh - ${HeaderHeight}px - 68px)` }}>
      <div>
        <Typography.Title style={{ marginLeft: 12 }} level={3}>设置 Brook 代理服务</Typography.Title>
    
        <FormStyled initialValues={initialFormValue} form={form} layout='vertical' labelAlign='right' onFinish={handleFinish}>
          <Form.Item name='port' label='服务端口' help={<Help>（选填）填写端口号</Help>}>
            <Input addonBefore={<ServerIP>{ip} ：</ServerIP>} placeholder='默认 9999' />
          </Form.Item>

          <Form.Item name={'password'} label='服务密码' help={<Help>（选填）连接时需要输入此密码</Help>}>
            <Input.Password visibilityToggle type='password' placeholder='默认 123456' />
          </Form.Item>

          <Form.Item name='enableLog' label='是否启用日志' valuePropName='checked'>
            <Switch checkedChildren='启用' unCheckedChildren='未启用' />
          </Form.Item>

          <Form.Item colon={false} help={<Help>启动后，可在 Brook 客户端连接这个 Brook 代理服务</Help>}>
            <Button loading={starting} onClick={handleStart} icon={<WifiOutlined />} type='primary'>启动 Brook 代理服务</Button>
          </Form.Item>
        </FormStyled>
      </div>
    </Flex>
  )
}

const FormStyled = styled(Form)<FormProps>`
  padding: 16px;
  width: 100%;
  max-width: 420px;

  .ant-form-item {
    padding-top: 12px;
  }

  .ant-form-item-label label {
    color: rgba(0, 0, 0, 0.495);
  }
`

const Help = styled.div`
  font-size: 12px;
  color: #c5c5c5;
  margin-top: 2px;
`

const ServerIP = styled.div`
  font-size: 14px;
  color: #767676;
  margin-top: 2px;
  letter-spacing: 1.5px;
`
