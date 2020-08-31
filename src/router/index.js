import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import users from '@/views/users/index.vue'
import roles from '@/views/users/roles.vue'
import journal from '@/views/users/journal.vue'
import system from '@/views/users/system.vue'
import scaleIncome from '@/views/visualization/scaleIncome.vue'

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: login,
        },
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/home',
            name: 'home',
            component: home,
            children:[
                { path: '/users', component: users },// /users
                { path: '/roles', component: roles },
                { path: '/journal', component: journal },
                { path: '/system', component: system },
                { path: '/scaleIncome', component: scaleIncome },
            ]
        },
        // {
        //     path: '/home',
        //     name: 'home',
        //     component: home,
        //     children:[
        //         { path: '/scaleIncome', component: scaleIncome },
        //     ]
        // }
    ]
})
// export default router