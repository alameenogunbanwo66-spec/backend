const nodemailer = require("nodemailer")
const { welcomeEmailTemplate } = require("./emailTemplates")

const sendEmail = async ({ to, subject, html })=>{
    const transporter = nodemailer.createTransport({
        service : process.env.EMAIL_SERVICE,
        auth : {
            user : process.env.APP_EMAIL,
            pass : process.env.APP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from : process.env.APP_EMAIL,
            to : to, // mail receiver
            subject : subject, //subject line
            html : html, // html body
        })
        console.log(`Email sent : ${info.response}`);
    } catch (error) {
        console.log(error);    
    }
}

const sendWelcomeEmail = ({ firstName, homePageUrl, email })=>{
    const subject = "Welcome to GadgetHub";
    const html = welcomeEmailTemplate(firstName, homePageUrl)

    sendEmail({ to : email, subject, html})
}

module.exports = { sendWelcomeEmail }