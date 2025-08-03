import coursesData from '@/services/mockData/courses.json';

let courses = [...coursesData];
let nextId = Math.max(...coursesData.map(course => course.Id)) + 1;

export const getCourses = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...courses];
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

export const getCourses = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...coursesData];
};

export const getCourseById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const course = coursesData.find(course => course.Id === parseInt(id));
  if (!course) {
    throw new Error("Course not found");
  }
  return { ...course };
};

export const createCourse = async (courseData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const newId = Math.max(...coursesData.map(course => course.Id)) + 1;
  const newCourse = {
    Id: newId,
    ...courseData,
    createdAt: new Date().toISOString(),
    students: 0,
  };
  coursesData.push(newCourse);
  return { ...newCourse };
};

export const updateCourse = async (id, courseData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const courseIndex = coursesData.findIndex(course => course.Id === parseInt(id));
  if (courseIndex === -1) {
    throw new Error("Course not found");
  }
  coursesData[courseIndex] = { ...coursesData[courseIndex], ...courseData };
  return { ...coursesData[courseIndex] };
};

export const deleteCourse = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const courseIndex = coursesData.findIndex(course => course.Id === parseInt(id));
  if (courseIndex === -1) {
    throw new Error("Course not found");
  }
  const deletedCourse = coursesData.splice(courseIndex, 1)[0];
  return { ...deletedCourse };
};