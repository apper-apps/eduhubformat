import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { getReviews, voteOnReview, getUserVote } from "@/services/api/reviewService";
const ReviewsPage = () => {
const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [votingStates, setVotingStates] = useState({});
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError("리뷰를 불러오는데 실패했습니다. 다시 시도해주세요.");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

const handleVote = async (reviewId, voteType) => {
    setVotingStates(prev => ({
      ...prev,
      [reviewId]: { voting: true }
    }));

    try {
      const updatedReview = await voteOnReview(reviewId, voteType);
      
      // Update the review in the reviews array
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.Id === reviewId ? updatedReview : review
        )
      );
    } catch (error) {
      toast.error(error.message || "투표 처리 중 오류가 발생했습니다.");
    } finally {
      setVotingStates(prev => ({
        ...prev,
        [reviewId]: { voting: false }
      }));
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);
  const filteredReviews = React.useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter(review => review.courseCategory === filter);
  }, [reviews, filter]);

  const categories = ["all", "프로그래밍", "디자인", "비즈니스", "마케팅"];
  const categoryLabels = {
    all: "전체",
    "프로그래밍": "프로그래밍",
    "디자인": "디자인", 
    "비즈니스": "비즈니스",
    "마케팅": "마케팅"
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={16}
        className={`${
          index < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReviews} />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 korean-text">
              수강생 <span className="text-gradient">이용후기</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              실제 수강생들이 직접 작성한 솔직한 후기를 확인해보세요.
              다양한 강의에 대한 생생한 경험담을 만나보실 수 있습니다.
            </p>
            
            {/* Review Stats */}
            <div className="flex flex-wrap justify-center items-center space-x-8 space-y-2 sm:space-y-0 text-gray-500 pt-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="MessageSquare" size={20} />
                <span className="font-medium">{reviews.length}개 후기</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(5)}
                </div>
                <span className="font-medium">4.8 평균 평점</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="ThumbsUp" size={20} />
                <span className="font-medium">98% 추천</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "primary" : "outline"}
                size="small"
                onClick={() => setFilter(category)}
                className="transition-all duration-200"
              >
                {categoryLabels[category]}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredReviews.length === 0 ? (
            <Empty 
              title="해당 카테고리의 후기가 없습니다"
              description="다른 카테고리를 선택하거나 전체 후기를 확인해보세요."
            />
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.Id}
                  className="card-elevated p-8 space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-hero-gradient rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {review.studentName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{review.studentName}</h3>
                        <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <Badge variant="primary" size="small">
                      {review.courseCategory}
                    </Badge>
                  </div>

                  {/* Course Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 korean-text">
                      {review.courseTitle}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-medium">{review.rating}/5</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-4">
                    <blockquote className="text-gray-700 leading-relaxed korean-text">
                      "{review.content}"
                    </blockquote>
                    
{/* Helpful Voting */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {/* Voting Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(review.Id, 'helpful')}
                            disabled={votingStates[review.Id]?.voting}
                            className={`flex items-center space-x-1 text-sm transition-all duration-200 ${
                              getUserVote(review.Id) === 'helpful' 
                                ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <ApperIcon 
                              name="ThumbsUp" 
                              size={16} 
                              className={votingStates[review.Id]?.voting ? 'animate-pulse' : ''}
                            />
                            <span>도움됨 ({review.helpful})</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(review.Id, 'unhelpful')}
                            disabled={votingStates[review.Id]?.voting}
                            className={`flex items-center space-x-1 text-sm transition-all duration-200 ${
                              getUserVote(review.Id) === 'unhelpful' 
                                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <ApperIcon 
                              name="ThumbsDown" 
                              size={16} 
                              className={votingStates[review.Id]?.voting ? 'animate-pulse' : ''}
                            />
                            <span>도움안됨</span>
                          </Button>
                        </div>
                        
                        {/* Course Info */}
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <ApperIcon name="Clock" size={16} />
                          <span>수강 {review.completionWeeks}주차</span>
                        </div>
                      </div>
                      
                      {review.isVerified && (
                        <Badge variant="success" size="small">
                          <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                          인증된 수강생
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {filteredReviews.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button variant="outline" size="large">
                <ApperIcon name="Plus" size={20} className="mr-2" />
                더 많은 후기 보기
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-hero-gradient rounded-2xl p-8 lg:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white korean-text">
                당신도 성공 스토리의 주인공이 되어보세요
              </h2>
              <p className="text-xl text-white/90 korean-text">
                지금 바로 강의를 시작하고 새로운 기술을 마스터해보세요.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  variant="secondary"
                  size="large"
                  className="w-full sm:w-auto bg-white text-primary-800 hover:bg-gray-50 shadow-xl"
                >
                  <ApperIcon name="BookOpen" size={20} className="mr-2" />
                  강의 둘러보기
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-800 backdrop-blur-sm"
                >
                  <ApperIcon name="Play" size={20} className="mr-2" />
                  무료 체험하기
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;