const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,      
    pass: process.env.MAIL_PASSWORD, 
  },
})

const sendResetEmail = async (to, resetToken) => {
const resetUrl = `${process.env.FRONTEND_URL}/forget-pw?token=${resetToken}`;
 const mailOptions = {
  from: `"WorkPulse" <${process.env.MAIL_USER}>`,
  to,
  subject: "Reset Your WorkPulse Password",
  html: `
    <div style="
      margin: 0;
      padding: 40px 20px;
      background-color: #f1f5f9;
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
    ">
      <div style="
        max-width: 560px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      ">

        <div style="
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          padding: 28px 32px;
          text-align: center;
        ">
          <div style="
            display: inline-block;
            width: 46px;
            height: 46px;
            line-height: 46px;
            background-color: rgba(255,255,255,0.15);
            border-radius: 12px;
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
          ">
            W
          </div>

          <h1 style="
            margin: 12px 0 0;
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.3px;
          ">
            WorkPulse
          </h1>
        </div>

        <div style="padding: 36px 32px 30px;">

          <div style="
            width: 56px;
            height: 56px;
            margin: 0 auto 20px;
            background-color: #eff6ff;
            border-radius: 50%;
            text-align: center;
            line-height: 56px;
            color: #2563eb;
            font-size: 24px;
          ">
            🔐
          </div>

          <h2 style="
            margin: 0;
            text-align: center;
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
          ">
            Reset your password
          </h2>

          <p style="
            margin: 14px 0 0;
            text-align: center;
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
          ">
            We received a request to reset the password for your
            WorkPulse account.
          </p>

          <p style="
            margin: 24px 0 0;
            color: #475569;
            font-size: 14px;
            line-height: 1.7;
          ">
            Click the button below to create a new password and
            regain access to your account.
          </p>

          <div style="
            margin: 28px 0;
            text-align: center;
          ">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 13px 28px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                font-size: 14px;
                font-weight: 700;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
              "
            >
              Reset My Password
            </a>
          </div>

          <div style="
            margin: 24px 0;
            padding: 16px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          ">
            <p style="
              margin: 0 0 8px;
              color: #64748b;
              font-size: 12px;
              font-weight: 600;
            ">
              Can't click the button?
            </p>

            <a
              href="${resetUrl}"
              style="
                color: #2563eb;
                font-size: 12px;
                line-height: 1.6;
                word-break: break-all;
                text-decoration: none;
              "
            >
              ${resetUrl}
            </a>
          </div>

          <div style="
            margin-top: 24px;
            padding: 14px 16px;
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            border-radius: 6px;
          ">
            <p style="
              margin: 0;
              color: #1e40af;
              font-size: 13px;
              line-height: 1.6;
            ">
              <strong>Security notice:</strong>
              This password reset link will expire in 15 minutes.
            </p>
          </div>

          <p style="
            margin: 26px 0 0;
            color: #64748b;
            font-size: 13px;
            line-height: 1.7;
          ">
            If you didn't request a password reset, you can safely
            ignore this email. Your password will remain unchanged.
          </p>

        </div>

        <div style="
          padding: 22px 32px;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        ">
          <p style="
            margin: 0;
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.6;
          ">
            This is an automated message from WorkPulse.
          </p>

          <p style="
            margin: 6px 0 0;
            color: #94a3b8;
            font-size: 12px;
          ">
            © 2026 WorkPulse. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `,
};

  await transporter.sendMail(mailOptions);
};


module.exports = { sendResetEmail };