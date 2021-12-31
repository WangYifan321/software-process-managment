import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/Login'
import Adm from '@/components/adm/Adm'

import Group from '@/components/adm/group/Group'
import Build from '@/components/adm/group/Build'
import Edit from '@/components/adm/group/Edit'

import Setting from '@/components/adm/setting/Setting'

import Group_choose from '@/components/adm/view/Group_choose'
import Student from '@/components/adm/view/Student'
import Teacher from '@/components/adm/view/Teacher'
import Editstudent from '@/components/adm/view/Editstudent'
import Editteacher from '@/components/adm/view/Editteacher'

import Group_choose2 from '@/components/adm/result/Group_choose2'
import First from '@/components/adm/result/First'
import Second from '@/components/adm/result/Second'
import Third from '@/components/adm/result/Third'
import Forth from '@/components/adm/result/Forth'

import Group_choose3 from '@/components/adm/course/Group_choose3'
import Courses from '@/components/adm/course/Courses'
import Coursesedit from '@/components/adm/course/Coursesedit'


Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/components/login/Login'
    },
    {
      path: '/components/login/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/components/adm/Adm',
      name: 'Adm',
      component: Adm,
      children: [{
          path: '/group/Group',
          name: 'Group',
          component: Group
        },
        {
          path: '/group/Build',
          name: 'Build',
          component: Build
        },
        {
          path: '/group/Edit',
          name: 'Edit',
          component: Edit
        },
        {
          path: '/setting/Setting',
          name: 'Setting',
          component: Setting
        },
        {
          path: '/view/Group_choose',
          name: 'Group_choose',
          component: Group_choose
        },
        {
          path: '/view/Student',
          name: 'Student',
          component: Student
        },
        {
          path: '/view/Teacher',
          name: 'Teacher',
          component: Teacher
        },
        {
          path: '/view/Editstudent',
          name: 'Editstudent',
          component: Editstudent
        },
        {
          path: '/view/Editteacher',
          name: 'Editteacher',
          component: Editteacher
        },
        {
          path: '/result/Group_choose2',
          name: 'Group_choose2',
          component: Group_choose2
        },
        {
          path: '/result/First',
          name: 'First',
          component: First
        },
        {
          path: '/result/Second',
          name: 'Second',
          component: Second
        },
        {
          path: '/result/Third',
          name: 'Third',
          component: Third
        },
        {
          path: '/result/Forth',
          name: 'Forth',
          component: Forth
        },
        {
          path: '/course/Group_choose3',
          name: 'Group_choose3',
          component: Group_choose3
        },
        {
          path: '/course/Courses',
          name: 'Courses',
          component: Courses
        },
        {
          path: '/course/Coursesedit',
          name: 'Coursesedit',
          component: Coursesedit
        }
      ]
    },

  ]
});

export default router;
