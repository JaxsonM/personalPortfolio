import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageShell from '../components/PageShell';
import ZoomableImage from '../components/ZoomableImage';
import { getStatusStyle } from '../components/statusStyles';
import { getProject } from '../content/projects';
import NotFoundPage from './NotFoundPage';

// Tailwind's reset strips default heading and list styles, so each Markdown element gets its own classes.
const markdownComponents: Components = {
  h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-4">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mt-8 mb-3">{children}</h3>,
  // Markdown wraps a standalone image in a paragraph; skip the <p> so the image's pop-up isn't nested inside one.
  p: ({ node, children }) => {
    const only = node?.children.length === 1 ? node.children[0] : undefined;
    if (only && only.type === 'element' && only.tagName === 'img') return <>{children}</>;
    return <p className="text-gray-600 leading-relaxed mb-4">{children}</p>;
  },
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
  // Images fit on screen and open larger in a pop-up.
  img: ({ src, alt }) => <ZoomableImage src={src} alt={alt} />,
  // Tables (enabled by remark-gfm). The wrapper scrolls sideways only if a table can't fit on a small screen.
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 border border-gray-200 rounded-xl">
      <table className="w-full text-sm text-left [&_td:first-child]:font-semibold [&_td:first-child]:text-gray-900 [&_td:first-child]:whitespace-nowrap">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
  th: ({ children }) => <th className="px-4 py-3 font-semibold text-gray-900">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 text-gray-600 align-top leading-relaxed">{children}</td>,
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

    const fail = (reason: string) => {
      console.warn(`Write-up for "${project.slug}" not rendered (${project.content}): ${reason}`);
      setFailed(true);
    };

    // A misconfigured host can answer a Markdown request with the site's index.html,
    // so check the response before rendering it as a write-up.
    fetch(project.content)
      .then(async (res) => {
        if (!res.ok) {
          return fail(`response was not ok (HTTP ${res.status})`);
        }
        const contentType = res.headers.get('Content-Type') ?? '';
        if (contentType.toLowerCase().includes('text/html')) {
          return fail(`Content-Type is "${contentType}", so the server sent a web page instead of Markdown`);
        }
        const text = await res.text();
        if (text.trimStart().toLowerCase().startsWith('<!doctype html')) {
          return fail('body starts with "<!doctype html", so the server sent a web page instead of Markdown');
        }
        setMarkdown(text);
      })
      .catch((err) => fail(`request failed (${err})`));
  }, [project]);

  if (!project) return <NotFoundPage />;

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/#projects" className="text-sm text-gray-500 hover:text-gray-900">← Back to projects</Link>
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

        {failed && (
          <div className="mt-12 border border-gray-200 bg-gray-50 rounded-2xl p-6">
            <p className="text-gray-600 mb-3">Sorry, this write-up couldn't be loaded. Please try again later.</p>
            <Link to="/#projects" className="text-sm font-medium text-blue-600 hover:text-blue-800">← Back to projects</Link>
          </div>
        )}
        {!failed && markdown === null && <p className="text-gray-400 mt-12">Loading…</p>}
        {markdown !== null && <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{markdown}</ReactMarkdown>}
      </article>
    </PageShell>
  );
};

export default ProjectPage;
