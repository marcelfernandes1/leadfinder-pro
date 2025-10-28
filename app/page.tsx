/**
 * Home Page
 *
 * Landing page for LeadFinder Pro
 * Will be replaced with marketing page or redirect to dashboard after auth is implemented
 */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">LeadFinder Pro</h1>
        <p className="text-xl text-gray-600">
          Discover qualified local business leads with contact info and buying probability scores
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Project initialized successfully! 🚀
          </p>
        </div>
      </div>
    </main>
  );
}
