export const verifyEmailTemplate = (name: string, link: string) => {
    return `
      <div style="font-family: Arial; padding: 20px">
        <h2>Welcome 👋 ${name}</h2>
        <p>Please verify your email to continue:</p>
        <a href="${link}" style="
          padding: 12px 20px;
          background: #4CAF50;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        ">Verify Email</a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `;
  };
  
  export const resetPasswordTemplate = (name: string, link: string) => {
    return `
      <div style="font-family: Arial; padding: 20px">
        <h2>Password Reset</h2>
        <p>Hi ${name},</p>
        <p>Click below to reset your password:</p>
        <a href="${link}" style="
          padding: 12px 20px;
          background: #ff4d4f;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        ">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `;
  };