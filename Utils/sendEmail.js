const nodemailer = require("nodemailer")
// const postmark= require("postmark")
// const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN)

const { welcomeEmailTemplate, resetPasswordEmailTemplate } = require("./emailTemplates")

 const transporter = nodemailer.createTransport({
        service : process.env.EMAIL_SERVICE,
        auth : {
            user : process.env.APP_EMAIL,
            pass : process.env.APP_PASSWORD,
        },
    });

const sendEmail = async ({ to, subject, html })=>{
    try {
        const info = await transporter.sendMail({
            from :`"GadgetHub" <${process.env.APP_EMAIL}>`,
            to : to, // mail receiver
            subject : subject, //subject line
            html : html, // html body
        })
        console.log(`Email sent : ${info.response}`);
        return info
    } catch (error) {
        console.error("Email failed to send :", error.message)    
        throw new Error ("Failed to send email.")
    }
}

// const sendEmail = async ({ to, subject, html }) => {
//     try {
//         await client.sendEmail({
//             From :process.env.APP_EMAIL,
//             To: to,
//             Subject : subject,
//             HtmlBody : html,
//         })
//         console.log("Email sent successfully");
//     } catch (error) {
//         console.error("Email failed to send:", error.message)
//         throw new Error ("Failed to send email")
//     }
// }

const sendWelcomeEmail = ({ firstName, homePageUrl, email })=>{
    const subject = "Welcome to GadgetHub";
    const html = welcomeEmailTemplate(firstName, homePageUrl)

   return sendEmail({ to : email, subject, html})
}

const sendResetPasswordMail = ({firstName,resetLink, homePageUrl,email})=>{
    const subject = "Reset Your Password";
    const html = resetPasswordEmailTemplate(firstName, resetLink, homePageUrl)

    return sendEmail({ to : email, subject, html})
}

module.exports = { sendWelcomeEmail, sendResetPasswordMail }