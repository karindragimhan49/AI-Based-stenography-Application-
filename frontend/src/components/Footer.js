// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} StegaCrypt. A Project by Ashen Wimukthi.</p>
        <p>Built with Next.js, Tailwind CSS, and Python Flask.</p>
      </div>
    </footer>
  );
}