import coursesData from "@/services/mockData/courses.json";

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