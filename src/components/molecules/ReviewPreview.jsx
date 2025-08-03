import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StarRating from '@/components/molecules/StarRating';

const ReviewPreview = ({ reviewData, onBack, onSubmit, isSubmitting }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">후기 미리보기</h1>
          <p className="text-gray-600">작성한 후기를 확인하고 최종 등록하세요</p>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
          {/* Review Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{reviewData.studentName}</h3>
                    <p className="text-sm text-gray-500">
                      {reviewData.itemType === 'course' ? '수강생' : '구매고객'}
                    </p>
                  </div>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {reviewData.itemTitle}
                </h4>
                <StarRating value={reviewData.rating} readonly size={20} />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {formatDate(new Date())}
                </div>
                {reviewData.completionWeeks && (
                  <div className="text-sm text-gray-500 mt-1">
                    수강완료: {reviewData.completionWeeks}주
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {reviewData.content}
              </p>
            </div>

            {/* Media Files Preview */}
            {reviewData.mediaFiles && reviewData.mediaFiles.length > 0 && (
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-700 mb-3">첨부 파일</h5>
                <div className="grid grid-cols-3 gap-3">
                  {reviewData.mediaFiles.map((file, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`첨부 이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ApperIcon name="Play" size={32} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {file.type.startsWith('image/') ? 'IMG' : 'VID'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Review Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <ApperIcon name="ThumbsUp" size={14} className="mr-1" />
                  도움됨 0
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Shield" size={14} className="mr-1" />
                  인증된 구매
                </span>
              </div>
              <span>지금 등록됨</span>
            </div>
          </div>
        </div>

        {/* Confirmation Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">후기 등록 전 확인사항</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 등록된 후기는 수정이 제한될 수 있습니다</li>
                <li>• 후기 작성 완료 시 10% 할인 쿠폰이 자동 지급됩니다</li>
                <li>• 허위 또는 부적절한 내용은 관리자에 의해 삭제될 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isSubmitting}
          >
            수정하기
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                등록 중...
              </>
            ) : (
              '후기 등록'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPreview;