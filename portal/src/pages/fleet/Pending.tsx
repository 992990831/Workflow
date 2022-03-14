import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { Link, useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
//import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, updateRule, removeRule } from '@/services/ant-design-pro/api';

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
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
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

const PendingOrders: React.FC = () => {
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.RuleListItem>[] = [
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    //   valueType: 'textarea',
    // },
    {
      title: <FormattedMessage id="pages.orders.column.orderId" defaultMessage="Order Id" />,
      dataIndex: 'id',
      tip: 'The order id is the unique key',
      render: (dom, entity) => {
        return (
          <Link to="/orders/detail">{dom}</Link>
          // <a
          //   onClick={() => {
          //     setCurrentRow(entity);
          //     setShowDetail(true);
          //   }}
          // >
          //   {dom}
          // </a>
        );
      },
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      valueType: 'textarea',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val},000`,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          // text: (
          //   <FormattedMessage
          //     id="pages.searchTable.nameStatus.default"
          //     defaultMessage="Shut down"
          //   />
          // ),
          text: 'Unpaid',
          status: 'Default',
        },
        1: {
          // text: (
          //   <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          // ),
          text: 'Partially Paid',
          status: 'Processing',
        },
        2: {
          // text: (
          //   <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          // ),
          text: 'Fully Paid',
          status: 'Success',
        },
        3: {
          // text: (
          //   <FormattedMessage
          //     id="pages.searchTable.nameStatus.abnormal"
          //     defaultMessage="Abnormal"
          //   />
          // ),
          text: 'Error',
          status: 'Error',
        },
      },
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="pages.searchTable.titleUpdatedAt"
    //       defaultMessage="Last scheduled time"
    //     />
    //   ),
    //   sorter: true,
    //   dataIndex: 'updatedAt',
    //   valueType: 'dateTime',
    //   renderFormItem: (item, { defaultRender, ...rest }, form) => {
    //     const status = form.getFieldValue('status');
    //     if (`${status}` === '0') {
    //       return false;
    //     }
    //     if (`${status}` === '3') {
    //       return (
    //         <Input
    //           {...rest}
    //           placeholder={intl.formatMessage({
    //             id: 'pages.searchTable.exception',
    //             defaultMessage: 'Please enter the reason for the exception!',
    //           })}
    //         />
    //       );
    //     }
    //     return defaultRender(item);
    //   },
    // },
    // {
    //   title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         handleUpdateModalVisible(true);
    //         setCurrentRow(record);
    //       }}
    //     >
    //       <FormattedMessage id="pages.searchTable.config" defaultMessage="Configuration" />
    //     </a>,
    //     <a key="subscribeAlert" href="https://procomponents.ant.design/">
    //       <FormattedMessage
    //         id="pages.searchTable.subscribeAlert"
    //         defaultMessage="Subscribe to alerts"
    //       />
    //     </a>,
    //   ],
    // },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.orders.pending.title',
          defaultMessage: 'Pending Orders List',
        })}
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
        request={rule}
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
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
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
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PendingOrders;
