import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login_2'
import Teacher from '@/pages/teacher/teacher_2'
import courseheader from '@/pages/teacher/components/courseheader'
import round1 from '@/pages/teacher/components/round1'
import round2 from '@/pages/teacher/components/round2'
import round3 from '@/pages/teacher/components/round3'
import round4 from '@/pages/teacher/components/round4'
import finishcourse from '@/pages/teacher/components/finishcourse'
import person from '@/pages/teacher/components/person_2'
import showpersonal from '@/pages/teacher/components/showpersonal'
import changepic from '@/pages/teacher/components/changepic'
import Student from '@/pages/student/student_2'
import studentpersonal from '@/pages/student/components/studentpersonal_2'
import studentcourse from '@/pages/student/components/studentcourse'
import courselist from '@/pages/student/components/courselist'
import choosencourse from '@/pages/student/components/choosencourse'
import choosenstudent from '@/pages/teacher/components/choosenstudent'
import choosenstudent2 from '@/pages/teacher/components/choosenstudent2'
import choosenstudent3 from '@/pages/teacher/components/choosenstudent3'
import choosenstudent4 from '@/pages/teacher/components/choosenstudent4'
import studentdetails from '@/pages/teacher/components/studentdetails'
import studentdetails2 from '@/pages/teacher/components/studentdetails2'
import studentdetails3 from '@/pages/teacher/components/studentdetails3'
import studentdetails4 from '@/pages/teacher/components/studentdetails4'


import change_password from "@/pages/login/change_password_2"
import a from "../pages/teacher/change_password_2"
import teacher_change_password from "@/pages/teacher/change_password_2"

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/teacher',
      name:'teacher',
      component:Teacher,
      children:[
        {
          path:'/person',
          name:'person',
          component:person,
        },
          {
            path:'/showpersonal',
            name:'showpersonal',
            component:showpersonal,
          },
          {
            path:'/changepic',
            name:'changepic',
            component:changepic,
          },
          {path:'/choosenstudent/:courseid/:groupid',
          name:'choosenstudent',
          component:choosenstudent,

          },
          {path:'/choosenstudent2/:courseid/:groupid',
          name:'choosenstudent2',
          component:choosenstudent2,

          },
          {path:'/choosenstudent3/:courseid/:groupid',
          name:'choosenstudent3',
          component:choosenstudent3,

          },
          {path:'/choosenstudent4/:courseid/:groupid',
          name:'choosenstudent4',
          component:choosenstudent4,

          },
          {path:'/studentdetails/:courseid/:groupid',
          name:'studentdetails',
          component:studentdetails,

          },
          {path:'/studentdetails2/:courseid/:groupid',
          name:'studentdetails2',
          component:studentdetails2,

          },
          {path:'/studentdetails3/:courseid/:groupid',
          name:'studentdetails3',
          component:studentdetails3,

          },
          {path:'/studentdetails4/:courseid/:groupid',
          name:'studentdetails4',
          component:studentdetails4,

          },


      {
        path:'/courseheader',
        name:'courseheader',
        component:courseheader,
      },

      {
        path:'/finishcourse/:groupid',
        name:'finishcourse',
        component:finishcourse,

      },

      {
        path:'/round1//:courseid/:round/:limit/:groupid',
        name:'round1',
        component:round1,

      },
      {
        path:'/round2//:courseid/:round/:limit/:groupid',
        name:'round2',
        component:round2,

      },
      {
        path:'/round3//:courseid/:round/:limit/:groupid',
        name:'round3',
        component:round3,
        meta: {
          requireAuth: true,
          breadNumber: 3
        }
      },
      {
        path:'/round4/:courseid/:round/:limit/:groupid',
        name:'round4',
        component:round4,

      },
        {
          path: '/teacher_change_password',
          name: 'teacher_change_password',
          component: teacher_change_password
        },

    ]
    },
    { path:'/Student',
    name:'Student',
    component:Student,
    children:[
        {
          path:'/studentpersonal',
          name:'studentpersonal',
          component:studentpersonal,
        },
        {
          path:'/courselist',
          name:'courselist',
          component:courselist,
        },
        {
          path:'/studentcourse/:courseid/:isChoosen/:nowChoosen',
          name:'studentcourse',
          component:studentcourse,

        },
        {
          path:'/choosencourse',
          name:'choosencourse',
          component:choosencourse,

        },
      {
        path: '/change_password',
        name: 'change_password',
        component: change_password
      }


      ]
    }



    /*{
      path:'/teacher',
      name:'teacher',
      components:{
        default:Teacher,
        main:personal,
        header:courseheader
      }

    }*/
  ]
});

export default router;
