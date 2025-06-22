import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-4xl font-bold">Jaxson Madison's Portfolio</h1>
          <p className="mt-2 text-gray-600">Building sleek front-end interfaces and scalable cloud back-ends.</p>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="bg-white py-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-semibold mb-6">About Me</h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              Cloud and DevOps enthusiast with a background in IT support, software development, and AWS. I thrive on solving infrastructure challenges, automating workflows, and helping teams move faster and more reliably.
            </p>
            <p>
              Currently at Morgan Stanley providing enterprise technical support—troubleshooting hardware, software, and applications like Microsoft&nbsp;365, Intune, Citrix, Active Directory, and ServiceNow for global teams.
            </p>
            <p>In my toolkit:</p>
            <ul className="list-disc list-inside">
              <li>Scripting: Bash, PowerShell, Python</li>
              <li>AWS: EC2, S3, IAM, Lambda</li>
              <li>DevOps: Terraform, GitHub Actions</li>
            </ul>
            <p>
              My goal is to transition into a Cloud/DevOps Engineer role where I can architect, automate, and scale reliable infrastructure. I bring a strong technical foundation, real-world experience, and a commitment to continuous learning.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Spotify Stats App */}
            <div className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Spotify Stats App</h3>
                <p className="text-gray-700 mb-4">
                  Explore and visualize your top Spotify artists, songs, and playlists with secure AWS-backed API integrations.
                </p>
                <Link to="/spotifystats" className="inline-block text-green-500 hover:underline">
                  Explore SpotifyStats →
                </Link>
              </div>
            </div>

            {/* Hygieia Auto Detailing Website */}
            {/* <div className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Hygieia Auto Detailing</h3>
                <p className="text-gray-700 mb-4">
                  A React-based site for Hygieia Auto Detailing with booking and service showcase features.
                </p>
                <a
                  href="https://hygieiadetailing.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-red-500 hover:underline"
                >
                  Visit Site →
                </a>
              </div>
            </div> */}

            {/* VINCEENGINEERING Website */}
            {/* <div className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">VINCEENGINEERING</h3>
                <p className="text-gray-700 mb-4">
                  React site for a power, controls, and communications engineering firm, hosted on AWS Amplify.
                </p>
                <a
                  href="https://main.d2md0oy16cszu7.amplifyapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-purple-500 hover:underline"
                >
                  Visit Site →
                </a>
              </div>
            </div> */}

          </div>
        </div>
      </section>

            {/* Skills Section */}
            <section id="skills" className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-700">
            <span className="px-4 py-2 border rounded">JavaScript</span>
            <span className="px-4 py-2 border rounded">TypeScript</span>
            <span className="px-4 py-2 border rounded">Python</span>
            <span className="px-4 py-2 border rounded">C++</span>
            <span className="px-4 py-2 border rounded">AWS</span>
            <span className="px-4 py-2 border rounded">React</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-700 mb-6">
            Interested in working together or have a question? Feel free to reach out!
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:jaxsonj.madison@gmail.com"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/jaxson-madison"
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Jaxson Madison. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
