class ReviewService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'review';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "studentName" } },
          { field: { Name: "courseTitle" } },
          { field: { Name: "courseCategory" } },
          { field: { Name: "rating" } },
          { field: { Name: "content" } },
          { field: { Name: "helpful" } },
          { field: { Name: "completionWeeks" } },
          { field: { Name: "isVerified" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isFeatured" } },
          { field: { Name: "instructorName" } },
          { field: { Name: "instructorResponse" } },
          { field: { Name: "instructorResponseDate" } },
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
      return response.data.map(review => ({
        Id: review.Id,
        studentName: review.studentName || "",
        courseTitle: review.courseTitle || "",
        courseCategory: review.courseCategory || "",
        rating: review.rating || 0,
        content: review.content || "",
        helpful: review.helpful || 0,
        completionWeeks: review.completionWeeks || null,
        isVerified: review.isVerified || false,
        createdAt: review.createdAt || review.CreatedOn || new Date().toISOString(),
        isFeatured: review.isFeatured || false,
        instructorName: review.instructorName || "",
        instructorResponse: review.instructorResponse || null,
        instructorResponseDate: review.instructorResponseDate || null,
        tags: review.Tags || "",
        owner: review.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reviews:", error?.response?.data?.message);
      } else {
        console.error("Error fetching reviews:", error.message);
      }
      return [];
    }
  }

  async getFeaturedReviews() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "studentName" } },
          { field: { Name: "courseTitle" } },
          { field: { Name: "courseCategory" } },
          { field: { Name: "rating" } },
          { field: { Name: "content" } },
          { field: { Name: "helpful" } },
          { field: { Name: "completionWeeks" } },
          { field: { Name: "isVerified" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isFeatured" } },
          { field: { Name: "instructorName" } },
          { field: { Name: "instructorResponse" } },
          { field: { Name: "instructorResponseDate" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "isFeatured",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
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
      return response.data.map(review => ({
        Id: review.Id,
        studentName: review.studentName || "",
        courseTitle: review.courseTitle || "",
        courseCategory: review.courseCategory || "",
        rating: review.rating || 0,
        content: review.content || "",
        helpful: review.helpful || 0,
        completionWeeks: review.completionWeeks || null,
        isVerified: review.isVerified || false,
        createdAt: review.createdAt || review.CreatedOn || new Date().toISOString(),
        isFeatured: review.isFeatured || false,
        instructorName: review.instructorName || "",
        instructorResponse: review.instructorResponse || null,
        instructorResponseDate: review.instructorResponseDate || null,
        tags: review.Tags || "",
        owner: review.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured reviews:", error?.response?.data?.message);
      } else {
        console.error("Error fetching featured reviews:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Review ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "studentName" } },
          { field: { Name: "courseTitle" } },
          { field: { Name: "courseCategory" } },
          { field: { Name: "rating" } },
          { field: { Name: "content" } },
          { field: { Name: "helpful" } },
          { field: { Name: "completionWeeks" } },
          { field: { Name: "isVerified" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isFeatured" } },
          { field: { Name: "instructorName" } },
          { field: { Name: "instructorResponse" } },
          { field: { Name: "instructorResponseDate" } },
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
        throw new Error(`Review not found with ID: ${id}`);
      }

      const review = response.data;
      
      // Map database fields to UI format
      return {
        Id: review.Id,
        studentName: review.studentName || "",
        courseTitle: review.courseTitle || "",
        courseCategory: review.courseCategory || "",
        rating: review.rating || 0,
        content: review.content || "",
        helpful: review.helpful || 0,
        completionWeeks: review.completionWeeks || null,
        isVerified: review.isVerified || false,
        createdAt: review.createdAt || review.CreatedOn || new Date().toISOString(),
        isFeatured: review.isFeatured || false,
        instructorName: review.instructorName || "",
        instructorResponse: review.instructorResponse || null,
        instructorResponseDate: review.instructorResponseDate || null,
        tags: review.Tags || "",
        owner: review.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching review with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching review with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(reviewData) {
    try {
  // Validate required fields
      if (!reviewData.rating || !reviewData.content) {
    throw new Error("필수 필드가 누락되었습니다.");
  }
  
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("평점은 1-5 사이여야 합니다.");
  }
  
  if (reviewData.content.length < 10) {
    throw new Error("후기 내용은 최소 10자 이상이어야 합니다.");
  }
  
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: reviewData.courseTitle || "제목 없음",
    studentName: reviewData.studentName || "익명",
            courseTitle: reviewData.courseTitle || "제목 없음",
            courseCategory: reviewData.courseCategory || "기타",
    rating: reviewData.rating,
    content: reviewData.content,
            helpful: reviewData.helpful || 0,
            completionWeeks: reviewData.completionWeeks || null,
            isVerified: reviewData.isVerified || true,
    createdAt: new Date().toISOString(),
            isFeatured: reviewData.isFeatured || false,
            instructorName: reviewData.instructorName || "",
            instructorResponse: reviewData.instructorResponse || null,
            instructorResponseDate: reviewData.instructorResponseDate || null,
            Tags: reviewData.tags || "",
            Owner: reviewData.owner || null
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
          console.error(`Failed to create review ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const review = successfulRecords[0].data;
          // Map database fields to UI format
          return {
            Id: review.Id,
            studentName: review.studentName || "",
            courseTitle: review.courseTitle || "",
            courseCategory: review.courseCategory || "",
            rating: review.rating || 0,
            content: review.content || "",
            helpful: review.helpful || 0,
            completionWeeks: review.completionWeeks || null,
            isVerified: review.isVerified || false,
            createdAt: review.createdAt || review.CreatedOn || new Date().toISOString(),
            isFeatured: review.isFeatured || false,
            instructorName: review.instructorName || "",
            instructorResponse: review.instructorResponse || null,
            instructorResponseDate: review.instructorResponseDate || null,
            tags: review.Tags || "",
            owner: review.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating review:", error?.response?.data?.message);
      } else {
        console.error("Error creating review:", error.message);
      }
      throw error;
    }
  }

  async update(id, reviewData) {
    try {
      if (!id) {
        throw new Error("Review ID is required");
      }

      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: reviewData.courseTitle || reviewData.Name || "",
            studentName: reviewData.studentName || "",
            courseTitle: reviewData.courseTitle || "",
            courseCategory: reviewData.courseCategory || "",
            rating: reviewData.rating || 0,
            content: reviewData.content || "",
            helpful: reviewData.helpful || 0,
    completionWeeks: reviewData.completionWeeks || null,
            isVerified: reviewData.isVerified || false,
            isFeatured: reviewData.isFeatured || false,
            instructorName: reviewData.instructorName || "",
            instructorResponse: reviewData.instructorResponse || null,
            instructorResponseDate: reviewData.instructorResponseDate || null,
            Tags: reviewData.tags || "",
            Owner: reviewData.owner || null
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
          console.error(`Failed to update review ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const review = successfulUpdates[0].data;
          // Map database fields to UI format
          return {
            Id: review.Id,
            studentName: review.studentName || "",
            courseTitle: review.courseTitle || "",
            courseCategory: review.courseCategory || "",
            rating: review.rating || 0,
            content: review.content || "",
            helpful: review.helpful || 0,
            completionWeeks: review.completionWeeks || null,
            isVerified: review.isVerified || false,
            createdAt: review.createdAt || review.CreatedOn || new Date().toISOString(),
            isFeatured: review.isFeatured || false,
            instructorName: review.instructorName || "",
            instructorResponse: review.instructorResponse || null,
            instructorResponseDate: review.instructorResponseDate || null,
            tags: review.Tags || "",
            owner: review.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating review:", error?.response?.data?.message);
      } else {
        console.error("Error updating review:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Review ID is required for deletion");
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
          console.error(`Failed to delete review ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting review:", error?.response?.data?.message);
      } else {
        console.error("Error deleting review:", error.message);
      }
      throw error;
    }
  }

  async addInstructorResponse(reviewId, response, instructorName) {
    try {
      if (!reviewId) {
        throw new Error("Review ID is required");
      }

      const currentReview = await this.getById(reviewId);
      if (!currentReview) {
    throw new Error("Review not found");
  }
  
      return await this.update(reviewId, {
        ...currentReview,
    instructorResponse: response,
    instructorResponseDate: new Date().toISOString(),
    instructorName: instructorName
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding instructor response:", error?.response?.data?.message);
      } else {
        console.error("Error adding instructor response:", error.message);
      }
      throw error;
    }
  }

  async toggleFeaturedReview(reviewId) {
    try {
      if (!reviewId) {
        throw new Error("Review ID is required");
      }

      const currentReview = await this.getById(reviewId);
      if (!currentReview) {
    throw new Error("Review not found");
  }
  
      return await this.update(reviewId, {
        ...currentReview,
        isFeatured: !currentReview.isFeatured
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling featured review:", error?.response?.data?.message);
      } else {
        console.error("Error toggling featured review:", error.message);
      }
      throw error;
    }
  }

  async voteOnReview(reviewId, voteType) {
    try {
  if (!reviewId || !voteType) {
    throw new Error("리뷰 ID와 투표 유형이 필요합니다.");
  }
  
  if (!['helpful', 'unhelpful'].includes(voteType)) {
    throw new Error("올바르지 않은 투표 유형입니다.");
  }
  
      const currentReview = await this.getById(reviewId);
      if (!currentReview) {
    throw new Error("Review not found");
  }
  
  // Check if user has already voted
  const voteKey = `review_vote_${reviewId}`;
  const existingVote = localStorage.getItem(voteKey);
      
      let newHelpfulCount = currentReview.helpful || 0;
  
  if (existingVote === voteType) {
    throw new Error("이미 투표하셨습니다.");
  }
  
  // Handle vote change or new vote
  if (existingVote === 'helpful' && voteType === 'unhelpful') {
        newHelpfulCount = Math.max(0, newHelpfulCount - 1);
  } else if (existingVote === 'unhelpful' && voteType === 'helpful') {
        newHelpfulCount += 1;
      } else if (!existingVote && voteType === 'helpful') {
        newHelpfulCount += 1;
      }

    localStorage.setItem(voteKey, voteType);

      return await this.update(reviewId, {
        ...currentReview,
        helpful: newHelpfulCount
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error voting on review:", error?.response?.data?.message);
    } else {
        console.error("Error voting on review:", error.message);
      }
      throw error;
    }
  }
  
  getUserVote(reviewId) {
  const voteKey = `review_vote_${reviewId}`;
  return localStorage.getItem(voteKey);
  }

  generateReviewShareData(review) {
  return {
    title: `${review.courseTitle} 후기`,
    description: review.content.substring(0, 100) + '...',
    url: `${window.location.origin}/reviews/${review.Id}`,
    image: review.courseImage || '/default-course-image.jpg'
  };
  }

  // Backward compatibility methods
  async getReviews() {
    return this.getAll();
  }

  async getReviewById(id) {
    return this.getById(id);
  }

  async createReview(reviewData) {
    return this.create(reviewData);
  }

  async updateReview(id, reviewData) {
    return this.update(id, reviewData);
  }

  async deleteReview(id) {
    return this.delete(id);
  }
}

export const reviewService = new ReviewService();

// Export individual functions for backward compatibility
export const getReviews = () => 
  reviewService.getReviews();

export const getFeaturedReviews = () => 
  reviewService.getFeaturedReviews();

export const getReviewById = (id) => 
  reviewService.getReviewById(id);

export const createReview = (reviewData) => 
  reviewService.createReview(reviewData);

export const updateReview = (id, reviewData) => 
  reviewService.updateReview(id, reviewData);

export const deleteReview = (id) => 
  reviewService.deleteReview(id);

export const addInstructorResponse = (reviewId, response, instructorName) => 
  reviewService.addInstructorResponse(reviewId, response, instructorName);

export const toggleFeaturedReview = (reviewId) => 
  reviewService.toggleFeaturedReview(reviewId);

export const voteOnReview = (reviewId, voteType) => 
  reviewService.voteOnReview(reviewId, voteType);

export const getUserVote = (reviewId) => 
  reviewService.getUserVote(reviewId);

export const generateReviewShareData = (review) => 
  reviewService.generateReviewShareData(review);