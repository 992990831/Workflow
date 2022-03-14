import React, { ReactNode } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
//import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { getWorkFlowRequests } from '@/services/ant-design-pro/api';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';

const WFList: React.FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  //const intl = useIntl();
  const getProgressNode = () => {
    return (
      <>
        <p>
          <ClockCircleOutlined style={{ color: 'blue' }} />
          <span>in progress</span>
        </p>
      </>
    );
  };

  const getApprovedNode = () => {
    return (
      <>
        <p>
          <CheckOutlined style={{ color: 'green' }} />
          <span>approved</span>
        </p>
      </>
    );
  };

  const getRejectedNode = () => {
    return (
      <>
        <p>
          <CloseOutlined style={{ color: 'red' }} />
          <span>rejected</span>
        </p>
      </>
    );
  };

  const columns: ProColumns<API.WorkFlowData>[] = [
    {
      title: 'Request No.',
      dataIndex: 'wfInstanceNo',
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
      title: 'Status',
      dataIndex: 'status',
      render: (dom, entity) => {
        let statusNode: ReactNode = getProgressNode();
        if (entity.status === 2 && entity.financeApproved) {
          statusNode = getApprovedNode();
        }

        if (entity.status === 2 && !entity.financeApproved) {
          statusNode = getRejectedNode();
        }

        return statusNode;
      },
      // valueEnum: {
      //   0: {
      //     text: 'in progress',
      //     status: 'Processing',
      //   },
      //   1: {
      //     text: 'suspended',
      //     status: 'default',
      //   },
      //   2: {
      //     text: 'approved',
      //     status: 'Success',
      //   },
      //   3: {
      //     text: 'terminated',
      //     status: 'Error',
      //   },
      // },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.WorkFlowData, API.PageParams>
        headerTitle={'Request List'}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={getWorkFlowRequests}
        columns={columns}
      />
    </PageContainer>
  );
};

export default WFList;
