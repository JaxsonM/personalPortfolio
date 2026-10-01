## Overview

This site is a project in its own right. It started as a React app for experiments (a Spotify stats page, a movie search, a few test pages) and became the portfolio you're reading. Rebuilding it taught me as much about hosting, caching, and secrets as about web development, because most of what broke along the way had nothing to do with the code itself.

## At a glance

| Component | Details |
|---|---|
| **Frontend** | React, TypeScript, and Tailwind CSS (Create React App) |
| **Hosting** | AWS Amplify Hosting, served through CloudFront |
| **Deploys** | Every push to the main branch on GitHub triggers a new build |
| **Backend** | A separate Amplify app for the Spotify feature: API Gateway, Lambda, AppSync, and Cognito |
| **Write-ups** | Markdown files, rendered in the browser |
| **Dev environment** | [VS Code in the browser](/projects/browser-dev-environment) on my home lab, with a live preview behind Cloudflare Access |

## How it's built

### Two Amplify apps, not one

The site and its backend are two separate Amplify apps. The hosting app builds and serves the frontend from GitHub. The backend app holds the Spotify feature's AWS resources. A git push only rebuilds the frontend; backend changes only happen when I deploy them with the Amplify CLI. Knowing that split matters: it decides which changes are live after a push and which aren't.

### Project write-ups in Markdown

Each project page is a Markdown file, so I can edit the writing without touching React. The build bundles each file with a content hash in its name, the page fetches it at runtime, and a Markdown renderer turns it into styled HTML. Card details like titles and tags live in one TypeScript file that feeds both the homepage and the projects page.

Before rendering, the page checks that it actually received Markdown. If the response is an error, is labeled as HTML, or starts like an HTML page, it shows a friendly message instead of rendering the wrong thing. I added that check after the hosting problem described below.

### Images and diagrams

The network diagram on the [Proxmox write-up](/projects/proxmox-home-lab) is a hand-written SVG, so it stays sharp at any size and I can edit it in a text editor. Images in write-ups show at a capped height so they fit on screen, and open larger in a pop-up when clicked.

The site icon is drawn as shapes instead of a font. I generated the PNG and ICO versions with a short Python script using only the standard library, and lined up the letter's edges with the pixel grid so it stays crisp at 16 pixels.

## What broke and how I fixed it

### The write-ups loaded as the site's HTML

The project pages worked locally but would have broken on the live site. Amplify uses rewrite rules so that a link like `/projects/windows-ad-lab` serves the app's `index.html` and lets React show the right page. My rule was a common pattern: rewrite everything except a list of file extensions. Markdown wasn't on that list, so a request for a write-up would have returned `index.html` instead.

I added `md` to the list. Later the same bug hit my headshot, because the list had `jpg` but not `jpeg`. A regular expression compares text, not file formats.

My first attempt at a permanent fix, removing the extension list entirely, broke direct links instead: the storage behind Amplify redirected extensionless paths before my remaining rule could handle them. The rule I use now rewrites only paths with no dot in them. Page routes never have a dot and real files always do, so it can't swallow a file again, whatever its type.

### Fixed, but still broken: CloudFront caching

Even after fixing a rule, the old broken response could stick around. The site is served through CloudFront, which caches files at its edge servers for a long time. A cached copy of the wrong response kept being served until I redeployed, which clears the cache.

### Secrets in a public repository

While cleaning up the repo from my [browser-based dev environment](/projects/browser-dev-environment), I found an API key and a client secret committed in an Amplify configuration file. The repository is public, and they had been in its history for over a year. Deleting them from the file wouldn't have helped, since anyone can read old commits. The real fix was to revoke them: I rotated both, deleted the account behind the unused key entirely, and removed the old backends that needed them.

The cleanup turned up a second lesson. An older, unused version of the movie search code expected the key in an environment variable starting with `REACT_APP_`. That one never shipped, but it would have been a leak too: Create React App copies every `REACT_APP_` variable into the public JavaScript bundle, where anyone can read it. Secrets belong on the server side, in the Lambda function's own configuration.

### Smaller lessons

- **Build warnings can fail a deploy.** When `CI=true` is set, as it is on most build services, Create React App treats lint warnings like unused variables as errors. I now run `CI=true npm run build` before pushing.
- **Photos carry hidden data.** Camera and phone photos include metadata such as the camera model, creator details, and sometimes GPS coordinates. I strip it before publishing an image.
- **Check what's staged before committing.** `git rm` stages a deletion immediately, so it rode along in an unrelated commit. Running `git status` before each commit catches that.
- **SVGs need a built-in size.** My diagram's SVG had no width or height attributes, so browsers didn't scale it reliably. Adding them fixed it.

## Cleanup along the way

The repo had collected a lot of experiments. I removed the pages and code for an AI chatbot, a randomizer, a "hello world" API test, a movie search, and an old script page, plus unused npm packages and the old Create React App logos. On the AWS side, I removed the unused movie search and hello world backends with the Amplify CLI.

## What's next

- **Move the Spotify secret into AWS Systems Manager Parameter Store** using Amplify's function secrets, and stop committing Amplify's configuration file, so a secret can never end up in the repo again.
- **A branch-based workflow,** with Amplify building a separate preview for each branch, so changes are reviewed before they reach the live site.
- **Decide the backend's future.** The Amplify Gen 1 CLI reaches end of life on May 1, 2027, so the Spotify backend either moves to Gen 2 or retires.
- **Move off Create React App**, which is no longer maintained, most likely to Vite.