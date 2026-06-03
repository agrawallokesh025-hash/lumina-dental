// Pluggable SMS architecture for OTP
// Can be seamlessly swapped with Twilio, MSG91, etc., in production.

const sendSMS = async (phone, message) => {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement Twilio/MSG91 integration here
    console.log(`[PROD SMS to ${phone}]: ${message}`);
  } else {
    // Development Mode - Log to console for testing
    console.log(`\n================ OTP ================`);
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log(`=====================================\n`);
  }
};

module.exports = { sendSMS };
