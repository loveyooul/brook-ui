import styled from 'styled-components';
import { SPACE } from './constant';
import { Flex, type TabsProps, Tabs } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetBrookList } from './api/getBrookList';
import { Header } from './Header';
import { Container } from './Container';
import { BrookView } from './BrookView';
import { BrookForm } from './BrookForm';
import { useRemove } from './api/remove';
import { useAdd } from './api/add';
import { BrookPanelTitle } from './BrookPanelTitle';
import { LoadingOutlined } from '@ant-design/icons';

export const App = () => {
  const [remove] = useRemove()
  const [removeLoading, setRemoveLoading] = useState<Record<string, boolean>>({})
  const [addLoading, setAddLoading] = useState<boolean>(false)
  const [add] = useAdd()
  const [getBrookList, , brookList] = useGetBrookList()
  const [activeKey, setActiveKey] = useState('0')
  // const [items, setItems] = useState<TabsProps['items']>([])

  const tabs = useMemo<TabsProps['items']>(() => {
    return brookList?.map((brook) => {
      return {
        key: brook.key,
        label: <BrookPanelTitle brook={brook} />,
        closeIcon: removeLoading[brook.key] ? <LoadingOutlined /> : undefined,
        children: (
          <>
            {
              brook.status === 'NOT_START'
                ? <BrookForm brook={brook} onStarted={getBrookList} />
                : <BrookView brook={brook} onStoped={getBrookList} />
            }
          </>
        ),
      }
    })
  }, [brookList, getBrookList, removeLoading])

  const handleEdit = useCallback<Required<TabsProps>['onEdit']>((key, action) => {
    if (action === 'add') {
      setAddLoading(true)
      add().then(getBrookList).finally(() => {
        setAddLoading(false)
      })
    }

    if (action === 'remove') {
      setRemoveLoading((prev) => ({ ...prev, [key as string]: true }))

      remove(key as string).then(() => {
        getBrookList()
      }).finally(() => {
        setRemoveLoading((prev) => ({ ...prev, [key as string]: false }))
      })
    }
  }, [add, getBrookList, remove])

  // const handleFetchBrookList = useCallback(() => {
  //   getBrookList().then(() => {
  //     setTimeout(handleFetchBrookList, 3000)
  //   })
  // }, [getBrookList])

  useEffect(() => {
    getBrookList()
  }, [getBrookList])

  return (
    <Flex vertical style={{ minHeight: '100%' }}>
      <Header />

      <Container>
        <div style={{ padding: SPACE.SMALL, background: '#fff', borderRadius: 10 }}>
          <TabsStyled
            addIcon={addLoading ? <LoadingOutlined /> : undefined}
            onChange={setActiveKey}
            onEdit={handleEdit}
            accessKey={activeKey}
            type='editable-card'
            items={tabs}
          />
        </div>
      </Container>
    </Flex>
  )
}

const TabsStyled = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 4px;
  }
`
