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

class CourseService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'course';
  }

  async getAll(searchQuery = '', categoryFilter = '', priceRange = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "coverImage" } },
          { field: { Name: "price" } },
          { field: { Name: "cohort" } },
          { field: { Name: "category" } },
          { field: { Name: "instructor" } },
          { field: { Name: "description" } },
          { field: { Name: "duration" } },
          { field: { Name: "students" } },
          { field: { Name: "rating" } },
          { field: { Name: "level" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "intro_md" } },
          { field: { Name: "introduction" } },
          { field: { Name: "sampleVideoId" } },
          { field: { Name: "objectives" } },
          { field: { Name: "curriculum" } },
          { field: { Name: "capacity" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "spots_left" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
          }
        ]
      };

      // Add search filter
  if (searchQuery.trim()) {
        params.where = [
          {
            FieldName: "title",
            Operator: "Contains",
            Values: [searchQuery]
          }
        ];
      }

      // Add category filter
  if (categoryFilter && categoryFilter !== '전체') {
        if (!params.where) params.where = [];
        params.where.push({
          FieldName: "category",
          Operator: "EqualTo",
          Values: [categoryFilter]
        });
      }

      // Add price range filter
  if (priceRange.min !== undefined && priceRange.min !== '') {
        if (!params.where) params.where = [];
        params.where.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseFloat(priceRange.min)]
        });
  }
  if (priceRange.max !== undefined && priceRange.max !== '') {
        if (!params.where) params.where = [];
        params.where.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [parseFloat(priceRange.max)]
        });
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Handle empty results
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(course => ({
        Id: course.Id,
        title: course.title || course.Name || "",
        coverImage: course.coverImage || "",
        price: course.price || 0,
        cohort: course.cohort || "",
        category: course.category || "",
        instructor: course.instructor || "",
        description: course.description || "",
        duration: course.duration || "",
        students: course.students || 0,
        rating: course.rating || 0,
        level: course.level || "초급",
        createdAt: course.createdAt || course.CreatedOn || new Date().toISOString(),
        intro_md: course.intro_md || "",
        introduction: course.introduction || course.description || "",
        sampleVideoId: course.sampleVideoId || "",
        objectives: course.objectives ? JSON.parse(course.objectives) : [],
        curriculum: course.curriculum ? JSON.parse(course.curriculum) : [],
        capacity: course.capacity || 30,
        enrolled: course.enrolled || 0,
        spots_left: course.spots_left || (course.capacity - course.enrolled),
        tags: course.Tags || "",
        owner: course.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error("Error fetching courses:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Course ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "coverImage" } },
          { field: { Name: "price" } },
          { field: { Name: "cohort" } },
          { field: { Name: "category" } },
          { field: { Name: "instructor" } },
          { field: { Name: "description" } },
          { field: { Name: "duration" } },
          { field: { Name: "students" } },
          { field: { Name: "rating" } },
          { field: { Name: "level" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "intro_md" } },
          { field: { Name: "introduction" } },
          { field: { Name: "sampleVideoId" } },
          { field: { Name: "objectives" } },
          { field: { Name: "curriculum" } },
          { field: { Name: "capacity" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "spots_left" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Course not found with ID: ${id}`);
      }

      const course = response.data;
      
      // Map database fields to UI format
      return {
        Id: course.Id,
        title: course.title || course.Name || "",
        coverImage: course.coverImage || "",
        price: course.price || 0,
        cohort: course.cohort || "",
        category: course.category || "",
        instructor: course.instructor || "",
        description: course.description || "",
        duration: course.duration || "",
        students: course.students || 0,
        rating: course.rating || 0,
        level: course.level || "초급",
        createdAt: course.createdAt || course.CreatedOn || new Date().toISOString(),
        intro_md: course.intro_md || "",
        introduction: course.introduction || course.description || "",
        sampleVideoId: course.sampleVideoId || "",
        objectives: course.objectives ? JSON.parse(course.objectives) : [],
        curriculum: course.curriculum ? JSON.parse(course.curriculum) : [],
        capacity: course.capacity || 30,
        enrolled: course.enrolled || 0,
        spots_left: course.spots_left || (course.capacity - course.enrolled),
        tags: course.Tags || "",
        owner: course.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching course with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(courseData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: courseData.title || "",
            title: courseData.title || "",
            coverImage: courseData.coverImage || "",
            price: courseData.price || 0,
            cohort: courseData.cohort || "",
            category: courseData.category || "",
            instructor: courseData.instructor || "",
            description: courseData.description || "",
            duration: courseData.duration || "",
            students: courseData.students || 0,
            rating: courseData.rating || 0,
            level: courseData.level || "초급",
            createdAt: new Date().toISOString(),
            intro_md: courseData.intro_md || courseData.introduction || "",
            introduction: courseData.introduction || courseData.intro_md || courseData.description || "",
            sampleVideoId: courseData.sampleVideoId || "",
            objectives: courseData.objectives ? JSON.stringify(courseData.objectives) : "",
            curriculum: courseData.curriculum ? JSON.stringify(courseData.curriculum) : "",
            capacity: courseData.capacity || 30,
            enrolled: courseData.enrolled || 0,
            spots_left: courseData.spots_left || (courseData.capacity - courseData.enrolled),
            Tags: courseData.tags || "",
            Owner: courseData.owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const course = successfulRecords[0].data;
          // Map database fields to UI format
          return {
            Id: course.Id,
            title: course.title || course.Name || "",
            coverImage: course.coverImage || "",
            price: course.price || 0,
            cohort: course.cohort || "",
            category: course.category || "",
            instructor: course.instructor || "",
            description: course.description || "",
            duration: course.duration || "",
            students: course.students || 0,
            rating: course.rating || 0,
            level: course.level || "초급",
            createdAt: course.createdAt || course.CreatedOn || new Date().toISOString(),
            intro_md: course.intro_md || "",
            introduction: course.introduction || course.description || "",
            sampleVideoId: course.sampleVideoId || "",
            objectives: course.objectives ? JSON.parse(course.objectives) : [],
            curriculum: course.curriculum ? JSON.parse(course.curriculum) : [],
            capacity: course.capacity || 30,
            enrolled: course.enrolled || 0,
            spots_left: course.spots_left || (course.capacity - course.enrolled),
            tags: course.Tags || "",
            owner: course.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error("Error creating course:", error.message);
      }
      throw error;
    }
  }

  async update(id, courseData) {
    try {
      if (!id) {
        throw new Error("Course ID is required");
      }

      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: courseData.title || "",
            title: courseData.title || "",
            coverImage: courseData.coverImage || "",
            price: courseData.price || 0,
            cohort: courseData.cohort || "",
            category: courseData.category || "",
            instructor: courseData.instructor || "",
            description: courseData.description || "",
            duration: courseData.duration || "",
            students: courseData.students || 0,
            rating: courseData.rating || 0,
            level: courseData.level || "초급",
            intro_md: courseData.intro_md || courseData.introduction || "",
            introduction: courseData.introduction || courseData.intro_md || courseData.description || "",
            sampleVideoId: courseData.sampleVideoId || "",
            objectives: courseData.objectives ? JSON.stringify(courseData.objectives) : "",
            curriculum: courseData.curriculum ? JSON.stringify(courseData.curriculum) : "",
            capacity: courseData.capacity || 30,
            enrolled: courseData.enrolled || 0,
            spots_left: courseData.spots_left || (courseData.capacity - courseData.enrolled),
            Tags: courseData.tags || "",
            Owner: courseData.owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update course ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const course = successfulUpdates[0].data;
          // Map database fields to UI format
    return {
            Id: course.Id,
            title: course.title || course.Name || "",
            coverImage: course.coverImage || "",
            price: course.price || 0,
            cohort: course.cohort || "",
            category: course.category || "",
            instructor: course.instructor || "",
            description: course.description || "",
            duration: course.duration || "",
            students: course.students || 0,
            rating: course.rating || 0,
            level: course.level || "초급",
            createdAt: course.createdAt || course.CreatedOn || new Date().toISOString(),
            intro_md: course.intro_md || "",
            introduction: course.introduction || course.description || "",
            sampleVideoId: course.sampleVideoId || "",
            objectives: course.objectives ? JSON.parse(course.objectives) : [],
            curriculum: course.curriculum ? JSON.parse(course.curriculum) : [],
            capacity: course.capacity || 30,
            enrolled: course.enrolled || 0,
            spots_left: course.spots_left || (course.capacity - course.enrolled),
            tags: course.Tags || "",
            owner: course.Owner || null
          };
        }
      }
  } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error("Error updating course:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Course ID is required for deletion");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete course ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error("Error deleting course:", error.message);
      }
      throw error;
    }
  }

  // Backward compatibility methods
  async getCourses(searchQuery = '', categoryFilter = '', priceRange = {}) {
    return this.getAll(searchQuery, categoryFilter, priceRange);
  }

  async getCourseById(id) {
    return this.getById(id);
  }

  async createCourse(courseData) {
    return this.create(courseData);
  }

  async updateCourse(id, courseData) {
    return this.update(id, courseData);
  }

  async deleteCourse(id) {
    return this.delete(id);
  }
}

export const courseService = new CourseService();

// Export individual functions for backward compatibility
export const getCourses = (searchQuery = '', categoryFilter = '', priceRange = {}) => 
  courseService.getCourses(searchQuery, categoryFilter, priceRange);

export const getCourseById = (id) => 
  courseService.getCourseById(id);

export const createCourse = (courseData) => 
  courseService.createCourse(courseData);

export const updateCourse = (id, courseData) => 
  courseService.updateCourse(id, courseData);

export const deleteCourse = (id) => 
  courseService.deleteCourse(id);

// Import cohort service for cohort-related functions
import { cohortService } from './cohortService.js';

export const getCohorts = async (courseId) => {
  return cohortService.getByCourseId(courseId);
};

export const updateCohortEnrollment = async (courseId, cohortId, increment = 1) => {
  return cohortService.updateEnrollment(cohortId, increment);
};