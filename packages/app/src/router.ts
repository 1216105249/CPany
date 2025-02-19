import { createRouter, createWebHistory } from 'vue-router';

/* __imports__ */

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue'),
    meta: {
      title: 'CPany - Competitive Programming Statistic'
    }
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('./pages/Members.vue'),
    meta: {
      title: '成员 - CPany'
    }
  },
  {
    path: '/user/:id',
    name: 'EmptyUser',
    component: () => import('./pages/User/Empty.vue'),
    meta: {
      title: '错误 - CPany'
    },
    beforeEnter(to: any) {
      // Hack: decode URI
      const source = decodeURI(to.fullPath);
      if (source !== to.fullPath) {
        return source;
      }
    }
  },
  {
    path: '/contests',
    name: 'Contests',
    component: () => import('./pages/Contest/Main.vue'),
    meta: {
      title: '比赛 - CPany'
    }
  },
  {
    path: '/contest/codeforces/:id',
    name: 'CodeforcesContestDetail',
    component: () => import('./pages/Contest/Codeforces.vue'),
    meta: {
      title: 'Codeforces - CPany'
    }
  },
  {
    path: '/codeforces',
    name: 'Codeforces',
    component: () => import('./pages/Codeforces.vue'),
    meta: {
      title: 'Codeforces - CPany'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./pages/About.vue'),
    meta: {
      title: '关于 - CPany'
    }
  }
];

/* __contests__ */

routes.push({
  path: '/contest/:platform/:id',
  name: 'EmptyContest',
  component: () => import('./pages/Contest/Empty.vue'),
  meta: {
    title: '错误 - CPany'
  }
});

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to) => {
  document.title = to.meta.title;
});
