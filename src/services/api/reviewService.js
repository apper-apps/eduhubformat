import reviewsData from "@/services/mockData/reviews.json";
import { toast } from "react-toastify";

// Enhanced review data with instructor responses and featured status
const enhancedReviewsData = reviewsData.map(review => ({
  ...review,
  isFeatured: [1, 4, 5, 11].includes(review.Id), // Mark some reviews as featured
  instructorName: getInstructorName(review.courseCategory),
  instructorResponse: getInstructorResponse(review.Id),
  instructorResponseDate: getInstructorResponseDate(review.Id),
}));

function getInstructorName(category) {
  const instructors = {
    '프로그래밍': '김개발',
    '디자인': '이디자인',
    '마케팅': '박마케팅',
    '비즈니스': '최경영'
  };
  return instructors[category] || '전문강사';
}

function getInstructorResponse(reviewId) {
  const responses = {
    1: "정말 좋은 후기 감사합니다! 앞으로도 더 나은 강의를 위해 노력하겠습니다. 실무에서 많은 도움이 되시길 바랍니다.",
    4: "마케팅 분야에서 성공하시길 바랍니다! 궁금한 점이 있으시면 언제든 문의해주세요.",
    5: "데이터 분석 여정에서 좋은 성과 있으시길 바랍니다. 계속해서 실습하시면서 경험을 쌓아가세요!",
    11: "광고 운영에 도움이 되어서 정말 기쁩니다. 앞으로도 ROI 향상을 위해 함께 노력해요!"
  };
  return responses[reviewId] || null;
}

function getInstructorResponseDate(reviewId) {
  if (!getInstructorResponse(reviewId)) return null;
  
  const responseDates = {
    1: "2024-03-19T15:20:00Z",
    4: "2024-03-11T10:30:00Z", 
    5: "2024-03-09T14:45:00Z",
    11: "2024-02-21T16:10:00Z"
  };
  return responseDates[reviewId];
}

export const getReviews = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...enhancedReviewsData];
};

export const getFeaturedReviews = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return enhancedReviewsData.filter(review => review.isFeatured);
};

export const getReviewById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const review = enhancedReviewsData.find(review => review.Id === parseInt(id));
  if (!review) {
    throw new Error("Review not found");
  }
  return { ...review };
};

export const createReview = async (reviewData) => {
  // Validate required fields
  if (!reviewData.rating || !reviewData.content || !reviewData.itemType || !reviewData.itemId) {
    throw new Error("필수 필드가 누락되었습니다.");
  }
  
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("평점은 1-5 사이여야 합니다.");
  }
  
  if (reviewData.content.length < 10) {
    throw new Error("후기 내용은 최소 10자 이상이어야 합니다.");
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  const newId = Math.max(...enhancedReviewsData.map(review => review.Id)) + 1;
  const newReview = {
    Id: newId,
    studentName: reviewData.studentName || "익명",
    courseTitle: reviewData.itemTitle || "제목 없음",
    courseCategory: reviewData.category || "기타",
    rating: reviewData.rating,
    content: reviewData.content,
    itemType: reviewData.itemType, // 'course' or 'product'
    itemId: reviewData.itemId,
    mediaFiles: reviewData.mediaFiles || [], // Array of uploaded media
    createdAt: new Date().toISOString(),
    helpful: 0,
    isVerified: true, // Auto-verify for purchased items
    completionWeeks: reviewData.completionWeeks || null,
    isFeatured: false, // New reviews are not featured by default
    instructorName: getInstructorName(reviewData.category || "기타"),
    instructorResponse: null,
    instructorResponseDate: null
  };
  enhancedReviewsData.push(newReview);
  return { ...newReview };
};

export const addInstructorResponse = async (reviewId, response, instructorName) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const reviewIndex = enhancedReviewsData.findIndex(review => review.Id === parseInt(reviewId));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  enhancedReviewsData[reviewIndex] = {
    ...enhancedReviewsData[reviewIndex],
    instructorResponse: response,
    instructorResponseDate: new Date().toISOString(),
    instructorName: instructorName
  };
  
  toast.success("강사 답변이 등록되었습니다!");
  return { ...enhancedReviewsData[reviewIndex] };
};

export const toggleFeaturedReview = async (reviewId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const reviewIndex = enhancedReviewsData.findIndex(review => review.Id === parseInt(reviewId));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  enhancedReviewsData[reviewIndex].isFeatured = !enhancedReviewsData[reviewIndex].isFeatured;
  
  const message = enhancedReviewsData[reviewIndex].isFeatured ? 
    "추천 후기로 설정되었습니다!" : "추천 후기에서 제외되었습니다.";
  toast.success(message);
  
  return { ...enhancedReviewsData[reviewIndex] };
};

export const updateReview = async (id, reviewData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const reviewIndex = enhancedReviewsData.findIndex(review => review.Id === parseInt(id));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  enhancedReviewsData[reviewIndex] = {
    ...enhancedReviewsData[reviewIndex],
    ...reviewData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...enhancedReviewsData[reviewIndex] };
};

export const deleteReview = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const reviewIndex = enhancedReviewsData.findIndex(review => review.Id === parseInt(id));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  const deletedReview = { ...enhancedReviewsData[reviewIndex] };
  enhancedReviewsData.splice(reviewIndex, 1);
  return deletedReview;
};

export const voteOnReview = async (reviewId, voteType) => {
  // Validate inputs
  if (!reviewId || !voteType) {
    throw new Error("리뷰 ID와 투표 유형이 필요합니다.");
  }
  
  if (!['helpful', 'unhelpful'].includes(voteType)) {
    throw new Error("올바르지 않은 투표 유형입니다.");
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const reviewIndex = enhancedReviewsData.findIndex(review => review.Id === parseInt(reviewId));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  // Check if user has already voted
  const voteKey = `review_vote_${reviewId}`;
  const existingVote = localStorage.getItem(voteKey);
  
  if (existingVote === voteType) {
    throw new Error("이미 투표하셨습니다.");
  }
  
  // Handle vote change or new vote
  if (existingVote === 'helpful' && voteType === 'unhelpful') {
    // Switch from helpful to unhelpful
    enhancedReviewsData[reviewIndex].helpful = Math.max(0, enhancedReviewsData[reviewIndex].helpful - 1);
    localStorage.setItem(voteKey, voteType);
    toast.success("투표가 변경되었습니다.");
  } else if (existingVote === 'unhelpful' && voteType === 'helpful') {
    // Switch from unhelpful to helpful
    enhancedReviewsData[reviewIndex].helpful += 1;
    localStorage.setItem(voteKey, voteType);
    toast.success("투표가 변경되었습니다.");
  } else if (!existingVote) {
    // New vote
    if (voteType === 'helpful') {
      enhancedReviewsData[reviewIndex].helpful += 1;
      toast.success("도움이 되는 후기로 투표해주셔서 감사합니다!");
    } else {
      toast.success("피드백 감사합니다.");
    }
    localStorage.setItem(voteKey, voteType);
  }
  
  return { ...enhancedReviewsData[reviewIndex] };
};

export const getUserVote = (reviewId) => {
  const voteKey = `review_vote_${reviewId}`;
  return localStorage.getItem(voteKey);
};

// Social sharing utilities for reviews
export const generateReviewShareData = (review) => {
  return {
    title: `${review.courseTitle} 후기`,
    description: review.content.substring(0, 100) + '...',
    url: `${window.location.origin}/reviews/${review.Id}`,
    image: review.courseImage || '/default-course-image.jpg'
  };
};