import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import PageShell from '../components/PageShell';
import { getStatusStyle } from '../components/statusStyles';
import { getProject } from '../content/projects';
import NotFoundPage from './NotFoundPage';

// Tailwind's reset strips default heading and list styles, so each Markdown element gets its own classes.
const markdownComponents: Components = {
  h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-4">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mt-8 mb-3">{children}</h3>,
  p: ({ children }) => <p className="text-gray-600 leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 text-gray-600 mb-4">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children }) => <code className="text-sm bg-gray-100 rounded px-1.5 py-0.5">{children}</code>,
  strong: ({ children }) =>
    // Highlight **TODO:** markers so unfinished sections stand out.
    children === 'TODO:' ? (
      <strong className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{children}</strong>
    ) : (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
  a: ({ href, children }) =>
    href?.startsWith('/') ? (
      <Link to={href} className="text-blue-600 hover:underline">{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>
    ),
};

const ProjectPage: React.FC = () => {
  const { slug } = useParams();
  const project = getProject(slug);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!project) return;
    setMarkdown(null);
    setFailed(false);
    fetch(project.content)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(setMarkdown)
      .catch(() => setFailed(true));
  }, [project]);

  if (!project) return <NotFoundPage />;

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/projects" className="text-sm text-gray-500 hover:text-gray-900">← All projects</Link>
        <div className="mt-6 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(project.status).badge}`}>
            {project.status}
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
          ))}
        </div>

        {failed && <p className="text-gray-500 mt-12">Sorry, this write-up couldn't be loaded. Please try again later.</p>}
        {!failed && markdown === null && <p className="text-gray-400 mt-12">Loading…</p>}
        {markdown !== null && <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>}
      </article>
    </PageShell>
  );
};

export default ProjectPage;
