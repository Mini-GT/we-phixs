export default function ResetPasswordEmail({
  username = "User",
  resetLink = "https://www.phixelpain.com/password/reset?token=abc123xyz",
}) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: "#f4f7fa",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            padding: "40px 30px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              margin: 0,
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            Reset Your Password
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: "50px 40px" }}>
          <p
            style={{
              fontSize: "18px",
              color: "#2d3748",
              marginBottom: "20px",
              fontWeight: 500,
            }}
          >
            Hello, {username}!
          </p>

          <p
            style={{
              fontSize: "16px",
              color: "#4a5568",
              lineHeight: 1.6,
              marginBottom: "30px",
            }}
          >
            We received a request to reset the password for your account. If you
            made this request, click the button below to create a new password.
          </p>

          <div
            style={{
              textAlign: "center",
              margin: "40px 0",
            }}
          >
            <a
              href={resetLink}
              style={{
                display: "inline-block",
                padding: "16px 48px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(245, 87, 108, 0.4)",
              }}
            >
              Reset Password
            </a>
          </div>

          <div
            style={{
              backgroundColor: "#fff5f5",
              borderLeft: "4px solid #f5576c",
              padding: "20px",
              margin: "30px 0",
              borderRadius: "4px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#742a2a",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              <strong>⚠️ Important:</strong> This password reset link will
              expire in 1 hour for your security. If you didn't request a
              password reset, please ignore this email and your password will
              remain unchanged.
            </p>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#e2e8f0",
              margin: "30px 0",
            }}
          ></div>

          <div
            style={{
              backgroundColor: "#f7fafc",
              padding: "20px",
              borderRadius: "8px",
              margin: "30px 0",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#718096",
                margin: "0 0 10px 0",
              }}
            >
              <strong>Button not working?</strong> Copy and paste this link into
              your browser:
            </p>
            <p
              style={{
                wordBreak: "break-all",
                color: "#f5576c",
                fontSize: "13px",
                margin: 0,
              }}
            >
              {resetLink}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#edf2f7",
              padding: "20px",
              borderRadius: "8px",
              margin: "30px 0",
            }}
          >
            <h3
              style={{
                color: "#2d3748",
                fontSize: "16px",
                margin: "0 0 15px 0",
              }}
            >
              🛡️ Password Security Tips:
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#4a5568",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              <li>Use a unique password that you don't use anywhere else</li>
              <li>Make it at least 12 characters long</li>
              <li>
                Include a mix of uppercase, lowercase, numbers, and symbols
              </li>
              <li>Consider using a password manager</li>
            </ul>
          </div>

          <p
            style={{
              fontSize: "16px",
              color: "#4a5568",
              lineHeight: 1.6,
              marginTop: "30px",
            }}
          >
            Best regards,
            <br />
            <strong>Phixel Paint Security</strong>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "30px 40px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "5px 0",
              color: "#718096",
              fontSize: "14px",
            }}
          >
            &copy; 2025 WePhoneSpec Inc. All rights reserved.
          </p>
          <p
            style={{
              marginTop: "15px",
              fontSize: "12px",
              color: "#a0aec0",
            }}
          >
            This is an automated security email. Please do not reply to this
            message.
          </p>
        </div>
      </div>
    </div>
  );
}
