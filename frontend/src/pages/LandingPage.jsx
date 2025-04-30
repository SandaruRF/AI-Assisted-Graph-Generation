import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-b-2xl shadow">
        <nav className="flex justify-between items-center mb-10">
          <div className="text-2xl font-bold text-blue-600">VizGen</div>
          <div className="space-x-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/chat" className="hover:text-blue-600">Chat</Link>
            <Link to="/docs" className="hover:text-blue-600">Docs</Link>
          </div>
          <div className="space-x-3">
            <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50">Log In</button>
            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Sign Up</button>
          </div>
        </nav>
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-16">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4">AI Assisted <span className="text-blue-600">Graph Generator</span></h1>
            <p className="text-gray-600 mb-6">Transform data into easy-to-understand visuals efficiently with our AI-powered graph generator. Designed for impactful data communication. No design skills needed.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Get Started</button>
          </div>
          <img src="/images/hero-graph.png" alt="Graph Illustration" className="w-full md:w-1/2 mt-10 md:mt-0" />
        </div>
      </header>

      {/* Database Logos */}
      <section className="py-10 text-center">
        <h2 className="text-lg font-semibold">Connect Seamlessly to Your Favorite Databases</h2>
        <div className="flex justify-center flex-wrap gap-6 mt-6 px-4">
          <img src="/images/mysql.png" alt="MySQL" className="h-10" />
          <img src="/images/postgresql.png" alt="PostgreSQL" className="h-10" />
          <img src="/images/mariadb.png" alt="MariaDB" className="h-10" />
          <img src="/images/sqlserver.png" alt="SQL Server" className="h-10" />
          <img src="/images/oracle.png" alt="Oracle" className="h-10" />
          <img src="/images/SQLite.png" alt="SQLite" className="h-10" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <h2 className="text-center text-lg font-semibold mb-8">Transform data into visuals with AI graphs</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="font-bold text-md mb-2">AI Diagram Generator</h3>
            <p className="text-gray-600">Instantly convert your raw data into sleek, interactive graphs. From brainstorming sessions to client presentations, achieve professional results without the hassle of manual creation. All you need are a few simple prompts.</p>
          </div>
          <img src="/images/ai.png" alt="AI Icon" className="h-20 mx-auto" />

          <img src="/images/db-compatibility.png" alt="Database Icon" className="h-20 mx-auto" />
          <div>
            <h3 className="font-bold text-md mb-2">Seamless Multi-Database Compatibility</h3>
            <p className="text-gray-600">Effortlessly connect with SQLite, MySQL, and PostgreSQL for scalable data management. Whether you need fast transactions, local storage, or advanced analytics, our platform adapts to your needs.</p>
          </div>

          <div>
            <h3 className="font-bold text-md mb-2">Fortified Data Protection</h3>
            <p className="text-gray-600">Your data’s security is our top priority! With bank-grade encryption, multi-layer authentication, and proactive threat monitoring, we ensure your information remains safe, private, and uncompromised.</p>
          </div>
          <img src="/images/security.png" alt="Security Icon" className="h-20 mx-auto" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50 text-center px-4">
        <h3 className="text-xl text-gray-600 italic mb-10">How it works</h3>
        <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto">
          <div>
            <img src="/images/work cycle.png" alt="work cycle" className="h-16 mx-auto mb-2" />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-500">
        <div className="mb-6">
          <img src="/images/logo.png" alt="VizGen Logo" className="h-8 mx-auto mb-2" />
          <p>© 2025 VizGen. All rights reserved.</p>
        </div>
        <div className="flex justify-center gap-10 text-xs text-gray-400">
          <div>
            <p className="font-semibold">Features</p>
            <p>Connect DB</p>
            <p>Chat</p>
          </div>
          <div>
            <p className="font-semibold">Guides</p>
            <p>Docs</p>
            <p>FAQs</p>
          </div>
          <div>
            <p className="font-semibold">Company</p>
            <p>About Us</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
