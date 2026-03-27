import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-extrabold text-2xl text-blue-800 tracking-tight">
          Raj Gharona
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold">
            Login
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition shadow-sm">
            Partner With Us
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-blue-50 py-20 px-4 text-center border-b border-blue-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Premium Flour, Pulses & FMCG for your Business.
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Based in Jatani, Raj Gharona Enterprises is your trusted B2B and D2C partner. Get custom wholesale pricing, credit facilities, and direct delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              Apply for Wholesale Account
            </Link>
            <Link href="/login" className="bg-white text-blue-600 text-lg px-8 py-4 rounded-lg font-bold hover:bg-blue-50 border-2 border-blue-600 transition">
              Partner Login
            </Link>
          </div>
        </div>
      </header>

      {/* PRODUCT CATEGORIES SECTION */}
      <section className="py-16 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">What We Supply</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold mb-2">Premium Flour</h3>
            <p className="text-gray-500">High-quality Chakki Atta and specialty flours for retail, HORECA, and Roti Factories.</p>
          </div>

          {/* Category 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-5xl mb-4">🥣</div>
            <h3 className="text-2xl font-bold mb-2">Quality Pulses</h3>
            <p className="text-gray-500">A wide variety of clean, graded, and unpolished dals sourced directly from top farms.</p>
          </div>

          {/* Category 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">FMCG Goods</h3>
            <p className="text-gray-500">Everyday household essentials, oils, and packaged goods at unbeatable distribution prices.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white py-16 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">The Raj Gharona Advantage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-bold text-lg text-blue-700 mb-2">1. Smart Pricing</h4>
              <p className="text-gray-600 text-sm">Prices automatically adjust based on your volume tier (L1, L2, L3) and business type.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-blue-700 mb-2">2. Digital Ledger</h4>
              <p className="text-gray-600 text-sm">No more messy notebooks. Track your credit limit, dues, and order history entirely online.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-blue-700 mb-2">3. Instant Support</h4>
              <p className="text-gray-600 text-sm">Direct WhatsApp integration for immediate order tracking, queries, and payment updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="mb-2">© 2026 Raj Gharona Enterprises. All rights reserved.</p>
        <p className="text-sm">Proudly serving Jatani and surrounding regions.</p>
      </footer>

    </div>
  );
}