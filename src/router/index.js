import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Rigister from '@/components/register'
import Welcome from '@/components/Welcome'
import HOME from '@/components/Home'
import Classify from '@/components/Classify/Classify'
import Shopping from '@/components/Shopping/Shopping'
import NEWShopping from '@/components/Shopping/newShopping'
import EddShopping from '@/components/Shopping/Compile'

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect: '/login'},
    {path:'/login',name:'login',component:Login},
    {path:'/register',name:'register',component:Rigister},
    {path:'/home',
     component: HOME,
     redirect:'/welcome',
     children:[
        { path: '/welcome',name: 'welcome', component: Welcome},
        { path: '/Classify',name: 'classify', component: Classify},
        { path: '/shopping',name: 'shopping',component: Shopping,},
        {path:'/shopping/newshopping',name:"newshopping",component:NEWShopping},
        {path:'/shopping/Compile/:id', name:"compile",component:EddShopping},
      ]
    },
    
]

const router = new VueRouter({
  mode:'history',
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path =='/login' || to.path =='/register')return next()
  const tokens = localStorage.access_token;
  
  if(!tokens)return next('/login')
  next()
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
