import nodemailer from "nodemailer"
export const sendEmail=(receipt,subject,body)=>{
    const transporter=nodemailer.createTransport({
       service:process.env.EMAIL_SERVICE,
       auth:{
           user:process.env.EMAIL_USER,
           pass:process.env.EMAIL_PASSWORD
       },
       tls: {
           rejectUnauthorized: false, 
       
       }
    })
    const mailOptions = {
       from: process.env.EMAIL_USER,
       to: receipt,
       subject: subject,
       text: body
   };
   transporter.sendMail(mailOptions,(error,info)=>{
       if (error) {
           console.error('Error sending email:', error);
       } else {
           console.log('Email sent:');
       }
   })
   }