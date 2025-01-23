import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-8">TERMS OF SERVICE</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: September 2024</p>

        <div className="space-y-6">
          <section>
            <p className="font-semibold">PLEASE READ THESE TERMS OF SERVICE CAREFULLY. BY CLICKING TO ACCEPT WHEN SIGNING UP OR WHEN REQUESTED, YOUR USE OF OUR SERVICES IS SUBJECT TO THESE TERMS, OUR PRIVACY POLICY, COOKIES POLICY (TOGETHER THE "TERMS" OR THE "AGREEMENT").</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Parties to the Agreement</h2>
            <p>Ad Market Limited ("AdShark") is a company incorporated and registered in Cyprus under registration number HE361574, having its registered office address at Christaki Kranou 49, Germasogeia, 4041 Limassol, Cyprus.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
            <div className="space-y-4">
              <p>To use our Services, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Register and create an account</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Advertising</h2>
            <p>Advertisers can use our Services to advertise their goods and services by uploading Advertising Materials on the Platform. All content must comply with our content guidelines and applicable laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Payments</h2>
            <div className="space-y-4">
              <p>Initial funding requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Minimum initial deposit: $100.00</li>
                <li>Accounts with zero balance will be paused</li>
                <li>Payments must be made from verified sources</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>AdShark retains all rights to the platform and services. Users are granted a limited license to use the services as outlined in these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts for violations of these terms or for any other reason at our discretion. Users may terminate their account with two days' notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>AdShark's liability is limited to the amount paid by you for services in the last three months. We are not liable for indirect or consequential damages.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p className="mt-2">Email: info@adshark.com</p>
            <p>Address: Christaki Kranou 49, Germasogeia, 4041 Limassol, Cyprus</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;