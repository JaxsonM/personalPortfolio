## Overview

A development environment that runs in the browser. I use it to work on projects, including this site, from any browser without installing tools locally.

## How it's built

**Editor.** code-server (VS Code running on a server and used through the browser) runs in a Debian LXC container on my [Proxmox home lab](/projects/proxmox-home-lab). It runs as a non-root user under systemd.

**Access.** It's published through Cloudflare Tunnel and protected by Cloudflare Access, so it isn't exposed to the internet directly.

**Previewing.** A separate hostname points at the React dev server, so I can preview changes to a site while I edit it.

## What broke and how I fixed it

**Bind addresses: 127.0.0.1 vs 0.0.0.0.** A service listening on 127.0.0.1 only accepts connections from the same machine. A service listening on 0.0.0.0 accepts them on every network interface. Because the tunnel connector runs in a different container, a service it forwards to has to listen on an address that container can reach.

**Host-based vs path-based routing.** My first attempt at previewing the dev server went through a path-based proxy (the app lived under a sub-path of another site), and the page loaded blank. A React app requests its scripts from the root of the site, and those requests weren't being sent to the dev server. Giving the preview its own hostname (host-based routing) fixed it.

**How PATH works.** When you type a command, the shell looks for it in each directory listed in the PATH environment variable, in order. If a program is installed somewhere that isn't on PATH, the shell reports "command not found" even though the program is there.

**TODO:** Add the specific situation where PATH tripped you up.

### Finding and rotating secrets

**TODO:** Write this section yourself.

## What's next

**TODO:** Add what you plan to improve next.
