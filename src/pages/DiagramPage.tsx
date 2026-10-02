import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { getDiagram, getProject } from '../content/projects';
import NotFoundPage from './NotFoundPage';

// A full-width page for a diagram that's too tall to read inline in a write-up.
const DiagramPage: React.FC = () => {
  const { slug, diagram: diagramSlug } = useParams();
  const project = getProject(slug);
  const diagram = getDiagram(project, diagramSlug);

  if (!project || !diagram) return <NotFoundPage />;

  const diagrams = project.diagrams ?? [];
  const next = diagrams[(diagrams.indexOf(diagram) + 1) % diagrams.length];

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link to={`/projects/${project.slug}`} className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to {project.title}
        </Link>
        <h1 className="text-4xl font-bold leading-tight mt-6 mb-3">{diagram.title}</h1>
        <p className="text-gray-600 leading-relaxed mb-8">{diagram.description}</p>

        {/* Narrower than the diagrams' natural 720px (text stays about 13px) so more fits on screen;
            "Open full size" shows the larger version. No height cap, so the page scrolls. */}
        <img
          src={diagram.src}
          alt={diagram.alt}
          className="block w-full max-w-[480px] mx-auto h-auto bg-white border border-gray-200 rounded-xl"
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <a href={diagram.src} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 underline underline-offset-4">
            Open full size
          </a>
          {next !== diagram && (
            <Link to={`/projects/${project.slug}/diagrams/${next.slug}`} className="font-medium text-blue-600 hover:text-blue-800">
              Next: {next.title} →
            </Link>
          )}
        </div>
      </article>
    </PageShell>
  );
};

export default DiagramPage;
