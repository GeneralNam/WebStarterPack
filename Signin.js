import React, { useState } from 'react';
import './Signin.css';
import { Link } from 'react-router-dom';


const Signin = () => {


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    address: '',
    checkEmail: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };


  return (
    <div className="order-container">
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        

        <button 
        type="submit" 
        className="submit-button"
        >로그인</button>

        <Link to="/signup">
            <button 
            type="submit" 
            className="submit-button signupbutton"
            >10초 회원가입</button>
        </Link>
      </form>
    </div>
  );
};

export default Signin;