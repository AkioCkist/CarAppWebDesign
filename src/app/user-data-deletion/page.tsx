export const metadata = {
  title: 'User Data Deletion - Whale Xe',
  description: 'How to request deletion of your personal data from Whale Xe.',
};

export default function UserDataDeletion() {
  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">User Data Deletion</h1>
      <p className="mb-6 text-gray-600">
        At Whale Xe, we respect your privacy and provide you with the ability to request deletion of your personal data at any time.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">How to Request Data Deletion</h2>
        <p>
          If you would like to delete your account and all associated personal data from Whale Xe, please contact us using one of the methods below:
        </p>
        <ul className="mt-2 list-none ml-0 space-y-1">
          <li>📧 Email: <a href="mailto:contact@whalexe.com" className="text-blue-600 underline">contact@whalexe.com</a></li>
          <li>📞 Phone: <a href="tel:+8402363738399" className="text-blue-600 underline">+84 0236 3738 399</a></li>
        </ul>
        <p className="mt-2">
          Please include your account information (such as your registered email address or phone number) so we can verify your identity and process your request promptly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">What Happens Next?</h2>
        <p>
          Once we receive your request, we will:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Verify your identity to protect your privacy</li>
          <li>Delete your account and all associated personal data from our systems, unless retention is required by law</li>
          <li>Notify you once the deletion process is complete</li>
        </ul>
      </section>

      <p className="text-center text-gray-600 text-sm mt-8">
        If you have any questions about this process, please contact us at <a href="mailto:contact@whalexe.com" className="text-blue-600 underline">contact@whalexe.com</a>.
      </p>
    </div>
  );
}