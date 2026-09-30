// CRA bundles imported .md files as static assets; the import is the file's URL.
declare module '*.md' {
  const src: string;
  export default src;
}
