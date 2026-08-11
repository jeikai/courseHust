import { Button, Col, Form, Input, Row, Typography, Steps } from "antd";
import { LockOutlined, MailOutlined, NumberOutlined } from "@ant-design/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import login from "../../assets/login-security.gif";
import { ViewContext } from "../../context/View";
import Spring from "../../components/Spring";

const STEP = {
  EMAIL: 0,
  CODE: 1,
  PASSWORD: 2,
  SUCCESS: 3,
};

const RESEND_COOLDOWN_SECONDS = 60;
const DEFAULT_CODE_EXPIRY_MINUTES = 10;

const ForgotPassword = () => {
  const viewContext = useContext(ViewContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeExpiryMinutes, setCodeExpiryMinutes] = useState(
    DEFAULT_CODE_EXPIRY_MINUTES
  );

  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const cooldownTimer = useRef(null);

  useEffect(() => {
    return () => clearInterval(cooldownTimer.current);
  }, []);

  const startResendCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestCode = async (targetEmail) => {
    const res = await Axios({
      url: "/api/user/forgot-password",
      method: "POST",
      data: { email: targetEmail },
    });
    if (res.data?.expiresInMinutes) {
      setCodeExpiryMinutes(res.data.expiresInMinutes);
    }
    return res;
  };

  const handleEmailSubmit = async (values) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await requestCode(values.email.trim());
      setEmail(values.email.trim());
      viewContext.handleSuccess(
        "If an account with that email exists, a verification code has been sent to it."
      );
      startResendCooldown();
      setStep(STEP.CODE);
    } catch (error) {
      // A real send failure (mail service misconfigured/provider outage) -
      // stay on this step so the user isn't left waiting on an email that
      // was never actually sent.
      viewContext.handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isSubmitting || resendCooldown > 0) return;
    try {
      setIsSubmitting(true);
      await requestCode(email);
      viewContext.handleSuccess("A new verification code has been sent.");
      // Only reset the countdown once the resend actually succeeded - a
      // failed resend must not look like the cooldown restarted.
      startResendCooldown();
      codeForm.resetFields(["code"]);
      setCodeError("");
    } catch (error) {
      viewContext.handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (values) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      setCodeError("");
      const res = await Axios({
        url: "/api/user/verify-reset-code",
        method: "POST",
        data: { email, code: values.code.trim() },
      });
      setResetToken(res.data.resetToken);
      setStep(STEP.PASSWORD);
    } catch (error) {
      setCodeError(
        error?.response?.data?.message || "Invalid or expired verification code"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await Axios({
        url: "/api/user/reset-password",
        method: "POST",
        data: {
          email,
          resetToken,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });
      setStep(STEP.SUCCESS);
    } catch (error) {
      viewContext.handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Spring className="max-w-screen-xl m-auto py-24 min-h-96">
      <Row>
        <Col span={14} className="flex items-center justify-center">
          <img src={login} alt="" />
        </Col>
        <Col span={10}>
          <div className="sign-up">
            <Typography.Title level={2} className="mb-6">
              Forgot Password<span className="text-purple-600">?</span>
            </Typography.Title>

            <Steps
              className="mb-8"
              current={Math.min(step, STEP.PASSWORD)}
              size="small"
              items={[
                { title: "Email" },
                { title: "Verify" },
                { title: "New password" },
              ]}
            />

            {step === STEP.EMAIL && (
              <>
                <Typography.Text className="block text-base mb-6">
                  Enter the email address associated with your account and
                  we&apos;ll send you a verification code to reset your
                  password.
                </Typography.Text>
                <Form
                  layout="vertical"
                  form={emailForm}
                  onFinish={handleEmailSubmit}
                >
                  <Form.Item
                    name="email"
                    label={
                      <Typography.Title level={5}>Your email</Typography.Title>
                    }
                    rules={[
                      { required: true, message: "Please input your E-mail!" },
                      { type: "email", message: "The input is not valid E-mail!" },
                    ]}
                  >
                    <Input
                      size="large"
                      variant="filled"
                      placeholder="Enter your email"
                      prefix={<MailOutlined />}
                      autoComplete="email"
                      autoFocus
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full bg-purple-600"
                    >
                      Send verification code
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}

            {step === STEP.CODE && (
              <>
                <Typography.Text className="block text-base mb-6">
                  Enter the 6-digit code we sent to <b>{email}</b>. The code
                  expires in {codeExpiryMinutes} minutes. If it doesn&apos;t
                  arrive within a couple of minutes, please check your
                  Spam/Junk folder before requesting a new one.
                </Typography.Text>
                <Form
                  layout="vertical"
                  form={codeForm}
                  onFinish={handleCodeSubmit}
                >
                  <Form.Item
                    name="code"
                    label={
                      <Typography.Title level={5}>
                        Verification code
                      </Typography.Title>
                    }
                    validateStatus={codeError ? "error" : undefined}
                    help={codeError || undefined}
                    rules={[
                      { required: true, message: "Please enter the verification code" },
                      { len: 6, message: "Code must be 6 digits" },
                      { pattern: /^[0-9]+$/, message: "Code must be numeric" },
                    ]}
                  >
                    <Input
                      size="large"
                      variant="filled"
                      placeholder="Enter 6-digit code"
                      prefix={<NumberOutlined />}
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full bg-purple-600"
                    >
                      Verify code
                    </Button>
                  </Form.Item>
                </Form>
                <div className="flex items-center justify-between">
                  <Button
                    type="link"
                    className="px-0"
                    onClick={() => setStep(STEP.EMAIL)}
                  >
                    Use a different email
                  </Button>
                  <Button
                    type="link"
                    disabled={resendCooldown > 0 || isSubmitting}
                    onClick={handleResend}
                  >
                    {resendCooldown > 0
                      ? `Resend code (${resendCooldown}s)`
                      : "Resend code"}
                  </Button>
                </div>
              </>
            )}

            {step === STEP.PASSWORD && (
              <>
                <Typography.Text className="block text-base mb-6">
                  Choose a new password. It must be at least 6 characters
                  long.
                </Typography.Text>
                <Form
                  layout="vertical"
                  form={passwordForm}
                  onFinish={handlePasswordSubmit}
                >
                  <Form.Item
                    name="newPassword"
                    label={
                      <Typography.Title level={5}>
                        New password
                      </Typography.Title>
                    }
                    rules={[
                      { required: true, message: "Please input your new password!" },
                      { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      variant="filled"
                      placeholder="Enter your new password"
                      prefix={<LockOutlined />}
                      autoComplete="new-password"
                      autoFocus
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label={
                      <Typography.Title level={5}>
                        Confirm new password
                      </Typography.Title>
                    }
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "Please confirm your new password!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Passwords do not match"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      variant="filled"
                      placeholder="Re-enter your new password"
                      prefix={<LockOutlined />}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full bg-purple-600"
                    >
                      Reset password
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}

            {step === STEP.SUCCESS && (
              <>
                <Typography.Text className="block text-base mb-6">
                  Your password has been reset successfully. You can now log
                  in with your new password.
                </Typography.Text>
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-purple-600"
                  onClick={() => navigate("/login")}
                >
                  Back to login
                </Button>
              </>
            )}

            {step !== STEP.SUCCESS && (
              <Link to="/login" className="block text-center text-base mt-6">
                Back to login
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </Spring>
  );
};

export default ForgotPassword;
