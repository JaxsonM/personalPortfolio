import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { getStatusStyle } from '../components/statusStyles';
import { projects } from '../content/projects';

const ProjectsPage: React.FC = () => {
  // Featured project first, then the rest in the order they're listed.
  const sorted = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">Projects</p>
        <h1 className="text-4xl font-bold mb-4">What I've built</h1>
        <p className="text-gray-500 mb-12 max-w-xl">
          Write-ups from my Proxmox home lab: how each project is built, what broke along the way, and what's next.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group flex flex-col border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(project.status).badge}`}>
                  {project.status}
                </span>
                {project.featured && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Featured</span>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{project.summary}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
                ))}
              </div>
              <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800">Read the write-up →</span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default ProjectsPage;
