import React, { useState, useEffect } from 'react';

const statusStyles: Record<string, { badge: string; number: string }> = {
  Complete: { badge: 'bg-green-50 text-green-600', number: 'text-green-500' },
  'In Progress': { badge: 'bg-blue-50 text-blue-600', number: 'text-blue-500' },
  'Up Next': { badge: 'bg-amber-50 text-amber-600', number: 'text-amber-500' },
  Planned: { badge: 'bg-gray-100 text-gray-400', number: 'text-gray-300' },
};

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
            <a href="https://github.com/JaxsonM" target="_blank" rel="noopener noreferrer"
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
            <a href="https://github.com/JaxsonM" target="_blank" rel="noopener noreferrer" className="text-left hover:text-gray-900">
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
            <p className="text-sm font-medium text-blue-400 tracking-wide leading-relaxed mb-4 max-w-xl">
              Systems Administrator | Windows Server, VMware & Azure | Scripting & Infrastructure Automation | AWS Certified
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Jaxson<br />Madison
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-8">
              I keep Windows and VMware infrastructure healthy in a 24x7 enterprise environment, and I'm building toward Azure and infrastructure automation through a hands-on home lab.
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
              { value: '2+', label: 'Years in IT' },
              { value: '1', label: 'Cloud certification' },
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
              I'm a systems administrator with a background in IT support, building toward cloud infrastructure. Outside of work I run a Proxmox home lab where I practice the skills I want to grow: Active Directory, networking, self-hosted services, and automation.
            </p>
            <p>
              Since March 2026 I've been a Windows Server Administrator at Conduent, working in a 24x7 Global Command Center. I monitor and remediate servers, work with VMware and Active Directory, and join Major Incident bridges. Before that I was at Morgan Stanley, first on the service desk and then as an Advisory Pod technician supporting about 3,000 VIP and executive users.
            </p>
            <p>
              I hold a BS in Computer Science from Utah State University and the AWS Certified Cloud Practitioner certification, and I'm working toward Microsoft Certified: Azure Administrator Associate (AZ-104).
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">Projects</p>
          <h2 className="text-3xl font-bold mb-12">What I've built</h2>

          {/* Featured project card */}
          <div className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-4">Featured Project</span>
              <h3 className="text-2xl font-semibold mb-3">Proxmox Home Lab and Secure Remote Access</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                A repurposed gaming PC running Proxmox VE 9 that hosts my lab and self-hosted services. Two network bridges keep the Windows lab on its own isolated network, and remote access goes through Cloudflare Tunnel behind Cloudflare Access instead of a VPN or open inbound ports.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Proxmox VE', 'LXC', 'LVM-thin', 'Linux bridges', 'iptables NAT', 'Cloudflare Tunnel', 'Cloudflare Access'].map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
                ))}
              </div>
            </div>
            {/* Visual panel */}
            <div className="md:w-56 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center min-h-40">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                <rect x="3" y="3" width="18" height="7" rx="1.5" />
                <rect x="3" y="14" width="18" height="7" rx="1.5" />
                <path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" />
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
            A Proxmox home lab I use to practice real infrastructure work, from secure remote access and self-hosted services to Active Directory, networking, and automation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {[
              { phase: '01', title: 'Proxmox host and secure remote access', desc: 'Proxmox VE 9 on a repurposed gaming PC, with remote access through Cloudflare Tunnel behind Cloudflare Access.', status: 'Complete' },
              { phase: '02', title: 'Self-hosted services', desc: 'A Minecraft Bedrock server, a Lychee photo gallery, and a browser-based dev environment, each in its own LXC container.', status: 'Complete' },
              { phase: '03', title: 'Windows Server and Active Directory lab', desc: 'Two domain controllers and a member server on an isolated network, built alongside an AZ-800 course.', status: 'In Progress' },
              { phase: '04', title: 'Networking', desc: 'A dedicated OPNsense router/firewall and VLANs.', status: 'Planned' },
              { phase: '05', title: 'Monitoring', desc: 'Host hardware temperatures plus a Raspberry Pi room sensor.', status: 'Planned' },
              { phase: '06', title: 'Infrastructure as Code', desc: 'Managing lab infrastructure with Terraform.', status: 'Planned' },
            ].map(({ phase, title, desc, status }) => (
              <div key={phase} className="flex gap-4 border border-gray-200 bg-white rounded-2xl p-5">
                <span className={`text-xs font-mono font-bold mt-0.5 ${(statusStyles[status] ?? statusStyles.Planned).number}`}>{phase}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${(statusStyles[status] ?? statusStyles.Planned).badge}`}>{status}</span>
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
                items: ['Windows Server', 'VMware vSphere/vCenter', 'Active Directory', 'Group Policy', 'DNS', 'Proxmox VE', 'Linux (Debian)'],
              },
              {
                category: 'Cloud',
                items: ['Microsoft Azure', 'Intune', 'AWS (EC2, S3, IAM, Lambda, CloudFormation)'],
              },
              {
                category: 'Scripting and Automation',
                items: ['PowerShell', 'Bash', 'Python', 'systemd services and timers', 'Git'],
              },
              {
                category: 'Containers and Networking',
                items: ['Docker', 'Docker Compose', 'LXC', 'Cloudflare Tunnel', 'Cloudflare Zero Trust Access'],
              },
              {
                category: 'Identity and Tools',
                items: ['CyberArk', 'RSA SecurID', 'MFA', 'Microsoft 365', 'ServiceNow', 'Citrix', 'Jira'],
              },
              {
                category: 'Currently learning',
                items: ['Terraform', 'Azure administration (AZ-104)'],
                learning: true,
              },
            ].map(({ category, items, learning }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span key={item} className={`text-sm px-3 py-1 rounded-full ${learning ? 'text-blue-700 bg-blue-50 border border-dashed border-blue-300' : 'text-gray-600 bg-gray-100 border border-gray-200'}`}>
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
              <p className="text-sm text-gray-500">Amazon Web Services · Issued Jan 2025</p>
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
              <h3 className="font-semibold mb-1">Microsoft Certified: Azure Administrator Associate (AZ-104)</h3>
              <p className="text-sm text-gray-500">Microsoft</p>
            </div>

            <div className="border border-dashed border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-36">
              <span className="text-gray-300 text-3xl mb-2">+</span>
              <p className="text-sm text-gray-400">More on the way</p>
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
            Open to systems administrator and infrastructure roles, on-prem or cloud. Always happy to talk shop.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <a href="https://www.linkedin.com/in/jaxson-madison" target="_blank" rel="noopener noreferrer"
              className="bg-gray-900 text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com/JaxsonM" target="_blank" rel="noopener noreferrer"
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