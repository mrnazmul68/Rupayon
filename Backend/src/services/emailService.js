import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({ email, name, code }) => {
  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Verify Your Email - Rupayon</title>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .email-header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 48px 40px;
            text-align: center;
        }
        
        .logo {
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
            margin: 0;
        }
        
        .logo-accent {
            color: #8b7355;
        }
        
        .email-body {
            padding: 48px 40px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 16px 0;
            text-align: left;
        }
        
        .paragraph {
            font-size: 16px;
            line-height: 1.75;
            color: #475569;
            margin: 0 0 32px 0;
            text-align: left;
        }
        
        .code-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 40px 32px;
            text-align: center;
            margin: 0 0 32px 0;
        }
        
        .code-label {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin: 0 0 16px 0;
        }
        
        .verification-code {
            font-size: 48px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 16px;
            font-family: 'Courier New', Courier, monospace;
            margin: 0;
            line-height: 1;
        }
        
        .info-box {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 0 0 32px 0;
        }
        
        .info-text {
            font-size: 14px;
            line-height: 1.6;
            color: #64748b;
            margin: 0;
            text-align: left;
        }
        
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 0 0 32px 0;
        }
        
        .email-footer {
            padding: 0 40px 48px 40px;
            text-align: center;
        }
        
        .footer-text {
            font-size: 13px;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 8px 0;
        }
        
        .footer-links {
            font-size: 13px;
            color: #64748b;
        }
        
        .footer-links a {
            color: #667eea;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            
            .email-header {
                padding: 32px 24px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .email-body {
                padding: 32px 24px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .verification-code {
                font-size: 36px;
                letter-spacing: 12px;
            }
            
            .email-footer {
                padding: 0 24px 32px 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h1 class="logo">Rupa<span class="logo-accent">yon</span></h1>
            </div>
            
            <div class="email-body">
                <h2 class="greeting">Hi ${name || 'there'},</h2>
                
                <p class="paragraph">
                    Thank you for joining Rupayon! To complete your registration and activate your account, 
                    please use the verification code below.
                </p>
                
                <div class="code-section">
                    <p class="code-label">Your Verification Code</p>
                    <p class="verification-code">${code}</p>
                </div>
                
                <div class="info-box">
                    <p class="info-text">
                        <strong>This code expires in 10 minutes.</strong><br>
                        If you didn't create an account with Rupayon, you can safely ignore this email.
                    </p>
                </div>
                
                <p class="paragraph">
                    If you have any questions, feel free to reach out to our support team.
                </p>
            </div>
            
            <div class="divider"></div>
            
            <div class="email-footer">
                <p class="footer-text">
                    &copy; 2026 Rupayon. All rights reserved.
                </p>
                <p class="footer-text">
                    Rupayon, Dhaka, Bangladesh
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: "Rupayon <noreply@rupayon.com>",
      to: email,
      subject: "Verify Your Email Address - Rupayon",
      html,
    });

    return result;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async ({ email, name, code }) => {
  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reset Your Password - Rupayon</title>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .email-header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            padding: 48px 40px;
            text-align: center;
        }
        
        .logo {
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
            margin: 0;
        }
        
        .logo-accent {
            color: #fecaca;
        }
        
        .email-body {
            padding: 48px 40px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 16px 0;
            text-align: left;
        }
        
        .paragraph {
            font-size: 16px;
            line-height: 1.75;
            color: #475569;
            margin: 0 0 32px 0;
            text-align: left;
        }
        
        .code-section {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 16px;
            padding: 40px 32px;
            text-align: center;
            margin: 0 0 32px 0;
        }
        
        .code-label {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.95);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin: 0 0 16px 0;
        }
        
        .verification-code {
            font-size: 48px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 16px;
            font-family: 'Courier New', Courier, monospace;
            margin: 0;
            line-height: 1;
        }
        
        .info-box {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            border-radius: 0 12px 12px 0;
            padding: 20px 24px;
            margin: 0 0 32px 0;
        }
        
        .info-text {
            font-size: 14px;
            line-height: 1.6;
            color: #7f1d1d;
            margin: 0;
            text-align: left;
        }
        
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 0 0 32px 0;
        }
        
        .email-footer {
            padding: 0 40px 48px 40px;
            text-align: center;
        }
        
        .footer-text {
            font-size: 13px;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 8px 0;
        }
        
        .footer-links {
            font-size: 13px;
            color: #64748b;
        }
        
        .footer-links a {
            color: #dc2626;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            
            .email-header {
                padding: 32px 24px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .email-body {
                padding: 32px 24px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .verification-code {
                font-size: 36px;
                letter-spacing: 12px;
            }
            
            .email-footer {
                padding: 0 24px 32px 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h1 class="logo">Rupa<span class="logo-accent">yon</span></h1>
            </div>
            
            <div class="email-body">
                <h2 class="greeting">Hi ${name || 'there'},</h2>
                
                <p class="paragraph">
                    We received a request to reset the password for your Rupayon account. 
                    Use the verification code below to set a new password.
                </p>
                
                <div class="code-section">
                    <p class="code-label">Password Reset Code</p>
                    <p class="verification-code">${code}</p>
                </div>
                
                <div class="info-box">
                    <p class="info-text">
                        <strong>This code expires in 10 minutes.</strong><br>
                        If you didn't request a password reset, you can safely ignore this email 
                        and your password will remain unchanged.
                    </p>
                </div>
                
                <p class="paragraph">
                    If you didn't make this request, please contact our support team immediately.
                </p>
            </div>
            
            <div class="divider"></div>
            
            <div class="email-footer">
                <p class="footer-text">
                    &copy; 2026 Rupayon. All rights reserved.
                </p>
                <p class="footer-text">
                    Rupayon, Dhaka, Bangladesh
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: "Rupayon <noreply@rupayon.com>",
      to: email,
      subject: "Reset Your Password - Rupayon",
      html,
    });

    return result;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
