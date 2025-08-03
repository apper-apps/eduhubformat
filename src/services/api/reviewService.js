import reviewsData from "@/services/mockData/reviews.json";
import { toast } from "react-toastify";

export const getReviews = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...reviewsData];
};

export const getReviewById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const review = reviewsData.find(review => review.Id === parseInt(id));
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
  const newId = Math.max(...reviewsData.map(review => review.Id)) + 1;
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
    completionWeeks: reviewData.completionWeeks || null
  };
  reviewsData.push(newReview);
  return { ...newReview };
};

export const updateReview = async (id, reviewData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const reviewIndex = reviewsData.findIndex(review => review.Id === parseInt(id));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  reviewsData[reviewIndex] = {
    ...reviewsData[reviewIndex],
    ...reviewData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...reviewsData[reviewIndex] };
};

export const deleteReview = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const reviewIndex = reviewsData.findIndex(review => review.Id === parseInt(id));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  
  const deletedReview = { ...reviewsData[reviewIndex] };
  reviewsData.splice(reviewIndex, 1);
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
  
  const reviewIndex = reviewsData.findIndex(review => review.Id === parseInt(reviewId));
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
    reviewsData[reviewIndex].helpful = Math.max(0, reviewsData[reviewIndex].helpful - 1);
    localStorage.setItem(voteKey, voteType);
    toast.success("투표가 변경되었습니다.");
  } else if (existingVote === 'unhelpful' && voteType === 'helpful') {
    // Switch from unhelpful to helpful
    reviewsData[reviewIndex].helpful += 1;
    localStorage.setItem(voteKey, voteType);
    toast.success("투표가 변경되었습니다.");
  } else if (!existingVote) {
    // New vote
    if (voteType === 'helpful') {
      reviewsData[reviewIndex].helpful += 1;
      toast.success("도움이 되는 후기로 투표해주셔서 감사합니다!");
    } else {
      toast.success("피드백 감사합니다.");
    }
    localStorage.setItem(voteKey, voteType);
  }
  
  return { ...reviewsData[reviewIndex] };
};

export const getUserVote = (reviewId) => {
  const voteKey = `review_vote_${reviewId}`;
  return localStorage.getItem(voteKey);
};