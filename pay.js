const express = require('express');
const router = express.Router();

PORTONE_API_SECRET = 'CqBMSPhdsRN4H62wgoiPzvUqDrzEDE6ZSsysARLYs1Y8atx1eteR97ehdCIbmG2D3jyu6AH8RhdSM2sk'
// POST 요청을 받는 /payments/complete
router.post("/payment/complete", async (req, res) => {
  try {
    // 요청의 body로 paymentId가 오기를 기대합니다.
    const { paymentId, order } = req.body;

    // 1. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: { Authorization: `PortOne ${PORTONE_API_SECRET}` },
      },
    );
    if (!paymentResponse.ok)
      throw new Error(`paymentResponse: ${await paymentResponse.json()}`);
    const payment = await paymentResponse.json();

    // 2. 고객사 내부 주문 데이터의 가격과 실제 지불된 금액을 비교합니다.
    const orderData = await OrderService.getOrderData(order);
    if (orderData.amount === payment.amount.total) {
      switch (payment.status) {
        case "VIRTUAL_ACCOUNT_ISSUED": {
          const paymentMethod = payment.paymentMethod;
          // 가상 계좌가 발급된 상태입니다.
          // 계좌 정보를 이용해 원하는 로직을 구성하세요.
          break;
        }
        case "PAID": {
          // 모든 금액을 지불했습니다! 완료 시 원하는 로직을 구성하세요.
          break;
        }
      }
    } else {
      // 결제 금액이 불일치하여 위/변조 시도가 의심됩니다.
    }
  } catch (e) {
    // 결제 검증에 실패했습니다.
    res.status(400).send(e);
  }
});

module.exports = router;