import reviewsData from "@/services/mockData/reviews.json";

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
  await new Promise(resolve => setTimeout(resolve, 500));
  const newId = Math.max(...reviewsData.map(review => review.Id)) + 1;
  const newReview = {
    Id: newId,
    ...reviewData,
    createdAt: new Date().toISOString(),
    helpful: 0,
    isVerified: false,
  };
  reviewsData.push(newReview);
  return { ...newReview };
};

export const updateReview = async (id, reviewData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const reviewIndex = reviewsData.findIndex(review => review.Id === parseInt(id));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  reviewsData[reviewIndex] = { ...reviewsData[reviewIndex], ...reviewData };
  return { ...reviewsData[reviewIndex] };
};

export const deleteReview = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const reviewIndex = reviewsData.findIndex(review => review.Id === parseInt(id));
  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }
  const deletedReview = reviewsData.splice(reviewIndex, 1)[0];
  return { ...deletedReview };
};