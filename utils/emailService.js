const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: "deshgautam05@gmail.com",
      pass: "wada ngtn mxzi sqzo"
    }
  });
};

// Send event notification to all students
const sendEventNotification = async (event) => {
  try {
    // In a real application, you would get this list from faculty coordinator
    // For demo purposes, we'll use a sample list
    const studentEmails = [
      'xmnub567@gmail.com',
      'deshgautam03@gmail.com',
      'tanyaabrol12@gmail.com'
    ];

    const transporter = createTransporter();

    const mailOptions = {
      from:"deshgautam05@gmail.com",
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
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/events/${event._id}" 
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
      from:'"Desh deepak"<xmnub567@gmail.com>',
      to:"xmnub567@gmail.com",
      subject:'hellooo',
      html:"<b>Hello</b>"
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send application status update email
const sendApplicationStatusEmail = async (application, status) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      approved: {
        subject: 'Application Approved!',
        color: '#27ae60',
        message: 'Congratulations! Your application has been approved.'
      },
      rejected: {
        subject: 'Application Update',
        color: '#e74c3c',
        message: 'Your application status has been updated.'
      },
      pending: {
        subject: 'Application Received',
        color: '#f39c12',
        message: 'Your application has been received and is under review.'
      }
    };

    const statusInfo = statusMessages[status];
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
    return result;
  } catch (error) {
    console.error('Error sending application status email:', error);
    throw error;
  }
};

module.exports = {
  sendEventNotification,
  sendEmail,
  sendApplicationStatusEmail
};
