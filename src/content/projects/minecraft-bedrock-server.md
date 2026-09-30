## Overview

A dedicated Minecraft Bedrock server for about six friends who play on Xbox and PC. It started as a game server and turned into a good exercise in Linux services, DNS, and networking.

## How it's built

**Container.** The server runs in an unprivileged Debian LXC container on my [Proxmox home lab](/projects/proxmox-home-lab). "Unprivileged" means the root user inside the container maps to an ordinary, powerless user on the host, which limits the damage if the container is ever compromised.

**Service.** The server runs as a systemd service under its own dedicated user instead of root. A named pipe (a special file that one process writes to and another reads from) feeds the server's console, so I can send it console commands without attaching to its terminal.

**Dynamic DNS.** My home IP address can change, which would break the address my friends use to connect. I wrote a Bash script that keeps the server's DNS record current:

- A systemd timer runs it every 5 minutes.
- It updates the record through the Cloudflare API, using an API token scoped to only what the script needs.

**Console players.** Xbox doesn't let you add custom servers. Console players use BedrockConnect, a DNS-based workaround: they change the DNS settings on their console, and one of the built-in featured servers opens a server list where they can join mine instead.

## What broke and how I fixed it

Players outside my home network got connection errors, even though the DNS record was correct. The fix was adding my public IP to the server's network settings.

That created a new problem: the setting goes stale whenever my IP changes. So the DDNS script now updates that setting too and restarts the server, not just the DNS record.

## What's next

**TODO:** Add what you plan to improve next (for example backups or monitoring).
