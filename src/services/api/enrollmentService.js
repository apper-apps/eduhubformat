import { updateCohortEnrollment } from '@/services/api/courseService';

// Mock enrollment data
let enrollments = [
  { Id: 1, courseId: 1, cohortId: 101, userId: 1, status: 'enrolled', enrolledAt: '2024-03-01T10:00:00Z' },
  { Id: 2, courseId: 2, cohortId: 201, userId: 1, status: 'waitlist', enrolledAt: '2024-03-02T11:00:00Z' }
];

let nextEnrollmentId = 3;

export const getAllEnrollments = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [...enrollments];
};

export const getEnrollmentById = async (id) => {
  // Validate ID is integer
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('유효하지 않은 등록 ID입니다.');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const enrollment = enrollments.find(enrollment => enrollment.Id === id);
  
  if (!enrollment) {
    throw new Error('등록 정보를 찾을 수 없습니다.');
  }
  
  return { ...enrollment };
};

export const enrollInCourse = async (courseId, cohortId, userId = 1) => {
  // Validate inputs
  if (!Number.isInteger(courseId) || courseId <= 0) {
    throw new Error('유효하지 않은 강의 ID입니다.');
  }
  
  if (!Number.isInteger(cohortId) || cohortId <= 0) {
    throw new Error('유효하지 않은 기수 ID입니다.');
  }
  
  try {
    // Initialize Apper SDK if not already done
    if (!window.Apper) {
      throw new Error('Apper SDK가 로드되지 않았습니다.');
    }

    await window.Apper.init({
      projectId: import.meta.env.VITE_APPER_PROJECT_ID,
      publicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Check if already enrolled using Apper Collections
    const existingEnrollments = await window.Apper.collection('Enrollments').find({
      where: {
        cohort_id: cohortId,
        user_id: userId
      }
    });
    
    if (existingEnrollments.length > 0) {
      throw new Error('이미 해당 강의에 등록되어 있습니다.');
    }

    // Get current cohort data
    const cohorts = await window.Apper.collection('Cohorts').find({
      where: { id: cohortId }
    });
    
    if (cohorts.length === 0) {
      throw new Error('해당 기수를 찾을 수 없습니다.');
    }

    const cohort = cohorts[0];
    
    // Determine enrollment status based on capacity
    const currentEnrolled = cohort.enrolled || 0;
    const status = currentEnrolled < cohort.capacity ? 'enrolled' : 'waitlist';
    
    // Create new enrollment in Apper Collections
    const newEnrollment = await window.Apper.collection('Enrollments').create({
      cohort_id: cohortId,
      user_id: userId,
      status: status,
      created_at: new Date().toISOString()
    });
    
    // Update cohort enrollment count
    await window.Apper.collection('Cohorts').update(cohortId, {
      enrolled: currentEnrolled + 1
    });
    
    return {
      Id: newEnrollment.id,
      courseId,
      cohortId,
      userId,
      status,
      enrolledAt: newEnrollment.created_at
    };
  } catch (error) {
    throw new Error('수강신청 중 오류가 발생했습니다: ' + error.message);
  }
};

export const cancelEnrollment = async (enrollmentId) => {
  // Validate ID is integer
  if (!Number.isInteger(enrollmentId) || enrollmentId <= 0) {
    throw new Error('유효하지 않은 등록 ID입니다.');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const enrollmentIndex = enrollments.findIndex(e => e.Id === enrollmentId);
  
  if (enrollmentIndex === -1) {
    throw new Error('등록 정보를 찾을 수 없습니다.');
  }
  
  const enrollment = enrollments[enrollmentIndex];
  
  try {
    // Decrease cohort enrollment count
    await updateCohortEnrollment(enrollment.courseId, enrollment.cohortId, -1);
    
    // Remove enrollment
    enrollments.splice(enrollmentIndex, 1);
    
    return { ...enrollment };
  } catch (error) {
    throw new Error('수강신청 취소 중 오류가 발생했습니다: ' + error.message);
  }
};