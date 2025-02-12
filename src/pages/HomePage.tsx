// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';



const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-center">Jaxson Madison's Portfolio</h1>
        </div>
      </header>

      {/* About Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-gray-700 mb-6">
            Hello! I’m Jaxson Madison, a passionate front-end developer with experience in React, TypeScript, and cloud computing with AWS. I enjoy creating innovative solutions and bringing ideas to life through intuitive user interfaces. 
          </p>
          <p className="text-gray-700">
            I am proficient in JavaScript, Python, and familiar with TypeScript and C++. I thrive in collaborative environments and enjoy working on challenging projects that push the boundaries of creativity and technology.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            
            {/* Project 6 */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Spotify Stats App</h3>
                <p className="text-gray-700 mb-4">
                  An app to explore and visualize your top Spotify artists, songs, and playlists. Integrated with the Spotify API for personalized stats.
                </p>
                <Link
                  to="/spotifystats"
                  className="text-green-500 hover:underline"
                >
                  Explore SpotifyStats
                </Link>
              </div>
            </div>
            
            {/* Project 3 */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Hygieia Auto Detailing Website</h3>
                <p className="text-gray-700 mb-4">
                  A website built for Hygieia Auto Detailing to showcase their services and allow customers to book appointments. Developed using React.
                </p>
                <a
                  href="https://hygieiadetailing.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline"
                >
                  Visit Hygieia Detailing
                </a>
              </div>
            </div>

            {/* Project 4 */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">VINCEENGINEERING Website</h3>
                <p className="text-gray-700 mb-4">
                  A website for VINCEENGINEERING, a small electrical engineering business specializing in power, controls, and communications. Developed using React and hosted with AWS Amplify.
                </p>
                <a
                  href="https://main.d2md0oy16cszu7.amplifyapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:underline"
                >
                  Visit VINCEENGINEERING
                </a>
              </div>
            </div>

            {/* Project 5 */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Movie Rating App</h3>
                <p className="text-gray-700 mb-4">
                  An app where users can rate their favorite movies and share lists with friends. A social platform for movie enthusiasts.
                </p>
                <span className="text-gray-500 italic">Coming soon...</span>
              </div>
            </div>

            
            {/* Project 2 */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Elk Hunting Chatbot</h3>
                <p className="text-gray-700 mb-4">
                  An AI-powered chatbot to help hunters get tips and insights on Elk hunting. Integrated with OpenAI's GPT model.
                </p>
                <span className="text-gray-500 italic">Coming soon...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-700 mb-6">
            Interested in working together or have a question? Feel free to reach out to me!
          </p>
          <div className="flex space-x-4">
            <a
              href="mailto:jaxsonj.madison@gmail.com"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/jaxson-madison"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
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
