require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);

async function test() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.verify();
    console.log("SMTP READY");

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "TEST EMAIL",
        text: "Working!"
    });

    console.log("EMAIL SENT");
}

test().catch(err => console.log("ERROR:", err));