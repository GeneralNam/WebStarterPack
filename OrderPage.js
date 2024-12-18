import React, { useState } from 'react';
import './OrderPage.css';
import DaumPostcode from "react-daum-postcode";
import * as PortOne from "@portone/browser-sdk/v2";

const BASE_URL = 'http://localhost:3000/';
const SERVER_BASE_URL = 'http://localhost:8080'

const OrderPage = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [우편번호, set우편번호] = useState('');
  const [modal, setModal] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    address: '',
    checkEmail: ''
  });

  async function requestPayment() {

    const paymentId = `payment-${crypto.randomUUID()}`;

    const response = await PortOne.requestPayment({
      // Store ID 설정
      storeId: "store-87939f94-8220-44b1-bc52-7f1502cae9f7",
      // 채널 키 설정
      channelKey: "channel-key-08f85301-c2f4-4495-9635-3a6e10b0ffcd",
      paymentId: paymentId,
      orderName: "띠프롱슬리브",
      totalAmount: 200,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      redirectUrl: `${BASE_URL}/payment-redirect`,
    });
  
    if (response.code !== undefined) {
      // 오류 발생
      return alert(response.message);
    }
  
    // /payment/complete 엔드포인트를 구현해야 합니다. 다음 목차에서 설명합니다.
    const notified = await fetch(`${SERVER_BASE_URL}/payment/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // paymentId와 주문 정보를 서버에 전달합니다
      body: JSON.stringify({
        paymentId: paymentId,
        // 주문 정보...
      }),
    });
  }

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
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>배송지</label>
          
          <div className='address'>
            <span className="address-text">{우편번호}</span>
            <button className="findaddress" type="button" onClick={() => setIsOpen(true)}>우편번호 찾기</button>
          </div>

          <div>
          {isOpen && (
            <div className="postcode-modal">
              <button className="closebutton" onClick={()=>setIsOpen(false)}>x</button>
              <DaumPostcode
                autoClose={false}
                onComplete={(data) => {
                  set우편번호(data.address);
                  setIsOpen(false);
                }}
              />
            </div>
          )}
          
          </div>
        </div>

        <div className="form-group">
          <label>상세주소</label>
          <input
            type="email"
            name="checkEmail"
            value={formData.checkEmail}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>EMAIL</label>
          <input
            type="email"
            name="checkEmail"
            value={formData.checkEmail}
            onChange={handleChange}
          />
        </div>
        

        <button 
        type="submit" 
        className="submit-button"
        onClick={requestPayment}>결제하기</button>
      </form>
    </div>
  );
};

export default OrderPage;