export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/orders/detail',
    component: './fleet/detail',
  },
  {
    path: '/welcome',
    name: 'New Request',
    icon: 'form',
    component: './Welcome',
  },
  // {
  //   path: '/orders',
  //   name: 'Fleet Orders',
  //   icon: 'audit',
  //   component: './fleet/pending',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '/orders/pending',
  //       name: 'Pending',
  //       icon: 'smile',
  //       component: './fleet/pending',
  //     },
  //     {
  //       path: '/orders/completed',
  //       name: 'Completed',
  //       icon: 'smile',
  //       component: './fleet/pending',
  //     },

  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   path: '/orders/detail',
  //   name: 'Detail',
  //   icon: 'audit',
  //   component: './fleet/detail',
  // },
  // {
  //   path: '/admin',
  //   name: 'Admin',
  //   icon: 'audit',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },

  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  // {
  //   name: 'Price Editor',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },

  {
    name: 'Request List',
    icon: 'table',
    path: '/workflow/list',
    access: 'canUser',
    component: './workflow/WFList',
  },

  {
    name: 'Finance - Approval',
    icon: 'table',
    path: '/finance/approval',
    access: 'canFinance',
    component: './finance/approval',
  },

  {
    name: 'Workflow Template',
    icon: 'table',
    path: '/workflow/template',
    access: 'canAdmin',
    component: './workflow/Template',
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
