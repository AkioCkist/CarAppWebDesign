export const metadata = {
  title: 'Terms of Service - Whale Xe',
  description: 'The terms and conditions for using Whale Xe services.',
};

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: April 5, 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Whale Xe, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
        <p>
          You must be at least 18 years old and have the legal capacity to enter into a contract to use Whale Xe. You agree to provide accurate information and comply with all applicable laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Prohibited Conduct</h2>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Do not use Whale Xe for unlawful purposes.</li>
          <li>Do not attempt to gain unauthorized access to our systems.</li>
          <li>Do not misuse or abuse our services.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to Whale Xe at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
        <p>
          Whale Xe is provided "as is" and we make no warranties regarding the reliability or availability of our services. We are not liable for any damages arising from your use of Whale Xe.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use of Whale Xe after changes means you accept the new terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
        <ul className="mt-2 list-none ml-0 space-y-1">
          <li>📧 Email: <a href="mailto:contact@whalexe.com" className="text-blue-600 underline">contact@whalexe.com</a></li>
          <li>📞 Phone: <a href="tel:+8402363738399" className="text-blue-600 underline">+84 0236 3738 399</a></li>
          <li>🏢 Address: 158a Lê Lợi, Hải Châu 1, Hải Châu, Đà Nẵng</li>
          <li>🌐 Website: <a href="https://whalexe.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://whalexe.com</a></li>
        </ul>
      </section>

      <p className="text-center text-gray-600 text-sm mt-8">
        Thank you for choosing Whale Xe. We are committed to providing a safe and reliable service.
      </p>
    </div>
  );
}