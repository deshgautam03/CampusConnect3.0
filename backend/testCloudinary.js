const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: 'config.env' });

const testCloudinary = async () => {
  try {
    console.log('🔧 Testing Cloudinary Configuration...');
    console.log('=====================================');
    
    // Check environment variables
    console.log('\n1️⃣ Checking Environment Variables...');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'NOT SET');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' : 'NOT SET');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('❌ Cloudinary environment variables are not set!');
      console.log('Please update your config.env file with your Cloudinary credentials.');
      return;
    }
    
    // Configure Cloudinary
    console.log('\n2️⃣ Configuring Cloudinary...');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('✅ Cloudinary configured successfully');
    
    // Test connection
    console.log('\n3️⃣ Testing Cloudinary Connection...');
    try {
      const result = await cloudinary.api.ping();
      console.log('✅ Cloudinary connection successful!');
      console.log('Response:', result);
    } catch (error) {
      console.log('❌ Cloudinary connection failed:', error.message);
      return;
    }
    
    // Test upload (using a simple test image)
    console.log('\n4️⃣ Testing Image Upload...');
    try {
      // Create a simple test image data URL
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      const uploadResult = await cloudinary.uploader.upload(testImageData, {
        folder: 'campus-events-portal/test',
        public_id: 'test-upload-' + Date.now(),
        overwrite: true
      });
      
      console.log('✅ Test image uploaded successfully!');
      console.log('Public ID:', uploadResult.public_id);
      console.log('Secure URL:', uploadResult.secure_url);
      
      // Test deletion
      console.log('\n5️⃣ Testing Image Deletion...');
      const deleteResult = await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log('✅ Test image deleted successfully!');
      console.log('Delete result:', deleteResult);
      
    } catch (error) {
      console.log('❌ Image upload test failed:', error.message);
    }
    
    console.log('\n🎉 Cloudinary integration test completed!');
    console.log('Your Cloudinary setup is ready to use.');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
  }
};

testCloudinary();
