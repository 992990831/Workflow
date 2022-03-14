import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';
//import { useIntl, FormattedMessage } from 'umi';
import { useHistory } from 'umi';

const Welcome: React.FC = () => {
  const history = useHistory();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 8 },
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    const data = {
      Requestor: 'Andy Hu',
      Finance: 'Jessy Ge',
      Amount: values.amount,
      Comment: values.comment,
    };
    axios
      .post('http://localhost:5000/api/workflow/ApprovalWorkflow/1', JSON.stringify(data), {
        headers: headers,
      })
      .then((res) => {
        console.log('res=>', res);
        message.info('Succeed!');
        history.push('workflow/list');
      })
      .catch((error) => {
        console.log(error);
        message.error('Error!');
      });

    console.log(values);
  };

  return (
    <PageContainer title="New Request">
      <Card>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="comment" label="Comment" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
