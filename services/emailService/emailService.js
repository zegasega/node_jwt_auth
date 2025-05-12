const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require('./config');  

AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const getHtmlTemplate = (username) => {
  const templatePath = path.join(__dirname, 'welcomeTemplate.html'); 
  let template = fs.readFileSync(templatePath, 'utf8');
  
  template = template.replace('{{username}}', username);
  
  return template;
};

const sendWelcomeEmail = async (toEmail, username) => {
  const htmlContent = getHtmlTemplate(username); 

  const emailParams = {
    Destination: {
      ToAddresses: [toEmail],  
    },
    Message: {
      Body: {
        Html: {
          Data: htmlContent, 
        },
      },
      Subject: {
        Data: 'Welcome to Our Service!',
      },
    },
    Source: config.aws.sourceEmail,  
  };

  try {
    await ses.sendEmail(emailParams).promise();
    console.log(`Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = { sendWelcomeEmail };
