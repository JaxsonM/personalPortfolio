import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className={`font-semibold tracking-tight text-lg cursor-pointer transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`} onClick={() => scrollTo('hero')}>
            JM
          </span>
          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center gap-8 text-sm transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-300'}`}>
            {['about', 'projects', 'building', 'skills', 'certifications', 'contact'].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className={`capitalize transition-colors ${scrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}>
                {s === 'building' ? "What I'm Building" : s}
              </button>
            ))}
            <a href="https://github.com/jaxsonmadison" target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors ${scrolled ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
          {/* Mobile hamburger */}
          <button className={`md:hidden transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`} onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm text-gray-700">
            {['about', 'projects', 'building', 'skills', 'certifications', 'contact'].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className="text-left capitalize hover:text-gray-900">
                {s === 'building' ? "What I'm Building" : s}
              </button>
            ))}
            <a href="https://github.com/jaxsonmadison" target="_blank" rel="noopener noreferrer" className="text-left hover:text-gray-900">
              GitHub
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-gray-950 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-600/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            <img
  src="/jaxson.jpg"
  alt="Jaxson Madison"
  className="w-40 h-40 md:w-52 md:h-52 rounded-2xl object-cover object-top"
/>
          </div>
          {/* Hero text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">Cloud & DevOps Engineer</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Jaxson<br />Madison
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-8">
              Building infrastructure that scales. I work across Windows Server administration, VMware virtualization, and cloud automation — with a home lab to match.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button onClick={() => scrollTo('projects')}
                className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                View Projects
              </button>
              <button onClick={() => scrollTo('contact')}
                className="border border-gray-600 text-gray-300 px-6 py-2.5 rounded-full text-sm font-medium hover:border-gray-400 hover:text-white transition-colors">
                Get in Touch
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">About</p>
          <h2 className="text-3xl font-bold mb-10">Who I am</h2>
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-gray-200">
            {[
              { value: '2+', label: 'Years in enterprise IT' },
              { value: '2', label: 'AWS certifications' },
              { value: '24x7', label: 'Global ops experience' },
              { value: '6', label: 'Home lab phases' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Cloud and DevOps enthusiast with a background in IT support, software development, and AWS. I thrive on solving infrastructure challenges, automating workflows, and helping teams move faster and more reliably.
            </p>
            <p>
              Currently at Conduent as a Windows Server Administrator, working in a 24x7 Global Command Center focused on monitoring, alerting, and VMware virtualization. Previously at Morgan Stanley supporting enterprise technical operations for global teams.
            </p>
            <p>
              I hold a BS in Computer Science from Utah State University and an AWS Certified Cloud Practitioner credential, with AWS SysOps Associate in progress.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">Projects</p>
          <h2 className="text-3xl font-bold mb-12">What I've shipped</h2>

          {/* Featured project card */}
          <div className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full mb-4">Featured Project</span>
              <h3 className="text-2xl font-semibold mb-3">Spotify Stats App</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Visualize your top Spotify artists, songs, and playlists with secure OAuth 2.0 authentication and AWS-backed API integrations. Built with React, TypeScript, and deployed via AWS Amplify.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React', 'TypeScript', 'AWS Lambda', 'Spotify API', 'OAuth 2.0', 'AWS Amplify'].map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
                ))}
              </div>
              <Link to="/spotifystats" className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
                Explore project →
              </Link>
            </div>
            {/* Visual panel */}
            <div className="md:w-56 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 flex items-center justify-center min-h-40">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#1DB954" opacity="0.8">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* WHAT I'M BUILDING */}
      <section id="building" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">What I'm Building</p>
          <h2 className="text-3xl font-bold mb-4">Home Lab & Infrastructure</h2>
          <p className="text-gray-500 mb-12 max-w-xl">
            A Proxmox-based home lab I'm building out as a real-world DevOps environment — from AD foundations to Kubernetes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {[
              { phase: '01', title: 'AD & Windows Foundation', desc: 'Active Directory, DNS, Group Policy, Windows Server 2022 VMs on Proxmox.', status: 'In Progress', color: 'blue' },
              { phase: '02', title: 'Monitoring & Observability', desc: 'Zabbix and Grafana dashboards for infrastructure visibility across the lab.', status: 'Up Next', color: 'gray' },
              { phase: '03', title: 'Linux Admin & Scripting', desc: 'Deepening Linux administration and automation with Bash and Python.', status: 'Planned', color: 'gray' },
              { phase: '04', title: 'CI/CD Pipelines', desc: 'GitHub Actions workflows for automated testing and deployment.', status: 'Planned', color: 'gray' },
              { phase: '05', title: 'Infrastructure as Code', desc: 'Terraform and Ansible for reproducible, version-controlled infrastructure.', status: 'Planned', color: 'gray' },
              { phase: '06', title: 'Containers & Kubernetes', desc: 'k3s cluster deployment, containerized workloads, and Helm charts.', status: 'Planned', color: 'gray' },
            ].map(({ phase, title, desc, status, color }) => (
              <div key={phase} className="flex gap-4 border border-gray-200 bg-white rounded-2xl p-5">
                <span className={`text-xs font-mono font-bold mt-0.5 ${color === 'blue' ? 'text-blue-500' : 'text-gray-300'}`}>{phase}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                      status === 'Up Next' ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>{status}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">Skills</p>
          <h2 className="text-3xl font-bold mb-12">Toolkit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                category: 'Infrastructure',
                items: ['Windows Server', 'VMware vSphere', 'Active Directory', 'Proxmox', 'Linux'],
              },
              {
                category: 'Cloud & IaC',
                items: ['AWS (EC2, S3, IAM, Lambda)', 'Terraform', 'Ansible', 'GitHub Actions', 'CloudWatch'],
              },
              {
                category: 'Scripting & Dev',
                items: ['PowerShell', 'Bash', 'Python', 'TypeScript', 'React'],
              },
              {
                category: 'Monitoring & Ops',
                items: ['Zabbix', 'Grafana', 'ServiceNow', 'Citrix', 'Intune'],
              },
              {
                category: 'Identity & Security',
                items: ['Entra ID / Azure AD', 'SailPoint', 'Microsoft 365', 'Group Policy', 'RBAC'],
              },
              {
                category: 'Tools',
                items: ['Git', 'Docker', 'VS Code', 'RamMap / Sysinternals', 'Jira'],
              },
            ].map(({ category, items }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span key={item} className="text-sm text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">Certifications</p>
          <h2 className="text-3xl font-bold mb-12">Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="border border-gray-200 bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-medium">Earned</span>
              </div>
              <h3 className="font-semibold mb-1">AWS Certified Cloud Practitioner</h3>
              <p className="text-sm text-gray-500">Amazon Web Services</p>
            </div>

            <div className="border border-gray-200 bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">In Progress</span>
              </div>
              <h3 className="font-semibold mb-1">AWS SysOps Administrator Associate</h3>
              <p className="text-sm text-gray-500">Amazon Web Services</p>
            </div>

            <div className="border border-dashed border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-36">
              <span className="text-gray-300 text-3xl mb-2">+</span>
              <p className="text-sm text-gray-400">More on the way</p>
              <p className="text-xs text-gray-300 mt-1">Terraform Associate · Network+</p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">Contact</p>
          <h2 className="text-3xl font-bold mb-4">Let's connect</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Open to infrastructure, DevOps, and cloud engineering roles. Always happy to talk shop.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <a href="mailto:jaxsonj.madison@gmail.com"
              className="bg-gray-900 text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
              Email Me
            </a>
            <a href="https://www.linkedin.com/in/jaxson-madison" target="_blank" rel="noopener noreferrer"
              className="border border-gray-300 text-gray-700 px-7 py-3 rounded-full text-sm font-medium hover:border-gray-500 transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com/jaxsonmadison" target="_blank" rel="noopener noreferrer"
              className="border border-gray-300 text-gray-700 px-7 py-3 rounded-full text-sm font-medium hover:border-gray-500 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-2">
          <span>&copy; {new Date().getFullYear()} Jaxson Madison</span>
          <span>Built with React · Hosted on AWS Amplify</span>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;