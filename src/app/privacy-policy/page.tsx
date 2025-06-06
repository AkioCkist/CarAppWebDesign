// app/privacy-policy/page.tsx

export const metadata = {
  title: 'Privacy Policy - Your App Name',
  description: 'Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: April 5, 2025</p>

      <section className="mb-6">
        <p>Welcome to [Your App/Website Name] (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your privacy and ensuring you understand how we collect, use, and share your personal information. This Privacy Policy applies to our website, mobile application, or service that integrates Facebook Login via Facebook’s OAuth system.</p>
        <p>By using our service, you agree to the terms of this Privacy Policy.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p>When you log in to [Your App/Website Name] using Facebook Login, we may collect the following information from your Facebook profile:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Your name</li>
          <li>Email address</li>
          <li>Public profile (e.g., profile picture, gender, age range)</li>
          <li>Any other information you have made publicly available or authorized through Facebook’s OAuth permissions</li>
        </ul>
        <p>This information is obtained through Facebook’s OAuth API after you give consent during the login process.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p>We use the information collected through Facebook Login to:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Authenticate and create or manage your account</li>
          <li>Personalize your experience</li>
          <li>Improve our service and features</li>
          <li>Communicate with you (e.g., send updates or respond to inquiries)</li>
          <li>Prevent fraud and ensure security</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data Retention</h2>
        <p>We retain your personal information only as long as necessary to provide you with our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>
        <p>If you request deletion of your account, we will remove your data unless legally obligated to retain it.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Third Parties and Facebook</h2>
        <p>We use Facebook Login via Facebook’s OAuth system to simplify the sign-in process. Facebook collects and processes data according to its own <a href="https://www.facebook.com/privacy/explanation"  className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. We do not control Facebook’s data practices, so we encourage you to review their policies.</p>
        <p>We may also use third-party services (such as analytics tools or advertising platforms), which may have their own privacy policies.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Security</h2>
        <p>We take reasonable steps to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Children’s Privacy</h2>
        <p>Our service is not directed toward individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will delete it promptly.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email or prominent notice on our site. Continued use of our service after any changes indicates your acceptance of the updated policy.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
        <p>If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
        <ul className="mt-2 list-none ml-0 space-y-1">
          <li>📧 Email: <a href="mailto:your-contact-email@example.com" className="text-blue-600 underline">your-contact-email@example.com</a></li>
          <li>🌐 Website: <a href="https://yourwebsite.com"  className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://yourwebsite.com</a></li> 
        </ul>
      </section>

      <p className="text-center text-gray-600 text-sm mt-8">
        Thank you for trusting [Your App/Website Name]. We value your privacy and strive to be transparent about how we handle your data.
      </p>
    </div>
  );
}