const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────────────────────
// Create transporter (Gmail — configure in .env)
// ─────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Gmail App Password (not your Gmail login password)
    },
  });

// ─────────────────────────────────────────────────────────────
// Base HTML wrapper for all emails
// ─────────────────────────────────────────────────────────────
const wrap = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #2e7d32; padding: 28px 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px; }
    .header p  { color: #c8e6c9; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 32px; color: #333; line-height: 1.6; }
    .body h2 { color: #2e7d32; margin-top: 0; }
    .info-box { background: #f1f8e9; border-left: 4px solid #66bb6a; padding: 14px 18px; border-radius: 6px; margin: 18px 0; }
    .info-box p { margin: 6px 0; font-size: 14px; }
    .info-box strong { color: #2e7d32; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; }
    .badge-pending  { background: #fff3e0; color: #e65100; }
    .badge-approved { background: #e8f5e9; color: #2e7d32; }
    .badge-declined { background: #ffebee; color: #c62828; }
    .badge-paid     { background: #e3f2fd; color: #1565c0; }
    .btn { display: inline-block; margin-top: 20px; padding: 12px 28px; background: #2e7d32; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; }
    .footer { background: #f4f6f8; text-align: center; padding: 16px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌱 Himachal AgroRent</h1>
      <p>Connecting Farmers & Land Owners</p>
    </div>
    <div class="body">
      <h2>${title}</h2>
      ${body}
    </div>
    <div class="footer">© ${new Date().getFullYear()} Himachal AgroRent — All rights reserved</div>
  </div>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────
// Generic send helper
// ─────────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not sent — EMAIL_USER or EMAIL_PASS missing in .env');
    return;
  }
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Himachal AgroRent" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to} — ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    // Don't throw — email failure should never break the main flow
  }
};

// ─────────────────────────────────────────────────────────────
// 1. Welcome email after registration
// ─────────────────────────────────────────────────────────────
const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: '🌱 Welcome to Himachal AgroRent!',
    html: wrap('Welcome, ' + user.name + '!', `
      <p>Thank you for joining <strong>Himachal AgroRent</strong>. Your account has been created successfully.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
      </div>
      <p>You can now browse available lands, make bookings, and manage your agricultural needs.</p>
      <p>If you have any questions, feel free to contact us.</p>
    `),
  });

// ─────────────────────────────────────────────────────────────
// 2. Booking confirmation to the user (renter)
// ─────────────────────────────────────────────────────────────
const sendBookingConfirmationEmail = (user, booking, land) =>
  sendEmail({
    to: user.email,
    subject: '📋 Booking Received — Himachal AgroRent',
    html: wrap('Your Booking is Received!', `
      <p>Hi <strong>${user.name}</strong>, your booking request has been submitted and is awaiting farmer approval.</p>
      <div class="info-box">
        <p><strong>Land:</strong> ${land.title}</p>
        <p><strong>Location:</strong> ${land.location}</p>
        <p><strong>Start Date:</strong> ${new Date(booking.startDate).toDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(booking.endDate).toDateString()}</p>
        <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Status:</strong> <span class="badge badge-pending">Pending</span></p>
      </div>
      <p>You will receive another email once the farmer approves or declines your request.</p>
    `),
  });

// ─────────────────────────────────────────────────────────────
// 3. New booking alert to the farmer
// ─────────────────────────────────────────────────────────────
const sendNewBookingAlertToFarmer = (farmer, user, booking, land) =>
  sendEmail({
    to: farmer.email,
    subject: '🔔 New Booking Request — Himachal AgroRent',
    html: wrap('You Have a New Booking Request!', `
      <p>Hi <strong>${farmer.name}</strong>, someone has requested to rent your land.</p>
      <div class="info-box">
        <p><strong>Land:</strong> ${land.title}</p>
        <p><strong>Renter:</strong> ${user.name}</p>
        <p><strong>Renter Email:</strong> ${user.email}</p>
        <p><strong>Renter Phone:</strong> ${user.phone || 'N/A'}</p>
        <p><strong>Start Date:</strong> ${new Date(booking.startDate).toDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(booking.endDate).toDateString()}</p>
        <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        ${booking.userMessage ? `<p><strong>Message:</strong> ${booking.userMessage}</p>` : ''}
      </div>
      <p>Please log in to your dashboard to approve or decline this request.</p>
    `),
  });

// ─────────────────────────────────────────────────────────────
// 4. Booking status update to the user (approved / declined)
// ─────────────────────────────────────────────────────────────
const sendBookingStatusEmail = (user, booking, land, status, farmerNote) => {
  const approved = status === 'approved';
  return sendEmail({
    to: user.email,
    subject: approved
      ? '✅ Booking Approved — Himachal AgroRent'
      : '❌ Booking Declined — Himachal AgroRent',
    html: wrap(
      approved ? 'Your Booking has been Approved!' : 'Your Booking was Declined',
      `
      <p>Hi <strong>${user.name}</strong>, the farmer has ${approved ? 'approved' : 'declined'} your booking request.</p>
      <div class="info-box">
        <p><strong>Land:</strong> ${land.title}</p>
        <p><strong>Location:</strong> ${land.location}</p>
        <p><strong>Start Date:</strong> ${new Date(booking.startDate).toDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(booking.endDate).toDateString()}</p>
        <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Status:</strong>
          <span class="badge badge-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </p>
        ${farmerNote ? `<p><strong>Farmer Note:</strong> ${farmerNote}</p>` : ''}
      </div>
      ${approved
        ? '<p>Congratulations! Please contact the farmer to finalize arrangements.</p>'
        : '<p>You can browse other available lands on our platform.</p>'
      }
    `
    ),
  });
};

// ─────────────────────────────────────────────────────────────
// 5. Payment success email to user
// ─────────────────────────────────────────────────────────────
const sendPaymentSuccessEmail = (user, booking, land) =>
  sendEmail({
    to: user.email,
    subject: '💳 Payment Successful — Himachal AgroRent',
    html: wrap('Payment Confirmed!', `
      <p>Hi <strong>${user.name}</strong>, your payment was successful and your booking is confirmed.</p>
      <div class="info-box">
        <p><strong>Land:</strong> ${land.title}</p>
        <p><strong>Location:</strong> ${land.location}</p>
        <p><strong>Start Date:</strong> ${new Date(booking.startDate).toDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(booking.endDate).toDateString()}</p>
        <p><strong>Amount Paid:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Payment ID:</strong> ${booking.paymentId}</p>
        <p><strong>Order ID:</strong> ${booking.orderId}</p>
        <p><strong>Status:</strong> <span class="badge badge-paid">Paid</span></p>
      </div>
      <p>Thank you for using Himachal AgroRent. Happy farming! 🌾</p>
    `),
  });



// ─────────────────────────────────────────────────────────────
// 6. Password reset email
// ─────────────────────────────────────────────────────────────
const sendPasswordResetEmail = (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: '🔑 Password Reset Request — Himachal AgroRent',
    html: wrap('Reset Your Password', `
      <p>Hi <strong>${user.name}</strong>, we received a request to reset your password.</p>
      <p>Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.</p>
      <div style="text-align:center;">
        <a href="${resetUrl}" class="btn" style="background:#2e7d32;color:#fff;padding:12px 28px;border-radius:6px;font-weight:bold;text-decoration:none;display:inline-block;margin:20px 0;">
          Reset Password
        </a>
      </div>
      <p style="font-size:13px;color:#777;">Or copy and paste this link into your browser:</p>
      <p style="font-size:12px;word-break:break-all;color:#555;">${resetUrl}</p>
      <div class="info-box">
        <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      </div>
    `),
  });

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendNewBookingAlertToFarmer,
  sendBookingStatusEmail,
  sendPaymentSuccessEmail,
  sendPasswordResetEmail,
};
