const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

exports.forgotPassword = async (req, res) => {
    try {
        // Initialize the TransactionalEmailsApi instance
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        // Set the API key
        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        // Construct the SendSmtpEmail object
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
        sendSmtpEmail.subject = "Forgot Password";
        sendSmtpEmail.textContent = "Your otp for forgot password id 3456";
        sendSmtpEmail.sender = {"name": "Md Tabrez Alam", "email": "alamtabrez510@gmail.com"};
        sendSmtpEmail.to = [{"email": "alamtabrez8507@gmail.com"}];

        // Send the transactional email
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(JSON.stringify(data));

        // Send success response
        res.status(200).json({ success: true, message: "Password reset email sent successfully" });
    } catch (err) {
        console.error("Error sending password reset email:", err);
        res.status(500).json({ success: false, message: "Failed to send password reset email" });
    }
};