import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)
import hooks from './components/pages/basic/hooks.vue'
import methods from './components/pages/basic/methods.vue'
import usecom from './vuex/usecom.vue'

// admin project pages
import home from './components/pages/Home.vue'
import tags from './admin/pages/Tags.vue'
import categories from './admin/pages/Categories.vue'
import adminusers from './admin/pages/AdminUsers.vue'
import login from './admin/pages/Login.vue'
import role from './admin/pages/Role.vue'
import assignRole from './admin/pages/AssignRole.vue'
import blogs from './admin/pages/Blogs.vue'
import createBlog from './admin/pages/CreateBlog.vue'
import editBlog from './admin/pages/EditBlog.vue'
import notfound from './admin/pages/notfound.vue'



const routes = [
    {
        path: '/',
        component: home,
        name: 'home'
    },
    {
        path: '/tags',
        component: tags,
        name: 'tags'
    },
    {
        path: '/categories',
        component: categories,
        name: 'categories'
    },
    {
        path: '/adminusers',
        component: adminusers,
        name: 'adminusers'
    },
    {
        path: '/login',
        component: login,
        name: 'login'
    },
    {
        path: '/role',
        component: role,
        name: 'role'
    },
    {
        path: '/assignRole',
        component: assignRole,
        name: 'assignRole'
    },
    {
        path: '/createBlog',
        component: createBlog,
        name: 'createBlog'
    },
    {
        path: '/blogs',
        component: blogs,
        name: 'blogs'
    },
    {
        path: '/editBlog/:id',
        component: editBlog,
        name: 'editBlog',
        props: true
    },
    {
        path: '*',
        component: notfound,
        name: 'notfound'
    },
    
    {
        path: '/hooks',
        component: hooks
    },
    {
        path: '/methods',
        component: methods
    },
    {
        path: '/testvuex',
        component: usecom
    }
]

export default new Router({
    mode: 'history',
    routes
})