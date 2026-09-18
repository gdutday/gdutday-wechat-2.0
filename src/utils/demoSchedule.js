import { filterSchedule } from '@/utils/common.js'
import { scheduleStudentV2Adaptor } from '@/utils/convert/student-v2/schedule.js'

const courses = [
  { name: '高等数学(下)', teachers: ['王明', '李华'], places: ['教1-201', '教2-305'] },
  { name: '大学英语(4)', teachers: ['陈静', '刘芳'], places: ['文3-102', '文4-208'] },
  { name: '数据结构', teachers: ['张伟', '赵磊'], places: ['教3-410', '机房3-201'] },
  { name: '操作系统', teachers: ['孙鹏', '周涛'], places: ['教3-505', '机房3-301'] },
  { name: '计算机网络', teachers: ['吴婷', '郑宇'], places: ['教2-402', '教3-306'] },
  { name: '数据库原理', teachers: ['许强', '何雨'], places: ['教2-508', '机房2-105'] },
  { name: '软件工程', teachers: ['马琳', '高峰'], places: ['教3-202', '教3-208'] },
  { name: '人工智能导论', teachers: ['秦岚', '韩雪'], places: ['教1-108', '教2-318'] },
  { name: '大学物理(2)', teachers: ['李强', '王银海'], places: ['教1-419', '教1-421'] },
  { name: '电子技术基础', teachers: ['潘晴', '崔苗'], places: ['教3-307', '教2-523'] },
  { name: '体育(4)', teachers: ['曾俊玮', '陈刚'], places: ['田径场', '体育馆'] },
  { name: '形势与政策', teachers: ['余凯', '林芳'], places: ['5号大教室', '报告厅'] },
  { name: '中外美术鉴赏', teachers: ['齐顺利', '何娜'], places: ['艺术楼201', '教2-429'] },
  { name: '程序设计实践', teachers: ['黄琼雁', '蒋臻'], places: ['机房3-401', '机房2-203'] },
  { name: '创新创业基础', teachers: ['沈亮', '曹颖'], places: ['教3-105', '创业园'] },
  { name: '概率论与数理统计', teachers: ['杜鹏', '方圆'], places: ['教1-305', '教1-307'] },
]

const timeSlots = ['1,2', '3,4', '3,4,5', '6,7', '8,9', '10,11,12']

const createRandom = seed => {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const shuffle = (list, random) => {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const index = Math.floor(random() * (i + 1))
    ;[result[i], result[index]] = [result[index], result[i]]
  }
  return result
}

const createCoursePlan = seed => {
  const random = createRandom(seed)
  const shuffledCourses = shuffle(courses, random)
  const courseCount = 8 + Math.floor(random() * 4)
  const slots = shuffle(
    Array.from({length: 7}, (_, dayIndex) =>
      timeSlots.map(timeSlot => `${dayIndex + 1}-${timeSlot}`)
    ).flat(),
    random
  )

  return shuffledCourses.slice(0, courseCount).map((course, index) => {
    const [day, timeSlot] = slots[index].split('-')
    const startWeek = 1 + Math.floor(random() * 3)
    const endWeek = Math.min(20, startWeek + 13 + Math.floor(random() * 6))

    return {
      ...course,
      day: Number(day),
      timeSlot,
      startWeek,
      endWeek,
      teacher: course.teachers[Math.floor(random() * course.teachers.length)],
      place: course.places[Math.floor(random() * course.places.length)],
      description: `示例课程：第${startWeek}-${endWeek}周上课。`,
    }
  })
}

const createMockSchedule = seed => {
  const coursePlans = createCoursePlan(seed)
  const mockSchedule = {}

  for (let week = 1; week <= 20; week++) {
    mockSchedule[week] = coursePlans
      .filter(course => week >= course.startWeek && week <= course.endWeek)
      .map(course => ({
        courseName: course.name,
        coursePlace: course.place,
        courseTeacher: course.teacher,
        courseWeek: String(week),
        courseDay: course.day,
        courseSection: course.timeSlot,
        courseDescription: course.description,
      }))
  }

  return mockSchedule
}

export function buildDemoSchedule(seed = Date.now()) {
  return filterSchedule(scheduleStudentV2Adaptor(createMockSchedule(seed)))
}
