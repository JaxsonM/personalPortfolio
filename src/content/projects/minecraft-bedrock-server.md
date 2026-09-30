## Overview

A dedicated Minecraft Bedrock server for about six friends who play on consoles and PC. It started as a game server and turned into one of my best exercises in Linux services, networking, DNS, and automation, because it has real users who notice immediately when something breaks.

## At a glance

| Component | Details |
|---|---|
| **Server** | Bedrock Dedicated Server, Mojang's official server software |
| **Platform** | Unprivileged Debian 12 LXC container on my [Proxmox home lab](/projects/proxmox-home-lab) |
| **Service** | systemd service running as a dedicated non-root user |
| **Networking** | Router port forward: one TCP port for connections, a narrow UDP range for gameplay |
| **DNS** | A domain on Cloudflare, kept current by my own Bash DDNS updater |
| **Automation** | Two systemd timers: DNS updates and a health check |
| **Players** | About six friends on Xbox, Switch, and PC |

## How it's built

### Choosing Bedrock over Java

My friend group is split between console and PC. Consoles can only run Bedrock Edition, and Java and Bedrock can't connect to each other directly. The common workaround is a Java server with a plugin called Geyser that translates Bedrock traffic into Java traffic. My PC friends didn't mind switching to Bedrock, so I ran a pure Bedrock server instead. That meant one less piece of software to maintain and no risk of the translation layer lagging behind a game update.

### The container and service

The server runs in an unprivileged LXC container. "Unprivileged" means the root user inside the container maps to an ordinary, powerless user on the host, which limits the damage if the container were ever compromised.

The server runs as a systemd service under its own dedicated user instead of root, so it starts on boot and restarts if it crashes. A named pipe (a special file that one process writes to and another reads from) feeds the server's console. That lets me send it commands, like adding a player to the allow-list, without attaching to its terminal.

### How players connect

Bedrock's current network transport works in two stages. A player first connects over TCP to set up the connection. Then the server hands them a UDP port for the actual gameplay. By default, the server picks from a range of about 50 UDP ports. I narrowed it to 16, which is plenty for our group and keeps the router's port forward small.

The router forwards those ports to the container. I switched the container from a static IP to DHCP with a reservation on the router, so the router knows the device by name and always gives it the same address.

### DNS and my DDNS updater

Friends connect with a domain name instead of an IP address. The DNS record is set to "DNS only" in Cloudflare instead of proxied, because Cloudflare's proxy only handles web traffic, not game traffic.

My home IP address can change at any time, which would break that record. So I wrote a Bash script that keeps it current:

- A systemd timer runs it every 5 minutes.
- It checks the current public IP, compares it to the DNS record, and only updates the record when they differ.
- It talks to the Cloudflare API with a token that can only edit DNS for this one domain. If the token ever leaked, the damage would be limited to a single domain's DNS.
- The token lives in a separate file only root can read, not in the script itself.

### Console players

Xbox and Switch don't let you add custom servers, only Mojang's featured ones. Console players use BedrockConnect, a DNS-based workaround. They change their console's DNS settings to point at a BedrockConnect server. When they select one of the featured servers, that DNS server answers the lookup with BedrockConnect's own address instead of the featured one, which opens a screen where they can enter my server's address and connect directly.

## What broke and how I fixed it

### Outside players couldn't connect

Friends on my home network could join, but anyone outside got stuck on "Locating server" and then a connection error, even though the DNS record and port forward were both correct.

The cause was in how a Bedrock connection is set up. It happens in two stages, over two different protocols:

1. **The TCP handshake.** The player's game looks up my domain, gets my public IP, and connects to it on the server's TCP port. My router forwards that to the container, and the handshake succeeds. So far, everything works.
2. **The UDP gameplay connection.** During the handshake, the server tells the player where to send the actual gameplay traffic: an IP address and a UDP port. By default, the server only knows its own private address on my home network, so that's the address it hands out.

A player on my home network can reach that private address directly, which is why local players had no problem. A player outside can't, because private addresses aren't routable on the internet. Their game kept sending UDP packets to an address that went nowhere, and the connection timed out.

Normally my router's NAT handles translating between private and public addresses. But NAT only rewrites the addresses on the outside of each packet. It can't change an address the server writes *inside* its own message. The player received the private address as data, and no amount of router configuration could fix that.

The fix was a server setting that controls which address it advertises for gameplay. It accepts an optional external address in front of the port range:

    server-udp-ports=<public-ip>:19140-19155:19140-19155

That tells the server: "Tell players to reach me at my public IP on these UDP ports, which map to these same ports on my side." The router's port forward carries the traffic the rest of the way. As soon as I made the change, outside friends could connect.

The fix also created a new problem. My public IP was now hardcoded in the server's config, so if it ever changed, the DNS record would update but the server would keep advertising the old address, and outside players would break without any error on my end. I extended my DDNS script to update that setting too and restart the server whenever the IP changes, so the two can't drift apart.

### A server that looked healthy but wasn't

After regenerating the world, nobody could connect, from anywhere. systemd reported the service as running.

My first theory was a router limitation. It fit the symptoms, but it was built on an assumption I hadn't checked. Running `ss`, which lists the ports a machine is actually listening on, took ten seconds and showed the real cause: the server had started and loaded the world, but never opened its connection port. The startup log confirmed it. The line announcing that the server was accepting clients was missing, with no error logged. A restart fixed it.

"The process is running" and "the service works" are different things, and systemd can only tell you the first. So I wrote a health check that runs every 5 minutes on a systemd timer: if the service should be running but its port isn't listening, it restarts the server. The bigger lesson was to check the basics before building theories on top of them.

### The wrong device in my router

When I set up the port forward, the router's device list showed an "ASUS Windows" device that I almost picked. It was actually my Proxmox host. The router named it after the manufacturer of its network card, and the host's network card is ASUS.

The first half of a MAC address identifies the manufacturer. Proxmox gives containers virtual network cards whose MAC addresses start with a prefix Proxmox owns, so the container could never show up as an ASUS device. Forwarding to the host wouldn't have been dangerous, since nothing on it listens on those ports, but it would have silently failed and been confusing to troubleshoot later.

## Security decisions

- **Allow-list:** only players I've added by name can join, so anyone who finds the server can't actually get in.
- **Xbox account sign-in:** every player has to authenticate with a Microsoft account.
- **Least privilege:** the server runs as a non-root user in an unprivileged container, and the Cloudflare API token can only edit DNS for one domain.
- **Minimal exposure:** only the ports the game needs are forwarded, and only to this one container. The port forward is the only inbound path into my home lab, and it's used for game traffic only.

## What's next

- **Backups:** scheduled Proxmox backups of the container, with a tested restore.
- **A public status page:** connected players, server health, and a world map, published through my Cloudflare Tunnel.
- **Firewall rules:** a default-deny Proxmox firewall on the container, allowing only the game ports.
- **Publish the DDNS script** on GitHub, with the token kept out of the repo.