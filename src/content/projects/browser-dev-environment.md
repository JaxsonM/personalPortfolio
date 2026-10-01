## Overview

A full development environment that runs on my home lab and works from any browser. I use it to build and edit projects, including this website, without installing anything on the device I'm using. The editor, the code, the tools, and the dev server all run on my server; the browser just displays the interface.

## At a glance

| Component | Details |
|---|---|
| **Editor** | code-server (VS Code running on a server, used through a browser) |
| **Platform** | Unprivileged Debian 12 LXC container on my [Proxmox home lab](/projects/proxmox-home-lab) |
| **Resources** | 2 CPU cores, 4GB RAM, 32GB disk |
| **Service** | systemd, running as a dedicated non-root user |
| **Tools** | Git, Node.js LTS, Claude Code |
| **Access** | Cloudflare Tunnel, Cloudflare Access, and code-server's own password |
| **Previewing** | A separate hostname for the live dev server, excluded from Cloudflare's cache |

## How it's built

### Why a container instead of a desktop VM

My first idea was a Windows VM I could remote into. I went with code-server in a Linux container instead:

- **It's much lighter.** The container uses a couple of gigabytes of RAM, where a Windows VM would want 8GB and a license.
- **It feels native.** code-server is a real web app, so typing and scrolling feel normal. A remote desktop streams the whole screen as video, which is noticeably laggy.
- **It matches where code actually runs.** Cloud build systems, including the one that deploys this site, run on Linux.

The container has no desktop or browser of its own. Everything visual happens in the browser on whatever device I'm using.

### The container and its user

The container is unprivileged, and everything runs as a regular user instead of root. That matters more here than for most services, because code-server includes a terminal. Whatever user code-server runs as, that's who the terminal is. If someone ever got past every login, a non-root user in an unprivileged container is about the least useful place they could land.

### Tools

Debian 12's built-in version of Node.js is past end-of-life and no longer gets security fixes, so I installed the current LTS release from NodeSource's package repository instead, which also keeps it updated through normal system updates. I downloaded their setup script and read it before running it, rather than piping it straight from the internet into a shell.

I also use Claude Code, an AI coding assistant that runs in the terminal. It can read and edit files and run commands, so I set it up with guardrails: it asks before editing files, and it can't push code or change cloud resources without my approval. Its instructions file lives in my home folder rather than in the project, so my personal settings never end up in a public repository. When I installed it, the shell reported "command not found," because its install folder wasn't on my PATH, the list of folders the shell searches for programs. Adding that folder to PATH in my shell profile fixed it.

### Publishing it

code-server runs as a systemd service, so it starts on boot and restarts if it crashes. By default it only listens on 127.0.0.1, the loopback address, which accepts connections from the same machine only. My Cloudflare Tunnel connector runs in a different container, so it would have been refused. I set code-server to listen on 0.0.0.0, meaning all network interfaces, so the connector can reach it. The tradeoff is that devices on my home network can reach the login page too, which is one reason code-server keeps its own password even behind Cloudflare Access.

It's published the same way as everything else in my lab: Access application first, then the public hostname, so the address is never reachable without protection.

### Previewing changes

When I run a React dev server, it listens on its own port inside the container. A second hostname points at that port, also behind Access, so I can open a live preview of a site in another tab while I edit it.

## What broke and how I fixed it

### The preview loaded as a blank page

code-server has a built-in proxy that serves dev servers under a path, like `/proxy/3000/`. I tried that first, and the page came up blank.

A page like this loads in two steps. First the browser gets the HTML, which came through the proxy fine. Then the HTML tells the browser to load the site's JavaScript from `/static/js/bundle.js`. The leading slash means "start from the root of the site," so the browser requested it from the root of the editor's address, without the `/proxy/3000` part. That request went to code-server instead of the dev server, the JavaScript never arrived, and a React site is an empty page until its JavaScript runs.

The fix was giving the preview its own hostname. This is the difference between **path-based routing** (one address, where the path decides where traffic goes) and **host-based routing** (a separate hostname per service). Apps that assume they live at the root of a domain need host-based routing. Cloud load balancers support both kinds of rules, and this bug is a good reason to know the difference.

### My edits wouldn't show up, twice, for two different reasons

**The first time,** I edited a page, refreshed the preview, and saw the old version, even after a hard refresh. I checked each place the old version could be coming from. `git status` showed the file as modified, so the edit was saved. Restarting the dev server made the change appear immediately, so the dev server had stopped noticing file changes.

The likely reason is that it relies on a Linux kernel feature called inotify to watch files, and containers share the host's kernel, including its limits on how many files can be watched. Between the editor, its language tools, and the dev server, those limits are easy to hit. For now I restart the dev server after changes. Switching it to polling, where it checks files on a timer instead of waiting for the kernel to notify it, is the permanent fix.

**The second time,** restarting didn't help. I was tuning the size of a diagram, and nothing I changed had any effect, even an absurdly small value. The code on the dev server was correct, so I checked the browser's network tab. Cloudflare was answering with `cf-cache-status: HIT` and an age of almost two hours.

The dev server doesn't send caching headers for its JavaScript, and when a file has none, Cloudflare caches it at the edge. A hard refresh doesn't help, because Cloudflare ignores the browser's request for a fresh copy. Every edit I had made in those two hours had been invisible. A Cloudflare cache rule that bypasses caching for the preview hostname fixed it for good. The live site doesn't have this problem, because its production builds give every JavaScript file a new name when it changes.

Same symptom, two different layers. The lesson I took from it: when you see stale content, don't guess which layer is serving it. Check each one, from the file on disk to the server to the cache, and let the response headers tell you who actually answered.

## What's next

- **Lock down the listening port:** firewall rules so only the tunnel connector can reach code-server, instead of my whole home network.
- **Fix file watching:** switch the dev server to polling so edits show up without a restart.
- **Backups** of the container, along with everything else in the lab.