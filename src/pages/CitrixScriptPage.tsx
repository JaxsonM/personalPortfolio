// src/pages/CitrixScriptPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const CitrixScriptPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold">Citrix Workspace Automation Script</h1>
          <p className="text-gray-600 mt-2">Automate installation and clean-up of Citrix Workspace on Windows</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-8">
        {/* Overview Section */}
        <section id="overview">
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700">
            This script simplifies deployment of the latest Citrix Workspace plugin by automatically performing a clean install. It handles:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Uninstalling any previous Citrix Workspace installs</li>
            <li>Running the installer with the <code>/clean</code> option</li>
            <li>Suppressing extra add-ins for a smooth upgrade</li>
          </ul>
        </section>

        {/* Prerequisites Section */}
        <section id="prerequisites">
          <h2 className="text-2xl font-semibold mb-2">Prerequisites</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Windows 10 or later with admin privileges</li>
            <li>PowerShell 5.1 or newer</li>
            <li>Internet connection to download the installer</li>
          </ul>
        </section>

        {/* Download Section */}
        <section id="download">
          <h2 className="text-2xl font-semibold mb-2">Download Script</h2>
          <p className="text-gray-700 mb-4">
            Click the button below to download the PowerShell script file.
          </p>
          <a
            href="/scripts/install-citrix-workspace.ps1"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            download
          >
            Download install-citrix-workspace.ps1
          </a>
        </section>

        {/* Usage Instructions Section */}
        <section id="usage">
          <h2 className="text-2xl font-semibold mb-2">Usage Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            <li>Open PowerShell as Administrator.</li>
            <li>Navigate to the folder where the script is saved.</li>
            <li>Run <code>.<wbr/>\install-citrix-workspace.ps1</code> to start the automated install.</li>
          </ol>
        </section>

        {/* Troubleshooting Section */}
        <section id="troubleshooting">
          <h2 className="text-2xl font-semibold mb-2">Troubleshooting</h2>
          <p className="text-gray-700">
            If you encounter errors, ensure all instances of Citrix Workspace are closed and rerun the script. Check the log file at <code>C:\Temp\CitrixInstall.log</code> for details.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow mt-8">
        <div className="container mx-auto p-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Jaxson Madison. All rights reserved.</p>
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default CitrixScriptPage;
