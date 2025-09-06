const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'deshgautam05@gmail.com',
      pass: process.env.EMAIL_PASS || 'wada ngtn mxzi sqzo'
    }
  });
};

// Send event notification to all students
const sendEventNotification = async (event) => {
  try {
    // Get student emails from database configuration
    const EmailConfiguration = require('../models/EmailConfiguration');
    const config = await EmailConfiguration.findOne({ type: 'student_emails' });
    
    const studentEmails = config ? config.emails : [];
    
    if (studentEmails.length === 0) {
      console.log('No student emails configured for event notification');
      return { successful: 0, failed: 0 };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Campus Connect" <${process.env.EMAIL_USER}>` || "deshgautam05@gmail.com",
      subject: `🎉 New Event: ${event.title}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Campus Event</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
              <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px);">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  🎉 New Campus Event!
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                  Don't miss out on this exciting opportunity
                </p>
              </div>
            </div>

            <!-- Event Content -->
            <div style="padding: 40px 30px;">
              <!-- Event Title -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                  ${event.title}
                </h2>
                <div style="width: 60px; height: 3px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 15px auto; border-radius: 2px;"></div>
            </div>

              <!-- Event Description -->
              <div style="background-color: #f7fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #667eea;">
                <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6; font-style: italic;">
                  "${event.shortDescription}"
            </p>
          </div>

              <!-- Event Details Card -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">📋 Event Details</h3>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">📅</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Event Dates</strong><br>
                      <span style="color: #4a5568; font-size: 14px;">${new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">📍</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Venue</strong><br>
                      <span style="color: #4a5568; font-size: 14px;">${event.venue}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">🏷️</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Category</strong><br>
                      <span style="color: #4a5568; font-size: 14px;">${event.category}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">⏰</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Registration Deadline</strong><br>
                      <span style="color: #e53e3e; font-size: 14px; font-weight: 600;">${new Date(event.registrationDeadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">👥</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Max Participants</strong><br>
                      <span style="color: #4a5568; font-size: 14px;">${event.maxParticipants} people</span>
                    </div>
                  </div>

                  ${event.entryFee > 0 ? `
                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">💰</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Entry Fee</strong><br>
                      <span style="color: #4a5568; font-size: 14px;">$${event.entryFee}</span>
                    </div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/events/${event._id}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                  🚀 View Event Details & Apply
            </a>
          </div>

              <!-- Coordinator Info -->
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  <strong>Event Coordinator:</strong> ${event.coordinator?.name || 'N/A'}<br>
                  <strong>Department:</strong> ${event.coordinator?.department || 'N/A'}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #2d3748; padding: 30px; text-align: center; border-radius: 0;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">Campus Events Portal</h3>
                <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 14px;">
                  Connecting students with amazing campus events
                </p>
              </div>
              
              <div style="border-top: 1px solid #4a5568; padding-top: 20px;">
                <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                  This is an automated notification from Campus Events Portal<br>
                  <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none;">Visit Portal</a> | 
                  <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none;">Contact Support</a>
                </p>
              </div>
          </div>
        </div>
        </body>
        </html>
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
  const subject = '🎉 Welcome to Campus Events Portal!';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Campus Events Portal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        
        <!-- Header with Gradient -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; border-radius: 0;">
          <div style="background-color: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px);">
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Welcome to Campus Events Portal!
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
              We're thrilled to have you join our community
            </p>
          </div>
        </div>

        <!-- Welcome Content -->
        <div style="padding: 50px 30px;">
          <!-- Personal Greeting -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #2d3748; margin: 0; font-size: 28px; font-weight: 600; line-height: 1.3;">
              Hello, ${user.name}! 👋
            </h2>
            <div style="width: 80px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 20px auto; border-radius: 2px;"></div>
            <p style="color: #4a5568; margin: 0; font-size: 18px; line-height: 1.6;">
              Your journey with amazing campus events starts now!
            </p>
          </div>

          <!-- User Info Card -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 16px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
            <h3 style="color: #2d3748; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; text-align: center;">👤 Your Profile</h3>
            
            <div style="display: grid; gap: 20px;">
              <div style="display: flex; align-items: center; padding: 15px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: #ffffff; font-size: 20px; font-weight: 600;">${user.userType.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Account Type</strong><br>
                  <span style="color: #4a5568; font-size: 14px; text-transform: capitalize;">${user.userType}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; padding: 15px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: #ffffff; font-size: 20px;">🏢</span>
                </div>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Department</strong><br>
                  <span style="color: #4a5568; font-size: 14px;">${user.department || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #2d3748; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; text-align: center;">✨ What You Can Do</h3>
            
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: center; padding: 15px; background-color: #f7fafc; border-radius: 12px; border-left: 4px solid #667eea;">
                <span style="font-size: 24px; margin-right: 15px;">🎯</span>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Discover Events</strong><br>
                  <span style="color: #4a5568; font-size: 14px;">Browse and explore exciting campus events</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; padding: 15px; background-color: #f7fafc; border-radius: 12px; border-left: 4px solid #48bb78;">
                <span style="font-size: 24px; margin-right: 15px;">📝</span>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Apply to Participate</strong><br>
                  <span style="color: #4a5568; font-size: 14px;">Submit applications for events you're interested in</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; padding: 15px; background-color: #f7fafc; border-radius: 12px; border-left: 4px solid #ed8936;">
                <span style="font-size: 24px; margin-right: 15px;">🔔</span>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Stay Updated</strong><br>
                  <span style="color: #4a5568; font-size: 14px;">Receive notifications about new events and updates</span>
                </div>
              </div>

              ${user.userType === 'coordinator' ? `
              <div style="display: flex; align-items: center; padding: 15px; background-color: #f7fafc; border-radius: 12px; border-left: 4px solid #9f7aea;">
                <span style="font-size: 24px; margin-right: 15px;">🎨</span>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Create Events</strong><br>
                  <span style="color: #4a5568; font-size: 14px;">Organize and manage your own campus events</span>
                </div>
              </div>
              ` : ''}

              ${user.userType === 'faculty' ? `
              <div style="display: flex; align-items: center; padding: 15px; background-color: #f7fafc; border-radius: 12px; border-left: 4px solid #e53e3e;">
                <span style="font-size: 24px; margin-right: 15px;">👥</span>
                <div>
                  <strong style="color: #2d3748; font-size: 16px;">Manage Users</strong><br>
                  <span style="color: #4a5568; font-size: 14px;">Oversee students, coordinators, and system settings</span>
                </div>
              </div>
              ` : ''}
            </div>
          </div>

          <!-- Call to Action Buttons -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/events" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); margin: 0 10px 10px 0;">
              🚀 Browse Events
            </a>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4); margin: 0 0 10px 10px;">
              👤 View Profile
            </a>
          </div>

          <!-- Getting Started Tips -->
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">💡 Getting Started Tips</h4>
            <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Complete your profile to get personalized event recommendations</li>
              <li>Check the events page regularly for new opportunities</li>
              <li>Read event details carefully before applying</li>
              <li>Keep your contact information up to date</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #2d3748; padding: 30px; text-align: center; border-radius: 0;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">Campus Events Portal</h3>
            <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 14px;">
              Your gateway to amazing campus experiences
            </p>
          </div>
          
          <div style="border-top: 1px solid #4a5568; padding-top: 20px;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
              Need help? We're here for you!<br>
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none;">Visit Portal</a> | 
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none;">Contact Support</a>
            </p>
      </div>
      <p style="margin-top:16px;">Start exploring events, apply to participate, and stay updated!</p>
      <div style="margin-top:24px;">
        <a href="${process.env.CLIENT_URL || 'https://campusconnect3-0-1.onrender.com'}/events" style="background:#e67e22; color:#fff; padding:10px 20px; text-decoration:none; border-radius:6px;">Browse Events</a>
      </div>
    </div>
    </body>
    </html>
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
      from: `"Campus Connect" <${process.env.EMAIL_USER}>` || "deshgautam05@gmail.com",
      to: application.student.email,
      subject: `${status === 'approved' ? '🎉' : status === 'rejected' ? '📋' : '📝'} ${statusInfo.subject} - ${application.event.title}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Status Update</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            
            <!-- Header with Status-based Gradient -->
            <div style="background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
              <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px);">
                <div style="font-size: 48px; margin-bottom: 15px;">
                  ${status === 'approved' ? '🎉' : status === 'rejected' ? '📋' : '📝'}
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  ${statusInfo.subject}
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                  ${statusInfo.message}
                </p>
              </div>
            </div>

            <!-- Application Content -->
            <div style="padding: 40px 30px;">
              <!-- Event Title -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                  ${application.event.title}
                </h2>
                <div style="width: 60px; height: 3px; background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); margin: 15px auto; border-radius: 2px;"></div>
              </div>

              <!-- Status Card -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">📋 Application Details</h3>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">📊</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Application Status</strong><br>
                      <span style="color: ${statusInfo.color}; font-size: 14px; font-weight: 600; text-transform: uppercase;">${status}</span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px;">📅</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Application Date</strong><br>
                      <span style="color: #4a5568; font-size: 14px;">${new Date(application.applicationDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  ${application.remarks ? `
                  <div style="display: flex; align-items: flex-start; padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 20px; margin-right: 12px; margin-top: 2px;">💬</span>
                    <div>
                      <strong style="color: #2d3748; font-size: 14px;">Remarks</strong><br>
                      <span style="color: #4a5568; font-size: 14px; line-height: 1.5;">${application.remarks}</span>
                    </div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <!-- Status-specific Message -->
              <div style="background-color: ${status === 'approved' ? '#f0fff4' : status === 'rejected' ? '#fff5f5' : '#fffbf0'}; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid ${statusInfo.color};">
                <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                  ${status === 'approved' ? '🎉 Congratulations!' : status === 'rejected' ? '📋 Application Update' : '📝 Under Review'}
                </h4>
                <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                  ${status === 'approved' 
                    ? 'You have been selected to participate in this event! Please check your dashboard for further instructions and event details.' 
                    : status === 'rejected' 
                    ? 'Unfortunately, your application was not selected for this event. Don\'t worry, there are many other exciting opportunities available!' 
                    : 'Your application is currently being reviewed by the event coordinator. You will receive another notification once a decision has been made.'}
                </p>
              </div>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/my-applications" 
                   style="display: inline-block; background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                  📱 View My Applications
                </a>
              </div>

              <!-- Additional Actions -->
              ${status === 'approved' ? `
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  <strong>Next Steps:</strong> Check your dashboard for event details, venue information, and any additional requirements.
                </p>
              </div>
              ` : status === 'rejected' ? `
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  <strong>Keep Exploring:</strong> Browse other available events and apply to those that interest you!
                </p>
              </div>
              ` : `
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                <p style="color: #4a5568; margin: 0; font-size: 14px;">
                  <strong>Stay Tuned:</strong> We'll notify you as soon as there's an update on your application.
                </p>
              </div>
              `}
            </div>

            <!-- Footer -->
            <div style="background-color: #2d3748; padding: 30px; text-align: center; border-radius: 0;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">Campus Events Portal</h3>
                <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 14px;">
                  Your gateway to amazing campus experiences
                </p>
            </div>
              
              <div style="border-top: 1px solid #4a5568; padding-top: 20px;">
                <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                  Questions about your application?<br>
                  <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none;">Visit Portal</a> | 
                  <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none;">Contact Support</a>
            </p>
          </div>
        </div>
          </div>
        </body>
        </html>
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
  const subject = '🔐 Password Reset OTP - Campus Events Portal';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        
        <!-- Header with Security Theme -->
        <div style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
          <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px);">
            <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Password Reset Request
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Secure your account with a new password
            </p>
          </div>
      </div>
      
        <!-- OTP Content -->
        <div style="padding: 40px 30px;">
          <!-- Introduction -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
              Reset Your Password
            </h2>
            <div style="width: 60px; height: 3px; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); margin: 15px auto; border-radius: 2px;"></div>
            <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
          You have requested to reset your password. Use the following One-Time Password (OTP) to complete the process:
        </p>
          </div>

          <!-- OTP Code Display -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px; border-radius: 20px; margin-bottom: 30px; border: 2px solid #e53e3e; text-align: center;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(229, 62, 62, 0.1);">
              <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Your Verification Code
              </p>
              <div style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #e53e3e; font-family: 'Courier New', monospace; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${otp}
              </div>
              <p style="margin: 15px 0 0 0; color: #a0aec0; font-size: 12px;">
                Enter this code in the password reset form
              </p>
            </div>
          </div>

          <!-- Security Information -->
          <div style="display: grid; gap: 20px; margin-bottom: 30px;">
            <!-- Expiration Warning -->
            <div style="background-color: #fff5f5; padding: 20px; border-radius: 12px; border-left: 4px solid #e53e3e;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 12px;">⏰</span>
                <h4 style="color: #2d3748; margin: 0; font-size: 16px; font-weight: 600;">Time Sensitive</h4>
              </div>
              <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                <strong>This OTP will expire in 10 minutes.</strong> Please use it promptly to reset your password.
              </p>
        </div>
        
            <!-- Security Notice -->
            <div style="background-color: #f0fff4; padding: 20px; border-radius: 12px; border-left: 4px solid #48bb78;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 12px;">🛡️</span>
                <h4 style="color: #2d3748; margin: 0; font-size: 16px; font-weight: 600;">Security Notice</h4>
              </div>
              <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                If you did not request a password reset, please ignore this email. Your account remains secure.
          </p>
        </div>
        
            <!-- Instructions -->
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #667eea;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 12px;">📝</span>
                <h4 style="color: #2d3748; margin: 0; font-size: 16px; font-weight: 600;">Instructions</h4>
              </div>
              <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                Enter this OTP in the password reset form along with your new password to complete the reset process.
              </p>
            </div>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password" 
               style="display: inline-block; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(229, 62, 62, 0.4);">
              🔑 Reset Password Now
            </a>
          </div>

          <!-- Additional Security Tips -->
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🔒 Security Tips</h4>
            <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Never share your OTP with anyone</li>
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
              <li>Log out from all devices after resetting</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #2d3748; padding: 30px; text-align: center; border-radius: 0;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">Campus Events Portal</h3>
            <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 14px;">
              Keeping your account secure
          </p>
        </div>
        
          <div style="border-top: 1px solid #4a5568; padding-top: 20px;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
              This is an automated security message from Campus Events Portal<br>
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="color: #667eea; text-decoration: none;">Visit Portal</a> | 
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none;">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
    </body>
    </html>
  `;
  return sendEmail(email, subject, html);
};

// Send event notification to faculty coordinators
const sendFacultyEventNotification = async (event) => {
  try {
    // Get student emails from database configuration (these are the emails faculty want notifications sent to)
    const EmailConfiguration = require('../models/EmailConfiguration');
    const config = await EmailConfiguration.findOne({ type: 'student_emails' });
    
    const facultyEmails = config ? config.emails : [];
    
    if (facultyEmails.length === 0) {
      console.log('No faculty notification emails configured');
      return { successful: 0, failed: 0 };
    }
    const transporter = createTransporter();

    

    // Send emails to all faculty coordinators
    const emailPromises = facultyEmails.map(email => {
      return transporter.sendMail({
        ...mailOptions,
        to: email
      }).catch(error => {
        console.error(`Failed to send faculty notification to ${email}:`, error);
        return { error, email };
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    // Log results
    const successful = results.filter(result => result.status === 'fulfilled' && !result.value.error).length;
    const failed = results.filter(result => result.status === 'rejected' || result.value.error).length;
    
    console.log(`Faculty event notification sent: ${successful} successful, ${failed} failed`);
    
    return { successful, failed };
  } catch (error) {
    console.error('Error sending faculty event notifications:', error);
    throw error;
  }
};

module.exports = {
  sendEventNotification,
  sendEmail,
  sendApplicationStatusEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  sendFacultyEventNotification
};
