const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "deshgautam05@gmail.com",
      pass: process.env.EMAIL_PASS || "wada ngtn mxzi sqzo"
    }
  });
};

// Send event notification to all students
const sendEventNotification = async (event) => {
  try {
    // In a real application, you would get this list from faculty coordinator
    // For demo purposes, we'll use a sample list
    const studentEmails = [
      // 'xmnub567@gmail.com',
      // 'deshgautam03@gmail.com',
      // 'tanyaabrol12@gmail.com',
      "deshgautam06@gmail.com",
      "deshgautam05@gmail.com"
    ];

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || "deshgautam05@gmail.com",
      subject: `New Event: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; text-align: center;">🎉 New Campus Event!</h2>
          <div style="background-color: #ecf0f1; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #e74c3c; margin-top: 0;">${event.title}</h3>
            <p style="color: #34495e; line-height: 1.6;">${event.shortDescription}</p>
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📅 Date:</strong> ${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}</p>
              <p><strong>📍 Venue:</strong> ${event.venue}</p>
              <p><strong>🏷️ Category:</strong> ${event.category}</p>
              <p><strong>⏰ Registration Deadline:</strong> ${new Date(event.registrationDeadline).toLocaleDateString()}</p>
              <p><strong>👥 Max Participants:</strong> ${event.maxParticipants}</p>
              ${event.entryFee > 0 ? `<p><strong>💰 Entry Fee:</strong> $${event.entryFee}</p>` : ''}
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">
              Don't miss out on this exciting opportunity! Visit the Campus Events Portal to learn more and apply.
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'https://campusconnect3-0-1.onrender.com'}/events/${event._id}" 
               style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Event Details
            </a>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #95a5a6; font-size: 12px;">
            <p>This is an automated notification from Campus Events Portal</p>
          </div>
        </div>
      `
    };

    // Send emails to all students
    const emailPromises = studentEmails.map(email => {
      return transporter.sendMail({
        ...mailOptions,
        to: email
      }).catch(error => {
        console.error(`Failed to send email to ${email}:`, error);
        return { error, email };
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    // Log results
    const successful = results.filter(result => result.status === 'fulfilled' && !result.value.error).length;
    const failed = results.filter(result => result.status === 'rejected' || result.value.error).length;
    
    console.log(`Event notification sent: ${successful} successful, ${failed} failed`);
    
    return { successful, failed };
  } catch (error) {
    console.error('Error sending event notifications:', error);
    throw error;
  }
};

// Send individual email
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Campus Events"<${process.env.EMAIL_USER || 'deshgautam05@gmail.com'}>`,
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send welcome email to new users
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Campus Events Portal!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#2c3e50;">Welcome, ${user.name} 👋</h2>
      <p>We're excited to have you join the Campus Events Portal.</p>
      <div style="background:#ecf0f1; padding:16px; border-radius:8px;">
        <p><strong>Your role:</strong> ${user.userType}</p>
        <p><strong>Department:</strong> ${user.department || 'N/A'}</p>
      </div>
      <p style="margin-top:16px;">Start exploring events, apply to participate, and stay updated!</p>
      <div style="margin-top:24px;">
        <a href="${process.env.CLIENT_URL || 'https://campusconnect3-0-1.onrender.com'}/events" style="background:#e67e22; color:#fff; padding:10px 20px; text-decoration:none; border-radius:6px;">Browse Events</a>
      </div>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

// Send application status update email
const sendApplicationStatusEmail = async (application, status) => {
  try {
    console.log('Sending application status email:', { 
      studentEmail: application.student?.email, 
      eventTitle: application.event?.title, 
      status 
    });
    
    const transporter = createTransporter();
    
    const statusMessages = {
      approved: {
        subject: 'Application Approved!',
        color: '#27ae60',
        message: 'Congratulations! Your participation has been approved.'
      },
      rejected: {
        subject: 'Application Update',
        color: '#e74c3c',
        message: 'Your participation status has been rejected.'
      },
      pending: {
        subject: 'Application Received',
        color: '#f39c12',
        message: 'Your participation has been received and is under review.'
      }
    };

    const statusInfo = statusMessages[status];
    
    const mailOptions = {
      from: process.env.EMAIL_USER || "deshgautam05@gmail.com",
      to: application.student.email,
      subject: `${statusInfo.subject} - ${application.event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${statusInfo.color}; text-align: center;">${statusInfo.subject}</h2>
          <div style="background-color: #ecf0f1; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">${application.event.title}</h3>
            <p style="color: #34495e; line-height: 1.6;">${statusInfo.message}</p>
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${status.toUpperCase()}</span></p>
              <p><strong>Application Date:</strong> ${new Date(application.applicationDate).toLocaleDateString()}</p>
              ${application.remarks ? `<p><strong>Remarks:</strong> ${application.remarks}</p>` : ''}
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">
              Check your dashboard for more details about your application.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("statsu success");
    return result;

  } catch (error) {
    console.error('Error sending application status email:', error);
    throw error;
  }
};

// Send OTP email for password reset
const sendOTPEmail = async (email, otp) => {
  const subject = 'Password Reset OTP - Campus Events Portal';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">🔐 Password Reset Request</h2>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Campus Events Portal</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
          You have requested to reset your password. Use the following One-Time Password (OTP) to complete the process:
        </p>
        
        <div style="background: #f8f9fa; border: 2px dashed #e74c3c; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; color: #7f8c8d; font-size: 14px; font-weight: bold;">YOUR OTP CODE</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #e74c3c; font-family: 'Courier New', monospace;">${otp}</div>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⚠️ Important:</strong> This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email.
          </p>
        </div>
        
        <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #155724; font-size: 14px;">
            <strong>📝 Instructions:</strong> Enter this OTP in the password reset form along with your new password to complete the reset process.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
          <p style="color: #95a5a6; font-size: 12px; margin: 0;">
            This is an automated message from Campus Events Portal. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;
  return sendEmail(email, subject, html);
};

module.exports = {
  sendEventNotification,
  sendEmail,
  sendApplicationStatusEmail,
  sendWelcomeEmail,
  sendOTPEmail
};
