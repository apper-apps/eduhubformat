import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import { createReview } from '@/services/api/reviewService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StarRating from '@/components/molecules/StarRating';
import ReviewPreview from '@/components/molecules/ReviewPreview';

const ReviewForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  
  // Get context from URL params
  const itemType = searchParams.get('type'); // 'course' or 'product'
  const itemId = searchParams.get('itemId');
  const itemTitle = searchParams.get('title');
  
  const [formData, setFormData] = useState({
    rating: 0,
    content: '',
    studentName: '익명',
    completionWeeks: '',
    mediaFiles: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (formData.mediaFiles.length + files.length > maxFiles) {
      toast.error(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name}이 너무 큽니다. 10MB 이하의 파일만 업로드해주세요.`);
        return false;
      }
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...validFiles]
    }));
  };

  const removeMediaFile = (index) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (formData.rating === 0) {
      toast.error('별점을 선택해주세요.');
      return false;
    }
    
    if (formData.content.length < 10) {
      toast.error('후기 내용은 최소 10자 이상 작성해주세요.');
      return false;
    }
    
    return true;
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        ...formData,
        itemType,
        itemId: parseInt(itemId),
        itemTitle,
        category: itemType === 'course' ? '강의' : '상품'
      };
      
      await createReview(reviewData);
      
      setShowPreview(false);
      setShowConfirmation(true);
      
      // Show success toast with coupon notification
      toast.success('후기가 성공적으로 등록되었습니다!', {
        autoClose: 3000
      });
      
      // Show coupon reward notification after a delay
      setTimeout(() => {
        toast.info('🎉 후기 작성 완료! 10% 할인 쿠폰이 발급되었습니다.', {
          autoClose: 5000,
          onClick: () => navigate('/member-dashboard')
        });
      }, 1000);
      
    } catch (error) {
      toast.error(error.message || '후기 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/member-dashboard');
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">후기 등록 완료!</h2>
          <p className="text-gray-600 mb-4">
            소중한 후기를 남겨주셔서 감사합니다.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Gift" size={20} className="text-yellow-600 mr-2" />
              <span className="font-semibold text-yellow-800">보상 지급!</span>
            </div>
            <p className="text-sm text-yellow-700">
              10% 할인 쿠폰이 계정에 자동으로 지급되었습니다.
            </p>
          </div>
          <Button onClick={handleConfirmationClose} className="w-full">
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <ReviewPreview
        reviewData={{
          ...formData,
          itemTitle,
          itemType
        }}
        onBack={() => setShowPreview(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">후기 작성</h1>
          <p className="text-gray-600">{itemTitle}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                별점 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <StarRating
                  value={formData.rating}
                  onChange={(rating) => handleInputChange('rating', rating)}
                  size={32}
                />
                <span className="text-lg font-semibold text-gray-900">
                  {formData.rating > 0 ? `${formData.rating}점` : '평점 선택'}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                후기 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="솔직한 후기를 남겨주세요. 다른 수강생들에게 도움이 됩니다."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={6}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>최소 10자 이상 작성해주세요</span>
                <span>{formData.content.length}/1000</span>
              </div>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                작성자명
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                placeholder="익명"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Completion Weeks (for courses) */}
            {itemType === 'course' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  수강 완료 기간
                </label>
                <select
                  value={formData.completionWeeks}
                  onChange={(e) => handleInputChange('completionWeeks', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">선택하세요</option>
                  <option value="1">1주 이내</option>
                  <option value="2">2주</option>
                  <option value="4">1개월</option>
                  <option value="8">2개월</option>
                  <option value="12">3개월</option>
                  <option value="16">4개월 이상</option>
                </select>
              </div>
            )}

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                사진/동영상 첨부 (선택)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
              >
                <ApperIcon name="Upload" size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">
                  클릭하여 파일을 선택하세요
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  최대 5개, 각 10MB 이하 (JPG, PNG, MP4)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Uploaded Files */}
              {formData.mediaFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.mediaFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <ApperIcon 
                          name={file.type.startsWith('image/') ? 'Image' : 'Video'} 
                          size={16} 
                          className="mr-2 text-gray-500" 
                        />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeMediaFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handlePreview}
                className="flex-1"
                disabled={formData.rating === 0 || formData.content.length < 10}
              >
                미리보기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;