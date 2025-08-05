class CohortService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'cohort';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "start_date" } },
          { field: { Name: "capacity" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "course_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "start_date",
            sorttype: "ASC"
          }
        ]
      };

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
      return response.data.map(cohort => ({
        id: cohort.Id,
        name: cohort.Name || "",
        startDate: cohort.start_date || new Date().toISOString(),
        capacity: cohort.capacity || 30,
        enrolled: cohort.enrolled || 0,
        courseId: cohort.course_id?.Id || cohort.course_id || null,
        spots_left: (cohort.capacity || 30) - (cohort.enrolled || 0),
        tags: cohort.Tags || "",
        owner: cohort.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cohorts:", error?.response?.data?.message);
      } else {
        console.error("Error fetching cohorts:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Cohort ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "start_date" } },
          { field: { Name: "capacity" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "course_id" } },
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
        throw new Error(`Cohort not found with ID: ${id}`);
      }

      const cohort = response.data;
      
      // Map database fields to UI format
      return {
        id: cohort.Id,
        name: cohort.Name || "",
        startDate: cohort.start_date || new Date().toISOString(),
        capacity: cohort.capacity || 30,
        enrolled: cohort.enrolled || 0,
        courseId: cohort.course_id?.Id || cohort.course_id || null,
        spots_left: (cohort.capacity || 30) - (cohort.enrolled || 0),
        tags: cohort.Tags || "",
        owner: cohort.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching cohort with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching cohort with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async getByCourseId(courseId) {
    try {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "start_date" } },
          { field: { Name: "capacity" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "course_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "course_id",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          {
            fieldName: "start_date",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Handle empty results
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format and add spots_left calculation
      return response.data.map(cohort => ({
        id: cohort.Id,
        name: cohort.Name || "",
        startDate: cohort.start_date || new Date().toISOString(),
        capacity: cohort.capacity || 30,
        enrolled: cohort.enrolled || 0,
        courseId: cohort.course_id?.Id || cohort.course_id || null,
        spots_left: (cohort.capacity || 30) - (cohort.enrolled || 0),
        tags: cohort.Tags || "",
        owner: cohort.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cohorts by course ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching cohorts by course ID:", error.message);
      }
      return [];
    }
  }

  async create(cohortData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: cohortData.name || "",
            start_date: cohortData.startDate || new Date().toISOString(),
            capacity: cohortData.capacity || 30,
            enrolled: cohortData.enrolled || 0,
            course_id: cohortData.courseId ? parseInt(cohortData.courseId) : null,
            Tags: cohortData.tags || "",
            Owner: cohortData.owner || null
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
          console.error(`Failed to create cohort ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const cohort = successfulRecords[0].data;
          // Map database fields to UI format
          return {
            id: cohort.Id,
            name: cohort.Name || "",
            startDate: cohort.start_date || new Date().toISOString(),
            capacity: cohort.capacity || 30,
            enrolled: cohort.enrolled || 0,
            courseId: cohort.course_id?.Id || cohort.course_id || null,
            spots_left: (cohort.capacity || 30) - (cohort.enrolled || 0),
            tags: cohort.Tags || "",
            owner: cohort.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating cohort:", error?.response?.data?.message);
      } else {
        console.error("Error creating cohort:", error.message);
      }
      throw error;
    }
  }

  async update(id, cohortData) {
    try {
      if (!id) {
        throw new Error("Cohort ID is required");
      }

      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: cohortData.name || "",
            start_date: cohortData.startDate || new Date().toISOString(),
            capacity: cohortData.capacity || 30,
            enrolled: cohortData.enrolled || 0,
            course_id: cohortData.courseId ? parseInt(cohortData.courseId) : null,
            Tags: cohortData.tags || "",
            Owner: cohortData.owner || null
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
          console.error(`Failed to update cohort ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const cohort = successfulUpdates[0].data;
          // Map database fields to UI format
          return {
            id: cohort.Id,
            name: cohort.Name || "",
            startDate: cohort.start_date || new Date().toISOString(),
            capacity: cohort.capacity || 30,
            enrolled: cohort.enrolled || 0,
            courseId: cohort.course_id?.Id || cohort.course_id || null,
            spots_left: (cohort.capacity || 30) - (cohort.enrolled || 0),
            tags: cohort.Tags || "",
            owner: cohort.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cohort:", error?.response?.data?.message);
      } else {
        console.error("Error updating cohort:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Cohort ID is required for deletion");
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
          console.error(`Failed to delete cohort ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting cohort:", error?.response?.data?.message);
      } else {
        console.error("Error deleting cohort:", error.message);
      }
      throw error;
    }
  }

  async updateEnrollment(cohortId, increment = 1) {
    try {
      if (!cohortId) {
        throw new Error("Cohort ID is required");
      }

      // First get the current cohort
      const currentCohort = await this.getById(cohortId);
      if (!currentCohort) {
        throw new Error("Cohort not found");
      }

      const newEnrolledCount = Math.max(0, (currentCohort.enrolled || 0) + increment);
      
      // Update the enrollment count
      return await this.update(cohortId, {
        ...currentCohort,
        enrolled: newEnrolledCount
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cohort enrollment:", error?.response?.data?.message);
      } else {
        console.error("Error updating cohort enrollment:", error.message);
      }
      throw error;
    }
  }

  // Backward compatibility methods
  async getCohorts(courseId) {
    return this.getByCourseId(courseId);
  }

  async updateCohortEnrollment(courseId, cohortId, increment = 1) {
    return this.updateEnrollment(cohortId, increment);
  }
}

export const cohortService = new CohortService();

// Export individual functions for backward compatibility
export const getCohorts = (courseId) => 
  cohortService.getCohorts(courseId);

export const updateCohortEnrollment = (courseId, cohortId, increment = 1) => 
  cohortService.updateCohortEnrollment(courseId, cohortId, increment); 