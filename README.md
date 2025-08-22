# Campus Events Portal

A comprehensive MERN stack application for managing campus events, student applications, and faculty coordination.

## Features

### 🎯 Core Functionality
- **Event Management**: Create, view, and manage campus events
- **Student Applications**: Students can apply for events with team information
- **Role-based Access**: Different dashboards for students, coordinators, and faculty
- **Email Notifications**: Automatic email notifications when events are posted
- **Protected Routes**: Secure access control based on user roles

### 👥 User Roles

#### Students
- Register and login to the system
- Browse available events
- Apply for events with team information
- Track application status
- View past participations

#### Coordinators
- Register as event coordinators
- Create and manage events
- Upload event details and requirements
- Track participant applications
- Manage event information

#### Faculty Coordinators
- Pre-configured login (no registration required)
- Monitor all campus events
- Track student participation statistics
- Manage user accounts and notifications
- View comprehensive analytics

### 🚀 Technical Features
- **MERN Stack**: MongoDB, Express.js, React.js, Node.js
- **JWT Authentication**: Secure token-based authentication
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Updates**: Live data updates and notifications
- **Email Integration**: Nodemailer for automated communications

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CampusConnect2.0
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/campus_events
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
NODE_ENV=development
```

**Note**: For Gmail, you'll need to use an App Password instead of your regular password.

### 5. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections and indexes.

## Running the Application

### Development Mode

#### Option 1: Run Backend and Frontend Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

#### Option 2: Run Both Simultaneously
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/faculty-login` - Faculty login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (coordinator/faculty)
- `PUT /api/events/:id` - Update event (coordinator/faculty)
- `DELETE /api/events/:id` - Delete event (coordinator/faculty)

### Applications
- `POST /api/applications` - Submit application (student)
- `GET /api/applications/student/my-applications` - Get student applications
- `GET /api/applications/event/:eventId` - Get event applications
- `PUT /api/applications/:id/status` - Update application status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/students` - Get all students (faculty)
- `GET /api/users/coordinators` - Get all coordinators (faculty)

## Project Structure

```
CampusConnect2.0/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── pages/         # Page components
│   │   │   └── routing/       # Routing components
│   │   ├── contexts/          # React contexts
│   │   └── index.js           # Main entry point
│   └── package.json
├── models/                     # Mongoose models
├── routes/                     # API routes
├── middleware/                 # Custom middleware
├── utils/                      # Utility functions
├── server.js                   # Express server
├── package.json
└── .env
```

## Database Models

### User
- Basic info (name, email, password)
- User type (student, coordinator, faculty)
- Student-specific fields (studentId, department, year)
- Coordinator-specific fields (department, contactNumber)

### Event
- Event details (title, description, dates, venue)
- Registration requirements
- Coordinator reference
- Participant limits

### Application
- Student and event references
- Team information
- Application status
- Submission details

### Notification
- Event notifications
- Recipient tracking
- Delivery status

## Email Notifications

The system automatically sends email notifications to students when new events are posted. The email list is currently configured with demo emails but can be updated by faculty coordinators.

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role-based Authorization**: Middleware for access control
- **Input Validation**: Express-validator for data validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- [ ] Real-time chat system for event coordination
- [ ] File upload for event materials
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Integration with calendar systems
- [ ] Social media sharing
- [ ] QR code generation for event check-ins
- [ ] Advanced notification preferences
- [ ] Event templates and cloning
- [ ] Multi-language support

---

**Built with ❤️ using the MERN Stack**
