import coursesData from '@/services/mockData/courses.json';

let courses = [...coursesData];
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