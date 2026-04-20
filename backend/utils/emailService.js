const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * PB Tadka - Send OTP Email
 */
const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"PB Tadka" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Verification Code for PB Tadka',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #e11d48; text-align: center;">PB Tadka Verification</h2>
                <p>Hello,</p>
                <p>Thank you for choosing PB Tadka. Please use the following One-Time Password (OTP) to proceed:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0; border-radius: 8px;">
                    ${otp}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 10px; color: #aaa; text-align: center;">&copy; 2026 PB Tadka. All rights reserved.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] OTP sent successfully to ${to}`);
        return true;
    } catch (err) {
        console.error('[Email Service] Error sending OTP:', err.message);
        return false;
    }
};


const EmailLog = require('../models/EmailLog');

/**
 * PB Tadka - Send Notification to Subscribers when a new post is created
 * Now sends individually for granular tracking!
 */
const sendPostNotification = async (post, subscribers) => {
    if (!subscribers || subscribers.length === 0) return;

    console.log(`[Email Service] Starting individual notifications for ${subscribers.length} subscribers...`);

    // Handle different post types for the UI
    const postType = post.category ? 'News' : (post.trailerUrl ? 'Movie' : 'Video');
    const postLink = `${process.env.FRONTEND_URL || 'https://pbtadka.com'}/${postType.toLowerCase()}/${post.slug || post._id}`;

    // Loop through each subscriber to send individually
    for (const sub of subscribers) {
        const mailOptions = {
            from: `"PB Tadka" <${process.env.EMAIL_USER}>`,
            to: sub.email,
            subject: `🔥 New ${postType}: ${post.title}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px 20px; border-radius: 15px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #e11d48; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">PB TADKA</h1>
                        <p style="color: #94a3b8; font-size: 14px;">Latest from the world of Punjabi Cinema</p>
                    </div>
                    
                    <div style="background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
                        ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width: 100%; height: auto; display: block;">` : ''}
                        <div style="padding: 25px;">
                            <span style="background: #e11d48; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${postType} Notification</span>
                            <h2 style="margin: 15px 0; font-size: 22px; line-height: 1.4;">${post.title}</h2>
                            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                                ${post.excerpt || post.fullStory?.substring(0, 150) || 'Check out the latest update on PB Tadka!'}...
                            </p>
                            <a href="${postLink}" style="display: inline-block; background: #e11d48; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);">
                                READ FULL STORY
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
                        <p>You received this because you subscribed to PB Tadka updates.</p>
                        <p>&copy; 2026 PB Tadka. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            // Log success
            await EmailLog.create({
                postTitle: post.title,
                postType: postType,
                recipientEmail: sub.email,
                status: 'success'
            });
        } catch (err) {
            console.error(`[Email Service] Failed to send to ${sub.email}:`, err.message);
            // Log failure
            await EmailLog.create({
                postTitle: post.title,
                postType: postType,
                recipientEmail: sub.email,
                status: 'failed',
                error: err.message
            });
        }
    }

    console.log(`[Email Service] Finished notifications for ${post.title}`);
    return true;
};

module.exports = { sendOtpEmail, sendPostNotification };
