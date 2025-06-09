export default function VerificationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Verification</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Verification Instructions</h2>
          <p className="text-gray-700">
            To verify your profile, please follow these steps:
          </p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            <li>Check your email for a verification link. Click the link to confirm your email address.</li>
            <li>If required, upload a clear photo of your identification document (e.g., Passport, Driver's License).</li>
          </ul>
        </div>

        {/* Document Upload Section - Conditional based on requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Document (If Required)</h2>
          <form className="space-y-4 p-6 border border-gray-200 rounded-md">
            <div>
              <label className="block text-sm font-medium" htmlFor="documentType">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Document Type</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="documentUpload">
                Upload File
              </label>
              <input
                type="file"
                id="documentUpload"
                name="documentUpload"
                className="mt-1 block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100"
              />
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF up to 10MB.</p>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload and Submit for Verification
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            If you have any questions, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
