import React, { useState, MouseEvent as ReactMouseEvent } from 'react';
import ReactFlow, {
  Node,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { Modal, Form, Input, Drawer, Button } from 'antd';

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const Template: React.FC = () => {
  const [form] = Form.useForm();
  const [menuVisible, setMenuVisible] = useState(false);

  const initNodes = [
    {
      id: '1',
      type: 'input',
      data: {
        label: 'Submit Request',
      },
      position: { x: 250, y: 0 },
    },
    {
      id: '2',
      data: {
        label: 'Finance Approve',
      },
      position: { x: 250, y: 100 },
      style: {
        background: 'lightgreen',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
      },
    },
    {
      id: '3',
      data: {
        label: 'Cashier Refund',
      },
      position: { x: 350, y: 200 },
      style: {
        background: '#D6D5E6',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
      },
    },
    {
      id: '4',
      position: { x: 150, y: 200 },
      data: {
        label: 'Reject Notification',
      },
    },
  ];

  const initEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      label: 'Approve',
      style: { stroke: 'green' },
      animated: true,
    },
    //   {
    //     id: 'e3-4',
    //     source: '2',
    //     target: '4',
    //     animated: true,
    //     label: 'animated edge',
    //   },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      arrowHeadType: 'arrowclosed',
      label: 'Reject',
      style: { stroke: 'red' },
    },
    //   {
    //     id: 'e5-6',
    //     source: '5',
    //     target: '6',
    //     type: 'smoothstep',
    //     label: 'smooth step edge',
    //   },
    //   {
    //     id: 'e5-7',
    //     source: '5',
    //     target: '7',
    //     type: 'step',
    //     style: { stroke: '#f6ab6c' },
    //     label: 'a step edge',
    //     animated: true,
    //     labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
    //   },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [currentNode, setCurrentNode] = useState<Node>();

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  const onFinish = (values: any) => {
    setMenuVisible(false);
    if (currentNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === currentNode.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            node.data = {
              ...node.data,
              label: values.nodename,
            };
          }

          return node;
        }),
      );
    }
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={(event: ReactMouseEvent, node: Node) => {
          event.preventDefault();
          setMenuVisible(true);
          setCurrentNode(node);
          form.setFieldsValue({ nodename: node.data.label.toString() });
        }}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
      >
        {/* <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return '#ff0072';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      /> */}
        {/* <Controls /> */}
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      <Drawer
        title="Actions"
        placement="right"
        onClose={() => setMenuVisible(false)}
        visible={menuVisible}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="Node Name"
            name="nodename"
            rules={[{ required: true, message: 'Please input node name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Requestor"
            name="requestor"
            rules={[{ message: 'Please input requestor' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button type="primary" danger style={{ marginLeft: '10px' }}>
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Template;
