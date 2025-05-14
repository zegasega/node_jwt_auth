const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'alphonso.gerhold@ethereal.email',
        pass: 'bhxja1AhcMS7BVyDuV'
    }
});
const welcomeHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333333;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            padding: 10px 0;
            border-top: 1px solid #e0e0e0;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our Platform!</h1>
        </div>
        <div class="content">
            <p>Hi {{userName}},</p>
            <p>Thank you for joining us! We are excited to have you on board. Get ready to explore everything our platform has to offer.</p>
            <p>Feel free to reach out if you have any questions. We're here to help!</p>
            <a href="https://yourplatform.com/dashboard" class="cta-button">Go to Dashboard</a>
        </div>
        <div class="footer">
            <p>&copy; 2025 Your Company Name. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
`;


const randomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000); 
};

async function sendVerificationEmail(to, userName) {
    try {
        const verificationCode = randomNumber();

        const emailContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome, ${userName}!</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4CAF50;">${verificationCode}</h1>
                <p>Please enter this code to complete your registration.</p>
                <br/>
                <small>If you did not request this, please ignore this email.</small>
            </div>
        `;

        const info = await transporter.sendMail({
            from: '"Test Sender" <test@example.com>', 
            to: to, 
            subject: 'Your Verification Code', 
            text: `Your verification code is: ${verificationCode}`, 
            html: emailContent 
        });

        console.log('Email sent:', info.messageId);
        return verificationCode; 
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
}



async function sendTestEmail(to, userName) {
    try {
        let emailContent = welcomeHtmlTemplate.replace('{{userName}}', userName);

        const info = await transporter.sendMail({
            from: '"Test Sender" <test@example.com>', 
            to: to, 
            subject: 'Welcome to Our Platform!', 
            text: 'This is a test email.', 
            html: emailContent 
        });

        console.log('Email sent:', info.messageId); 
    } catch (err) {
        console.error('Failed to send email:', err); 
    }
}

module.exports = { sendTestEmail, sendVerificationEmail };  
