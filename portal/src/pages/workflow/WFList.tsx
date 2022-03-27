import React, { ReactNode, useState } from 'react';
import { Drawer, Comment } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
//import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { getWorkFlowRequests } from '@/services/ant-design-pro/api';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';

const WFList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.WorkFlowData>();

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
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setShowDetail(true);
              setCurrentRow(entity);
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
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setShowDetail(false);
        }}
        closable={false}
      >
        {
          <ul>
            {currentRow?.steps.map((step: API.WorkFlowStep) => {
              return <li key={step.name}>
                <Comment
                  author={step.approver}
                  avatar={<img src={step.approver === 'Andy Hu' ? '/profile-andy hu.jpg' : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />}
                  content={
                    step.comment.indexOf('Approved') > 0 ? <p style={{ color: 'green' }}><CheckOutlined color='green' />{step.comment}</p> : step.comment
                  }
                />
              </li>
            })}
          </ul>

        }
      </Drawer>
    </PageContainer>
  );
};

export default WFList;
