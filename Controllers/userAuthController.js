const USER = require("../Models/User")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { sendWelcomeEmail, sendResetPasswordMail } = require("../Utils/sendEmail")

//Generate JsonWebToken
const generateToken = ({userId, email })=>{
    const token = JWT.sign({ id : userId, email}, process.env.JWT_SECRET, {
        expiresIn : "15m"
    })
    console.log(token)

    return token;
}

//SIGN UP / REGISTER FLOW
//get access to the request --- req-body
//check if there is an existing user
//if no existing user
//hash password
//create an acct
//save - user details - into DB

const signup = async (req, res) => {
    console.log("Incoming signup request")

    const { firstName, lastName, email, phoneNumber, password } = req.body
    console.log(req.body);

    try {
        //validate data coming from the request
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
          return res.status(400).json({ success : false , message : "Please provide all credentials"})
        }
        //if user exists? -- findOne()
        const existingUser = await USER.findOne({
            $or: [{email}, {phoneNumber}],
        })
        if (existingUser) {
            let message = "";
            if (existingUser.email === email) {
                message = "Email address already registered to an existing user";
            } else if (existingUser.phoneNumber === phoneNumber) {
                message = "Phone number already registered to an existing user";
            } else {
                message = "User already exists with provided credentials";
            }
            return res.status(400).json({ success : false, message})
        }

        //protect password by hashing
        const hashedPassword = await bcrypt.hash(password,12)
        
        //create user acct
        const user = new USER({
            firstName : firstName,
            lastName : lastName,
            email : email,
            phoneNumber : phoneNumber,
            password : hashedPassword
        })
        await user.save()

        const token = generateToken({ userId : user._id, email : user.email})

        const homePageUrl = `${process.env.FRONTEND_URL}`
        await sendWelcomeEmail({
            firstName : user.firstName,
            homePageUrl,
            email : user.email
        })
        //   if (process.env.NODE_ENV === "production") {
        //     await sendWelcomeEmail({
        //     firstName : user.firstName,
        //     homePageUrl,
        //     email : user.email
        // })
        // }

        res.status(201).json({ success : true, message : "User created successfully", token, user : { id : user._id, firstName: user.firstName, lastName : user.lastName, email : user.email, phoneNumber : user.phoneNumber}})
    } catch (error) {
        // if (error.code === 11000 ) {
        //     return res.status(400).json({
        //         success : false,
        //         message : "User already exists"
        //     })
        // }

        console.error(error);
        res.status(500).json({ success : false, message : "Signup failed", error : error.message})
    }
}

//SignIn
//get access to req.body
//find a user in db with the req details findOne
//if user in db
//compare user passwords
//bcrypt.compare
//create session token
const signin = async (req,res)=>{
    console.log("Incoming Sign in request");

    const {email, password} = req.body;
    console.log(req.body);
    try {
        //find user in db
        const user = await USER.findOne({email})
        if (!user) {
            return res.status(404).json({ success : false , message : "User not found"})
        }
        //compare password if there is a user
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success : false, message : "Invalid credentials"})
        }
        
        //create session token
        const token = generateToken({userId : user._id, email : user.email})

        res.status(200).json({
            success : true,
            message : "Login Successful",
            token,
            user : { 
                id : user._id, 
                firstName: user.firstName, 
                lastName : user.lastName, 
                email : user.email, 
                phoneNumber : user.phoneNumber
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            success : false, 
            message : "Login failed",
            error : error.message
        })
    }
}

const forgotPassword = async (req,res) => {
    console.log("forgot password route hit");
    const { email } = req.body;
    console.log(req.body);

    //validate email and find user
    try {
        if (!email) {
            return res.status(400).json({ success : false, message : "Please provide an email"})
        }
        const user = await USER.findOne({ email })
        if (!user) {
            return res.status(404).json({ success : false, message : "No user found with this email"})
        }
        //create a new session token for user
        const resetToken = generateToken({userId : user._id, email : user.email})
        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; //15mins
        await user.save()

        const homePageUrl = `${process.env.FRONTEND_URL}`
        const resetLink = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`

        await sendResetPasswordMail({
            firstName : user.firstName,
            homePageUrl,
            email : user.email,
            resetLink
        })

        res.status(200).json({ success : true , message : "Password reset link sent to your email", resetToken})
    } catch (error) {
        console.log(error, "Error sending email")
        res.status(500).json({ success : false, message : "Something went wrong, failed to send email", error : error.message})
    }
    
}

const resetPassword = async (req, res) => {
    console.log("Password reset route hit");
    const { password } = req.body
    console.log(req.body);
    const { token } = req.params
    console.log(token);

//   console.log("Password reset route hit at:", req.originalUrl);
//   console.log("Token received:", req.params.token);
//   console.log("Body received:", req.body);


    try {
        if (!password) {
            return res.status(400).json({ success : false, message : "Please provide a password"})
        }
         if (!token) {
            return res.status(400).json({ success : false, message : "Invalid or expired token"})
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        console.log("Received token :", token);
        const hashedPassword = await bcrypt.hash(password, 12)
        await USER.findByIdAndUpdate(userId, { password : hashedPassword, resetToken : null, resetTokenExpiry : null })
        return res.status(200).json({ message : "Password reset successful"})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message : "Invalid or expired token"})
    }
    
}
module.exports = {signup, signin, forgotPassword, resetPassword }

