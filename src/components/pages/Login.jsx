import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-600">EduHub Pro에 로그인하세요</p>
        </div>
        
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            Apper-SDK 인증이 자동으로 처리됩니다...
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;