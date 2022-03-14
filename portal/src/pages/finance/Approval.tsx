import { Button, Drawer, Card, Space, message } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
//import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getMyApproval } from '@/services/ant-design-pro/api';
import axios from 'axios';

const Approval: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.WorkFlowData>();
  const [selectedRowsState, setSelectedRows] = useState<API.WorkFlowData[]>([]);

  const Approve = () => {
    axios
      .get(`http://localhost:5000/api/workflow/approve/${currentRow?.wfInstanceId}`)
      .then((res) => {
        console.log('res=>', res);
        message.info('Approved!');
      })
      .catch((error) => {
        console.log(error);
        message.error('Error!');
      });

    setShowDetail(false);
    actionRef.current?.reloadAndRest?.();
  };

  const Reject = () => {
    axios
      .get(`http://localhost:5000/api/workflow/reject/${currentRow?.wfInstanceId}`)
      .then((res) => {
        console.log('res=>', res);
        message.info('Approved!');
      })
      .catch((error) => {
        console.log(error);
        message.error('Error!');
      });

    setShowDetail(false);
    actionRef.current?.reloadAndRest?.();
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  //const intl = useIntl();

  const columns: ProColumns<API.WorkFlowData>[] = [
    {
      title: 'Request No.',
      dataIndex: 'wfInstanceNo',
      render: (dom, entity) => {
        return (
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
      title: 'Workflow Name',
      dataIndex: 'wfName',
      valueType: 'textarea',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Requestor',
      dataIndex: 'requestor',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.WorkFlowData, API.PageParams>
        headerTitle={'Approval List'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={getMyApproval}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            onClick={async () => {
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

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.wfInstanceNo && (
          <>
            <ProDescriptions<API.WorkFlowData>
              column={2}
              title={currentRow?.wfInstanceNo}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.wfInstanceNo,
              }}
              columns={columns as ProDescriptionsItemProps<API.WorkFlowData>[]}
            />
          </>
        )}

        <Card>
          <Space size={'small'}>
            <Button type="primary" onClick={Approve}>
              Approve
            </Button>
            <Button type="primary" onClick={Reject}>
              Reject
            </Button>
          </Space>
        </Card>
      </Drawer>
    </PageContainer>
  );
};

export default Approval;
