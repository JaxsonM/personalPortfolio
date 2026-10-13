## Overview

A public status page for our Minecraft Bedrock server, showing who's online, all-time playtime, when each player was last seen, and how hard the server is working. A Discord bot posts in our group chat whenever someone joins.

**TODO:** add a screenshot of the dashboard here, showing the online players, playtime, and Server Resources panels.

It's part of my [Minecraft Bedrock server](/projects/minecraft-bedrock-server) project, alongside the [live world map](/projects/minecraft-world-map). I chose to self-host it with Prometheus and Grafana instead of a cloud service, because running a real monitoring stack is exactly the kind of experience I wanted from this lab.

## At a glance

| Component | Details |
|---|---|
| **Platform** | Its own unprivileged Debian 12 LXC container on my [Proxmox home lab](/projects/proxmox-home-lab) |
| **Metrics** | Prometheus, collecting from three exporters |
| **Dashboard** | Grafana, published through my Cloudflare Tunnel |
| **Player data** | My own Bash scripts that read the server's log |
| **Access** | Public dashboard; everything else on the same hostname behind Cloudflare Access |
| **Notifications** | A Discord webhook that posts player joins |

## Diagrams

**TODO:** add a diagram here: the Prometheus exporters, Grafana, and the path from the server log to the dashboard and Discord.

## How it's built

### Prometheus and its sources

Prometheus works by **scraping**: every few seconds it visits a list of small web endpoints called exporters, each of which reports numbers in a simple text format, and stores them as time series. Mine collects from three:

| Source | What it measures |
|---|---|
| **node_exporter** on the game server | Memory, disk and network inside the container, plus my custom player metrics (below) |
| **A Proxmox exporter** | CPU per container, read from the Proxmox API with a read-only token |
| **blackbox_exporter** | Whether the game port answers, tested two ways (below) |

**TODO:** confirm the scrape interval, name the Proxmox exporter project used, and list any other scrape targets (for example, Prometheus monitoring itself).

### Why CPU comes from the host

CPU usage measured inside an LXC container isn't accurate, because a container shares the host's kernel and doesn't have a true view of its own share of the processor. The Proxmox host does know each container's real usage. So CPU comes from the Proxmox API instead, through an API token limited to Proxmox's read-only auditor role, so the exporter can see everything but change nothing.

**TODO:** describe how the wrong CPU numbers were first noticed.

### Checking the server two ways

blackbox_exporter tests whether the game's TCP port accepts connections, twice: once at the server's address on my home network, and once through the public domain name friends use. Comparing the two narrows down problems quickly. If both fail, the server itself is down. If only the public check fails, the problem is somewhere between the internet and the server, like DNS, my public IP, or the router's port forward.

It only listens on the monitoring container's own loopback address, so it can't be used by anyone else to probe the network.

### Counting players from the server log

The Bedrock server doesn't offer metrics, but it logs every join and leave to the systemd journal. A Bash script reads those lines for the server's current run, works out who's online, and writes the result as a metrics file that node_exporter picks up through its **textfile collector**, a folder it reads extra metrics from. A systemd timer runs it every 15 seconds.

Only reading the current run matters: if the server restarts, everyone is disconnected, and a join from before the restart would otherwise look like a player who never left.

### All-time playtime and last seen

A second script turns join and leave lines into play sessions and keeps them in a permanent file, running every minute. On its first run, it went back through the journal to the server's very first start on September 23, 2026, so the totals include play from before the dashboard existed. Keeping its own file means the history survives even after the journal rotates old logs away.

**TODO:** add how a session is closed out when the server stops or crashes while someone is online.

### Publishing a public dashboard safely

The dashboard is served through my Cloudflare Tunnel like my other sites, so no ports were opened. Grafana's sign-in and settings pages live on the same hostname, so I couldn't make the whole site public. Cloudflare Access protects everything on the dashboard's hostname, and a second, more specific Access application with a Bypass policy covers only the public dashboard's paths. When two Access applications match a request, Cloudflare applies the more specific one, so visitors can see the dashboard but can't reach anything else.

**TODO:** add how the public dashboard is set up on the Grafana side, and any settings changed to keep it read-only.

### Discord join notifications

A small watcher runs as its own systemd service on the game server. It follows the server's log, and when a player joins, it posts a message to our Discord through a webhook. The webhook URL acts like a password, since anyone who has it can post to the channel, so it lives in a separate config file only root can read, not in the script. That also meant moving the notifications to their own channel later was a change in Discord, with no code changes at all.

**TODO:** add the final channel name and what the message looks like, with a screenshot.

## What broke and how I fixed it

**TODO:** add troubleshooting stories from building the dashboard and the Discord watcher.

## Reading the graphs

One thing I learned from watching the dashboard: on the Server Resources panel, CPU jumps up and down with player activity, but memory stays nearly flat all day, even when everyone logs off.

The two measure different things. CPU is the work being done right now. Memory is what the server is holding onto. The game server loads the world into memory and keeps it there, and like most programs, it rarely hands memory back to the system even after it stops using it, because asking for it again later is slow. So a flat memory line is healthy. The patterns worth alerting on are memory that climbs for days without leveling off (a memory leak), or memory approaching its limit.

## What's next

- **Alerts:** notify me on Discord when the server is down, or when memory climbs steadily for days.
- **A death log** on the dashboard.
- **Link the dashboard and the [world map](/projects/minecraft-world-map)** to each other.
- **Host temperatures and closet temperature**, so the dashboard covers the hardware too.
