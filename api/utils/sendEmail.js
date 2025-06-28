import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;