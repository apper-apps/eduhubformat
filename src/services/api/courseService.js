import coursesData from "@/services/mockData/courses.json";
import React from "react";
import Error from "@/components/ui/Error";

let courses = [...coursesData.map(course => ({
  ...course,
  capacity: 30,
  enrolled: Math.floor(Math.random() * 25) + 5 // Random enrolled between 5-29
}))];

// Mock cohorts data for each course
const cohortsByCourse = {
  1: [
    { id: 101, name: "12기", startDate: "2024-04-15T09:00:00Z", capacity: 30, enrolled: 18 },
    { id: 102, name: "13기", startDate: "2024-06-01T09:00:00Z", capacity: 30, enrolled: 3 }
  ],
  2: [
    { id: 201, name: "8기", startDate: "2024-04-20T10:00:00Z", capacity: 25, enrolled: 22 },
    { id: 202, name: "9기", startDate: "2024-06-15T10:00:00Z", capacity: 25, enrolled: 5 }
  ],
  3: [
    { id: 301, name: "5기", startDate: "2024-05-01T14:00:00Z", capacity: 20, enrolled: 20 },
    { id: 302, name: "6기", startDate: "2024-07-01T14:00:00Z", capacity: 20, enrolled: 2 }
  ]
};

// Generate cohorts for other courses
for (let i = 4; i <= 12; i++) {
  cohortsByCourse[i] = [
    {
      id: i * 100 + 1,
      name: `${Math.floor(Math.random() * 10) + 5}기`,
      startDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      capacity: 25 + Math.floor(Math.random() * 10),
      enrolled: Math.floor(Math.random() * 20) + 2
    }
  ];
}
let nextId = Math.max(...coursesData.map(course => course.Id)) + 1;

export const getCourses = async (searchQuery = '', categoryFilter = '', priceRange = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredCourses = [...courses];
  
  // Apply search filter
  if (searchQuery.trim()) {
    filteredCourses = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply category filter
  if (categoryFilter && categoryFilter !== '전체') {
    filteredCourses = filteredCourses.filter(course => course.category === categoryFilter);
  }
  
  // Apply price range filter
  if (priceRange.min !== undefined && priceRange.min !== '') {
    filteredCourses = filteredCourses.filter(course => course.price >= parseInt(priceRange.min));
  }
  if (priceRange.max !== undefined && priceRange.max !== '') {
    filteredCourses = filteredCourses.filter(course => course.price <= parseInt(priceRange.max));
  }
  
  return filteredCourses;
};

export const getCourseById = async (id) => {
  // Validate ID is integer
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('유효하지 않은 강의 ID입니다.');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const course = courses.find(course => course.Id === id);
  
  if (!course) {
    throw new Error('강의를 찾을 수 없습니다.');
  }
  
  return { ...course };
};

export const getCohorts = async (courseId) => {
  // Validate ID is integer
  if (!Number.isInteger(courseId) || courseId <= 0) {
    throw new Error('유효하지 않은 강의 ID입니다.');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const cohorts = cohortsByCourse[courseId] || [];
  
  return [...cohorts];
};

export const updateCohortEnrollment = async (courseId, cohortId, increment = 1) => {
  if (!Number.isInteger(courseId) || courseId <= 0) {
    throw new Error('유효하지 않은 강의 ID입니다.');
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

    // Get cohort from Apper Collections
    const cohorts = await window.Apper.collection('Cohorts').find({
      where: { id: cohortId }
    });
    
    if (cohorts.length === 0) {
      throw new Error('해당 기수를 찾을 수 없습니다.');
    }

    const cohort = cohorts[0];
    const newEnrolledCount = (cohort.enrolled || 0) + increment;
    
    // Update enrollment count in Apper Collections
    await window.Apper.collection('Cohorts').update(cohortId, {
      enrolled: newEnrolledCount
    });
    
    return {
      ...cohort,
      enrolled: newEnrolledCount
    };
  } catch (error) {
    throw new Error('기수 정보 업데이트 중 오류가 발생했습니다: ' + error.message);
  }
};

export const createCourse = async (courseData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newCourse = {
    ...courseData,
    Id: nextId++,
    createdAt: new Date().toISOString()
  };
  
  courses.push(newCourse);
  return { ...newCourse };
};

export const updateCourse = async (id, courseData) => {
  // Validate ID is integer
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('유효하지 않은 강의 ID입니다.');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = courses.findIndex(course => course.Id === id);
  
  if (index === -1) {
    throw new Error('강의를 찾을 수 없습니다.');
  }
  
  courses[index] = {
    ...courses[index],
    ...courseData,
    Id: id // Ensure ID cannot be changed
  };
  
  return { ...courses[index] };
};

export const deleteCourse = async (id) => {
  // Validate ID is integer
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('유효하지 않은 강의 ID입니다.');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = courses.findIndex(course => course.Id === id);
  
  if (index === -1) {
    throw new Error('강의를 찾을 수 없습니다.');
  }
  
const deletedCourse = courses[index];
  courses.splice(index, 1);
  
  return { ...deletedCourse };
};