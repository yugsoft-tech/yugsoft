import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, AttendanceStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get dashboard statistics for admin
   */
  async getAdminStats(currentUser: {
    userId: string;
    role: Role;
    schoolId?: string;
  }) {
    if (!currentUser.schoolId) {
      throw new ForbiddenException(
        'School admin must be associated with a school',
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total students count
    const totalStudents = await this.prisma.student.count({
      where: {
        schoolId: currentUser.schoolId,
        user: {
          isActive: true,
        },
      },
    });

    // Get total teachers count
    const totalTeachers = await this.prisma.teacher.count({
      where: {
        schoolId: currentUser.schoolId,
        user: {
          isActive: true,
        },
      },
    });

    // Get active classes count
    const activeClasses = await this.prisma.class.count({
      where: {
        schoolId: currentUser.schoolId,
      },
    });

    // Get today's attendance statistics
    const todayAttendance = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        student: {
          schoolId: currentUser.schoolId,
        },
      },
    });

    const totalTodayAttendance = todayAttendance.length;
    const presentCount = todayAttendance.filter(
      (a) => a.status === AttendanceStatus.PRESENT,
    ).length;
    const attendancePercentage =
      totalTodayAttendance > 0
        ? Math.round((presentCount / totalTodayAttendance) * 100)
        : 0;

    // Get recent activities (last 10) - filter by users in the same school
    const recentActivities = await this.prisma.auditLog.findMany({
      where: {
        user: {
          schoolId: currentUser.schoolId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      statistics: {
        totalStudents,
        totalTeachers,
        activeClasses,
        todayAttendance: attendancePercentage,
      },
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        action: activity.action,
        user: activity.user
          ? `${activity.user.firstName} ${activity.user.lastName}`
          : 'System',
        createdAt: activity.createdAt,
      })),
    };
  }

  /**
   * Get teacher dashboard statistics
   */
  async getTeacherStats(userId: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!teacher) throw new ForbiddenException('Teacher profile not found');

    const classesCount = await this.prisma.class.count({
      where: { schoolId },
    });

    const announcements = await this.prisma.notice.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const upcomingHomework = await this.prisma.homework.findMany({
      where: { teacherId: teacher.id },
      orderBy: { dueDate: 'asc' },
      take: 5,
      include: { class: true, subject: true },
    });

    return {
      statistics: {
        myClasses: classesCount, // Simplified for now
        totalStudents: await this.prisma.student.count({ where: { schoolId } }),
        pendingAssignments: upcomingHomework.length,
      },
      announcements,
      upcomingHomework,
    };
  }

  /**
   * Get student dashboard statistics
   */
  async getStudentStats(userId: string, schoolId: string) {
    console.log(`[DashboardService] Getting stats for student: ${userId}`);
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        class: true,
        section: true,
      },
    });

    if (!student) {
      console.error(`[DashboardService] Student profile not found for userId: ${userId}`);
      throw new ForbiddenException('Student profile not found');
    }

    const homework = await this.prisma.homework.findMany({
      where: { classId: student.classId },
      orderBy: { dueDate: 'desc' },
      take: 5,
      include: { subject: true, teacher: { include: { user: true } } },
    });

    const attendance = await this.prisma.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: 'desc' },
      take: 30,
    });

    const presentDays = attendance.filter(
      (a) => a.status === AttendanceStatus.PRESENT,
    ).length;
    const attendanceRate =
      attendance.length > 0
        ? Math.round((presentDays / attendance.length) * 100)
        : 0;

    return {
      statistics: {
        attendanceRate,
        pendingHomework: homework.length,
        examsUpcoming: 0,
      },
      homework,
      recentAttendance: attendance.slice(0, 5),
    };
  }

  /**
   * Get parent dashboard statistics
   */
  async getParentStats(userId: string, schoolId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: {
        students: {
          include: {
            user: true,
            class: true,
            fees: {
              where: { status: 'PENDING' },
            },
          },
        },
      },
    });

    if (!parent) throw new ForbiddenException('Parent profile not found');

    const childrenData = parent.students.map((child) => {
      const pendingFees = child.fees.reduce((sum, fee) => sum + fee.amount, 0);
      return {
        id: child.id,
        name: `${child.user.firstName} ${child.user.lastName}`,
        class: child.class.name,
        pendingFees,
      };
    });

    return {
      children: childrenData,
      totalPendingFees: childrenData.reduce(
        (sum, child) => sum + child.pendingFees,
        0,
      ),
    };
  }

  /**
   * Get super admin global statistics
   */
  async getSuperAdminStats() {
    const totalSchools = await this.prisma.school.count();
    const totalStudents = await this.prisma.student.count();
    const totalTeachers = await this.prisma.teacher.count();
    const totalUsers = await this.prisma.user.count();

    const recentSchools = await this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      statistics: {
        totalSchools,
        totalStudents,
        totalTeachers,
        totalUsers,
      },
      recentSchools,
    };
  }
}
