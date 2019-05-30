import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'GSMP'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
// { path: 'home', title: {i18n:'home'}, name: 'home_index', component: () => import('@/views/information-manage/channel.vue') },
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        // { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/default.vue') },
        { path: 'home', title: {i18n:'home'}, name: 'home_index', component: () => import('@/views/information-manage/channel.vue') },
        { path: 'ownspace', title: {i18n: 'personalCenter'}, name: 'ownspaceIndex', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'appColumnSetting', title: {i18n: 'appColumnSetting'}, name: 'appColumnSetting', component: () => import('@/views/content-management/app-column-setting.vue') }, // 用于展示带参路由
        { path: 'catalogConfigApps', title: {i18n: 'configureType'}, name: 'catalogConfigApps', component: () => import('@/views/content-management/market-column-config.vue') }, // 用于展示带参路由
        { path: 'generalColumnSetting', title: {i18n: 'generalColumnSetting'}, name: 'generalColumnSetting', component: () => import('@/views/content-management/general-column-setting.vue') }, // 用于展示带参路由
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
       {
           path: '/channelallocation',
           icon: 'md-hammer',
           name: 'channelallocation',
           title: {i18n: 'channelallocation'},
           component:Main,
           children:[
              {path: 'offerconfigure' ,title:{i18n:'offerconfigure'},icon: 'ios-flash',name: 'offerconfigure' , component:()=>import('@/views/channel-allocation/offer-configure.vue')},
              {path: 'linkconfigure' ,title:{i18n:'linkconfigure'},icon: 'ios-flash',name: 'linkconfigure' , component:()=>import('@/views/channel-allocation/link-configure.vue')},
           ]
       },
       {
           path: '/informationmanage',
           icon: 'md-hammer',
           name: 'informationmanage',
           title: {i18n: 'informationmanage'},
           component:Main,
           children:[
               {path: 'channel',title:{i18n:'channel'},icon:'ios-flash',name:'channel',component:()=>import('@/views/information-manage/channel.vue')},
               {path: 'country',title:{i18n:'country'},icon:'ios-flash',name:'country',component:()=>import('@/views/information-manage/country.vue')},
               {path: 'operator',title:{i18n:'operator'},icon:'ios-flash',name:'operator',component:()=>import('@/views/information-manage/operator.vue')},
               {path: 'application',title:{i18n:'application'},icon:'ios-flash',name:'application',component:()=>import('@/views/information-manage/application.vue')},
               {path: 'violation',title:{i18n:'violation'},icon:'ios-flash',name:'violation',component:()=>import('@/views/information-manage/violation.vue')},
           ]
       },
       {
            path: '/recordquery',
            icon: 'md-hammer',
            name: 'recordquery',
            title: {i18n:'recordquery'},
            component: Main,
            children:[
                {path: 'notification' ,title: {i18n: 'notification'} ,icon: 'ios-flash' ,name:'notification' ,component:()=>import('@/views/record-query/notification-query.vue')},
                {path: 'click' ,title: {i18n: 'click'} ,icon: 'ios-flash' ,name:'ios-flash' ,component:()=>import('@/views/record-query/click-query.vue')},
                {path: 'conversion ' ,title: {i18n: 'conversion'} ,icon: 'ios-flash' ,name:'conversion' ,component:()=>import('@/views/record-query/conversion-query.vue')},
            ]
       },
       {
            path: '/budgetmanage',
            name: 'budgetmanage',
            icon: 'md-hammer',
            title: {i18n:'budgetmanage'},
            component:Main,
            children:[
                {path:'channelbudget',title:{i18n:'channelbudget'},icon:'ios-flash',name:'channelbudget',component:()=>import('@/views/budget-manage/channel-budget.vue')},
                {path:'regionalstatistics',title:{i18n:'regionalstatistics'},icon:'ios-flash',name:'regionalstatistics',component:()=>import('@/views/budget-manage/regional-statistics.vue')},
                {path:'revenuestatistics',title:{i18n:'revenuestatistics'},icon:'ios-flash',name:'revenuestatistics',component:()=>import('@/views/budget-manage/revenue-statistics.vue')},
                {path:'billmanage',title:{i18n:'billmanage'},icon:'ios-flash',name:'billmanage',component:()=>import('@/views/budget-manage/bill-manage.vue')}
            ]
       }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
