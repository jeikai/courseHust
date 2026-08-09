import { Link, useSearchParams } from "react-router-dom";
import { Button, Result } from "antd";

// Landed on after VNPAY redirects back through the backend's /api/vnpay/return
// route, which verifies the signature and confirms the payment server-side
// before ever getting here. This page only reads a plain status flag the
// backend set - it never evaluates raw vnp_* parameters itself.
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <Result
        status="success"
        title="Payment successful"
        subTitle="Your courses have been unlocked. You can close this tab and return to the purchase page."
        extra={[
          <Link to="/home/purchase_course" key="purchase">
            <Button type="primary">Go to My Courses</Button>
          </Link>,
        ]}
      />
    );
  }

  if (status === "failed") {
    return (
      <Result
        status="error"
        title="Payment was not completed"
        subTitle="VNPAY reported this transaction as unsuccessful or cancelled. No charge was made and no course was unlocked."
        extra={[
          <Link to="/home/purchase_course" key="purchase">
            <Button type="primary">Back to cart</Button>
          </Link>,
        ]}
      />
    );
  }

  return (
    <Result
      status="warning"
      title="Something went wrong"
      subTitle="We couldn't verify this payment. If you were charged, please contact support with your transaction details."
      extra={[
        <Link to="/home/purchase_course" key="purchase">
          <Button type="primary">Back to cart</Button>
        </Link>,
      ]}
    />
  );
};

export default PaymentResult;
