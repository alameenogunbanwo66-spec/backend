const welcomeEmailTemplate = (firstName,homePageUrl)=>{

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GadgetHub</title>
</head>
<body style="box-sizing: border-box; padding: 0px; margin: 0px;">
    <div style="max-width: 600px; display: flex; flex-direction: column; gap: 5px;margin: auto; overflow: hidden;">
        <div style="width: 100%; padding: 8px; background-color: #FFF1EA; display: flex; align-items: center;justify-content: center;">
            <img style="width: 172px; height: 43.8px ;" src="https://res.cloudinary.com/dfrzhfxtd/image/upload/v1768822864/2715f01480baf4cc82e6edd0e39847038bcdb151_v5ccwp.png" alt="">
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

module.exports = {welcomeEmailTemplate}