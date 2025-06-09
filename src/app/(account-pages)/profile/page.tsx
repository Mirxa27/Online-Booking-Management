import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              {/* Placeholder for profile photo */}
              <div className="w-32 h-32 bg-gray-200 rounded-full mb-2"></div>
              <button className="text-sm text-indigo-600 hover:text-indigo-500">
                Change Photo
              </button>
              <input type="file" className="hidden" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Verification Status</h2>
              <p className="text-gray-600">Not Verified</p> {/* Example status */}
              <Link href="/profile/verify">
                <button className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Verify Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled // Email likely pre-filled and not editable directly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="language">
                Language Preferences
              </label>
              <select
                id="language"
                name="language"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                {/* Add more languages as needed */}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
