const mongoose = require('mongoose');
require('dotenv').config({ path: 'config.env' });

// Import models
const User = require('./models/User');
const Event = require('./models/Event');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_events', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create faculty users for each department
    const facultyUsers = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'faculty.it@campus.edu',
        password: 'faculty123',
        userType: 'faculty',
        phone: '+1234567890',
        department: 'Information Technology',
        designation: 'Associate Professor'
      },
      {
        name: 'Prof. Michael Chen',
        email: 'faculty.cs@campus.edu',
        password: 'faculty123',
        userType: 'faculty',
        phone: '+1234567891',
        department: 'Computer Science',
        designation: 'Professor'
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'faculty.ec@campus.edu',
        password: 'faculty123',
        userType: 'faculty',
        phone: '+1234567892',
        department: 'Electronics & Communication',
        designation: 'Assistant Professor'
      },
      {
        name: 'Prof. David Thompson',
        email: 'faculty.me@campus.edu',
        password: 'faculty123',
        userType: 'faculty',
        phone: '+1234567893',
        department: 'Mechanical Engineering',
        designation: 'Professor'
      },
      {
        name: 'Dr. Lisa Wang',
        email: 'faculty.bpharm@campus.edu',
        password: 'faculty123',
        userType: 'faculty',
        phone: '+1234567894',
        department: 'BPharm',
        designation: 'Associate Professor'
      }
    ];

    for (const facultyData of facultyUsers) {
      const facultyUser = new User(facultyData);
      await facultyUser.save();
      console.log(`👨‍🏫 Created faculty user for ${facultyData.department}`);
    }

    // Create demo coordinator
    const coordinatorUser = new User({
      name: 'Event Coordinator',
      email: 'coordinator@campus.edu',
      password: 'coordinator123',
      userType: 'coordinator',
      department: 'Computer Science',
      phone: '+1234567895'
    });
    await coordinatorUser.save();
    console.log('👨‍💼 Created demo coordinator');

    // Create demo student
    const studentUser = new User({
      name: 'Demo Student',
      email: 'student@campus.edu',
      password: 'student123',
      userType: 'student',
      department: 'Computer Science',
      phone: '+1234567896',
      studentId: 'CS2024001',
      year: 2
    });
    await studentUser.save();
    console.log('👨‍🎓 Created demo student');

    // Create sample events for the coordinator
    const sampleEvents = [
      {
        title: "Tech Innovation Workshop",
        description: "A comprehensive workshop on the latest technology trends and innovations. Learn about AI, blockchain, and IoT from industry experts.",
        shortDescription: "Learn about cutting-edge technology trends from industry experts",
        category: "Technical",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        venue: "Computer Science Auditorium",
        maxParticipants: 100,
        isTeamEvent: false,
        entryFee: 0,
        prizes: "Certificate of Participation and Workshop Kit",
        requirements: "Basic knowledge of programming concepts",
        coordinator: coordinatorUser._id,
        tags: ["technology", "workshop", "AI", "blockchain"],
        isActive: true
      },
      {
        title: "Annual Coding Competition",
        description: "Test your programming skills in this exciting coding competition. Solve challenging problems and compete with peers for amazing prizes.",
        shortDescription: "Annual coding competition with exciting challenges and prizes",
        category: "Technical",
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hours later
        registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        venue: "Computer Lab Block A",
        maxParticipants: 50,
        isTeamEvent: true,
        teamSize: 3,
        entryFee: 100,
        prizes: "1st: ₹10,000, 2nd: ₹5,000, 3rd: ₹2,500",
        requirements: "Team of 3 members, knowledge of any programming language",
        coordinator: coordinatorUser._id,
        tags: ["coding", "competition", "programming"],
        isActive: true
      },
      {
        title: "Cultural Night 2024",
        description: "Join us for an evening of cultural performances, music, dance, and entertainment. Showcase your talents and enjoy performances by fellow students.",
        shortDescription: "Evening of cultural performances, music, and dance",
        category: "Cultural",
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 5 hours later
        registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        venue: "Main Auditorium",
        maxParticipants: 200,
        isTeamEvent: false,
        entryFee: 50,
        prizes: "Best Performance Awards and Participation Certificates",
        requirements: "Open to all students",
        coordinator: coordinatorUser._id,
        tags: ["cultural", "music", "dance", "entertainment"],
        isActive: true
      }
    ];

    for (const eventData of sampleEvents) {
      const event = new Event(eventData);
      await event.save();
    }
    console.log('🎉 Created sample events');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('👨‍🏫 IT Faculty: faculty.it@campus.edu / faculty123');
    console.log('👨‍🏫 CS Faculty: faculty.cs@campus.edu / faculty123');
    console.log('👨‍🏫 EC Faculty: faculty.ec@campus.edu / faculty123');
    console.log('👨‍🏫 ME Faculty: faculty.me@campus.edu / faculty123');
    console.log('👨‍🏫 BPharm Faculty: faculty.bpharm@campus.edu / faculty123');
    console.log('👨‍💼 Coordinator: coordinator@campus.edu / coordinator123');
    console.log('👨‍🎓 Student: student@campus.edu / student123');
    console.log('\n🔑 Admin Password for rejections: Admin@123');
    console.log('\n🚀 You can now start the application and test the features!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
seedData();
