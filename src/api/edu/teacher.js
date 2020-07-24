import request from '@/utils/request'

export default {


  getTeacherListPage(page, limit, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${page}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },
  removeTeacherById(teacherId) {
    return request({
      url: `/eduservice/teacher/${teacherId}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: "/eduservice/teacher/addTeacher",
      method: 'post',
      data: teacher
    })
  },
  getTeacherById(id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
        url: `/eduservice/teacher/update`,
        method: 'post',
        data: teacher
    })
}
}


