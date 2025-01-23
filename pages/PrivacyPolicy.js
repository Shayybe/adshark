import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-8">PRIVACY POLICY</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: September 2024</p>

        <div className="space-y-6">
          <section>
            <p>Ad Market Limited, here referred to as "AdShark", "Company", "we", etc., commits to compliance with data protection laws. This Privacy Policy outlines our practices for collecting personal data and providing services to Advertisers and Publishers ("You", "Your" etc.), and shares practices for www.adshark.com (the/our "Website", "the Platform").</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What is personal data?</h2>
            <p>Personal data means any information relating to you as an identified or identifiable natural person ("data subject"). This includes information that can identify you directly or indirectly, such as a name, online identifier, or factors specific to your physical, economic, cultural, or social identity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How do we collect and use personal data?</h2>
            <div className="space-y-4">
              <p>We collect personal data when you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sign up on our Website</li>
                <li>Enter into an agreement with us</li>
                <li>Use our services</li>
              </ul>

              <p>We may collect and process:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> Name, username, date of birth, gender</li>
                <li><strong>Contact Data:</strong> Billing address, email address, phone numbers</li>
                <li><strong>Financial Data:</strong> Bank account and payment details</li>
                <li><strong>Technical Data:</strong> IP address, login data, browser type, device information</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                <li><strong>Marketing Data:</strong> Your preferences for receiving marketing from us</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <p>We implement appropriate security measures to protect your personal data from unauthorized access, modification, disclosure, or destruction. While we take reasonable steps to protect your data, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For any questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2">Email: info@adshark.com</p>
            <p>Address: Christaki Kranou 49, Germasogeia, 4041 Limassol, Cyprus</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;