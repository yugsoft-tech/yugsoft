import { PrismaClient, Role, Gender } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding all roles...')

  // ===============================
  // PASSWORDS
  // ===============================
  const superAdminPass = await bcrypt.hash('SuperAdmin@123', 10)
  const adminPass = await bcrypt.hash('Admin@123', 10)
  const teacherPass = await bcrypt.hash('Teacher@123', 10)
  const studentPass = await bcrypt.hash('Student@123', 10)
  const parentPass = await bcrypt.hash('Parent@123', 10)

  // ===============================
  // SUPER ADMIN
  // ===============================
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@erp.com' },
    update: {},
    create: {
      email: 'superadmin@erp.com',
      password: superAdminPass,
      role: Role.SUPER_ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '9999999999',
    },
  })

  // ===============================
  // SCHOOL
  // ===============================
  const school = await prisma.school.upsert({
    where: { code: 'DEMO_SCHOOL' },
    update: {},
    create: {
      name: 'Demo Public School',
      code: 'DEMO_SCHOOL',
      address: 'Jaipur, Rajasthan',
      phone: '9112345678',
      email: 'demo@school.com',
    },
  })

  // ===============================
  // SCHOOL ADMIN
  // ===============================
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: adminPass,
      role: Role.SCHOOL_ADMIN,
      firstName: 'School',
      lastName: 'Admin',
      phone: '9888888888',
      schoolId: school.id,
    },
  })

  // ===============================
  // CLASS + SECTION
  // ===============================
  const class10 = await prisma.class.create({
    data: {
      name: 'Class 10',
      schoolId: school.id,
    },
  })

  const sectionA = await prisma.section.create({
    data: {
      name: 'A',
      classId: class10.id,
      schoolId: school.id,
    },
  })

  // ===============================
  // TEACHER
  // ===============================
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      password: teacherPass,
      role: Role.TEACHER,
      firstName: 'Amit',
      lastName: 'Sharma',
      phone: '9777777777',
      schoolId: school.id,
    },
  })

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      qualification: 'M.Sc Mathematics',
      experience: 5,
      schoolId: school.id,
    },
  })

  // ===============================
  // STUDENT
  // ===============================
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: {},
    create: {
      email: 'student@school.com',
      password: studentPass,
      role: Role.STUDENT,
      firstName: 'Rahul',
      lastName: 'Verma',
      phone: '9666666666',
      schoolId: school.id,
    },
  })

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      rollNumber: '10A-01',
      gender: Gender.MALE,
      dob: new Date('2009-05-12'),
      schoolId: school.id,
      classId: class10.id,
      sectionId: sectionA.id,
    },
  })

  // ===============================
  // PARENT
  // ===============================
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@school.com' },
    update: {},
    create: {
      email: 'parent@school.com',
      password: parentPass,
      role: Role.PARENT,
      firstName: 'Suresh',
      lastName: 'Verma',
      phone: '9555555555',
      schoolId: school.id,
    },
  })

  await prisma.parent.create({
    data: {
      userId: parentUser.id,
      schoolId: school.id,
      students: {
        connect: { id: student.id },
      },
    },
  })

  // ===============================
  // AUDIT LOGS
  // ===============================
  await prisma.auditLog.createMany({
    data: [
      { action: 'SUPER_ADMIN_SEEDED', userId: superAdmin.id },
      { action: 'SCHOOL_ADMIN_SEEDED', userId: schoolAdmin.id },
      { action: 'TEACHER_SEEDED', userId: teacherUser.id },
      { action: 'STUDENT_SEEDED', userId: studentUser.id },
      { action: 'PARENT_SEEDED', userId: parentUser.id },
    ],
  })

  console.log('✅ ALL ROLES SEEDED SUCCESSFULLY')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
