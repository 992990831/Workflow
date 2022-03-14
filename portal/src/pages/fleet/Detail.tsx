//import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Space, Statistic, Row, Col } from 'antd';
import React, { useState, useRef } from 'react';
// import { useIntl, FormattedMessage } from 'umi';
import { FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
//import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { getCars, updateRule, removeRule } from '@/services/ant-design-pro/api';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.CarListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.vin),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const OrderCarList: React.FC = () => {
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CarListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.CarListItem[]>([]);
  const [allocated, setAllocated] = useState<number>(0);

  const TotalPayment = {
    children: (
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Received Payment" value={1000000} />
        </Col>
        <Col span={12}>
          <Statistic title="Allocated Amount" value={allocated} precision={2} />
        </Col>
      </Row>
    ),
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  //const intl = useIntl();

  const columns: ProColumns<API.CarListItem>[] = [
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    //   valueType: 'textarea',
    // },
    {
      title: 'VIN',
      dataIndex: 'vin',
      tip: 'VIN is the unique key',
      render: (dom, entity) => {
        return (
          //<Link to="/orders/detail">{dom}</Link>
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Model',
      dataIndex: 'model',
      valueType: 'textarea',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      sorter: true,
      hideInForm: true,
      // renderText: (val: string) =>
      //   `${val}${intl.formatMessage({
      //     id: 'pages.searchTable.tenThousand',
      //     defaultMessage: ' 万 ',
      //   })}`,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      valueType: 'textarea',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'textarea',
    },
  ];

  const ConfirmPayment = () => {
    setAllocated(allocated + currentRow!.amount);
    currentRow!.status = 'Confirmed';
  };

  return (
    <PageContainer header={TotalPayment}>
      <ProTable<API.CarListItem, API.PageParams>
        headerTitle="Cars List"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     key="primary"
        //     onClick={() => {
        //       //handleModalVisible(true);
        //     }}
        //   >
        //     <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
        //   </Button>,
        // ]}
        request={getCars}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.vin && (
          <ProDescriptions<API.CarListItem>
            column={2}
            title={currentRow?.model}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.model,
            }}
            columns={columns as ProDescriptionsItemProps<API.CarListItem>[]}
          />
        )}
        <Space>
          <Button type="primary" onClick={ConfirmPayment}>
            Confirm Payment
          </Button>
        </Space>
      </Drawer>
    </PageContainer>
  );
};

export default OrderCarList;
