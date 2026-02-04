const welcomeEmailTemplate = (firstName,homePageUrl)=>{

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GadgetHub</title>
</head>
<body style="box-sizing: border-box; padding: 0px; margin: 0px;">
    <div style="max-width: 600px;  gap: 5px;margin: auto; overflow: hidden;">
        <div style="width: 100%; padding: 8px; background-color: #F4F1FF; display: flex; align-items: center;justify-content: center;">
            <img style="width: 172px; height: 43.8px ;" src="https://res.cloudinary.com/dfrzhfxtd/image/upload/v1770115039/GadgetHub_Logo_kjrrn6.png" alt="">
        </div>

        <div style="background-color: #FFFFFF; padding: 20px;">
            <h1>Welcome to GadgetHub</h1>
             <p>Hi ${firstName},</p>
            <p>We’re thrilled to have you join <strong>GadgetHub</strong> – your new home for the latest gadgets, tech tips, and exclusive deals.</p>
           <p>Here’s what you can look forward to:</p>
           <ul>
            <li>Early access to new product launches</li>
            <li>Expert reviews and buying guides</li>
            <li>Special member-only discounts</li>
            </ul>
            <p>Ready to explore? Click below to start discovering the future of tech today.</p>
            <a style="" href="${homePageUrl}">Get Started</a>

        </div>
        
        
    <div style="background-color: #fafafa; text-align: center; padding: 15px; font-size: 12px;">
      <p>You’re receiving this email because you signed up for GadgetHub.</p>
      <p>&copy; 2026 GadgetHub Inc. | <a href="https://gadgethub.com/unsubscribe">Unsubscribe</a></p>
    </div>
    </div>
</body>
</html>`
}

const resetPasswordEmailTemplate = (firstName, resetLink, homePageUrl)=>{


    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your password</title>
</head>
<body style="box-sizing: border-box; padding: 0px; margin: 0px;">
    <div style="max-width: 600px;  gap: 5px;margin: auto; overflow: hidden;">
          <div style="width: 100%; padding: 8px; background-color: #F4F1FF; display: flex; align-items: center;justify-content: center;">
            <img style="width: 172px; height: 43.8px ;" src="https://res.cloudinary.com/dfrzhfxtd/image/upload/v1770115039/GadgetHub_Logo_kjrrn6.png" alt="">
        </div>

        <div style="background-color: #FFFFFF; padding: 20px;">
            <h1>Reset Your Password - GadgetHub</h1>
             <p>Hi ${firstName},</p>
             <p>We received a request to reset the password for your GadgetHub account. If you made this request, click the link below to choose a new password:</p>
             <a href="${resetLink}">https://gadgethub.com/resetPassword</a>
             <p>This link will expire in 60 minutes for security purposes.If you didn't request a password reset, you can safely ignore this email - your password will remain unchanged. </p>
             <p>If you need help or have any questions, feel free to contact our support team.</p>
        </div>

        <div style="background-color: #fafafa; display: flex; flex-direction: column; padding: 15px; gap: 3px; font-size: 12px;">
            <div>
            <p>Thanks,</p>
            <p>GadgetHub</p>
            </div>
            <a href="">📧 support@gadgethub.com</a>
            <a href="${homePageUrl}">🌐 www.gadgethub.com</a>
        </div>



    </div>
</body>
</html>`
}

module.exports = {welcomeEmailTemplate, resetPasswordEmailTemplate}