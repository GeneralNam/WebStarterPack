import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = '사용자 이름을 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('');

    try {
      const response = await fetch('http://localhost:8080/auth/login/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다');
      }

      navigate('/');
      setSubmitStatus('success');
      // Clear form after successful submission
      setFormData({
        username: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      setSubmitStatus('error');
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-container">
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label>사용자 이름</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
        
        {submitStatus === 'success' && (
          <div className="success-message">회원가입이 완료되었습니다!</div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? '처리중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default Signup;