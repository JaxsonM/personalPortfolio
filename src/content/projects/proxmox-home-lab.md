## Overview

My home lab runs on a repurposed gaming PC. It's where I practice the infrastructure work I want to do more of (virtualization, Linux, networking, and Windows Server), and it hosts a few services for me, my friends, and my family.

I wanted to reach everything remotely without opening ports on my home router or running a VPN, so remote access goes through Cloudflare Tunnel and Cloudflare Access instead.

## How it's built

**Hardware.** An Intel i7-7700K with 32GB of RAM, running Proxmox VE 9.

**Storage.** A 500GB SSD plus a 1TB NVMe drive. The NVMe drive is set up as an LVM-thin storage pool. Thin provisioning means a virtual disk only uses the space that has actually been written to it, so I can give each VM and container room to grow without reserving all of it up front.

**Networking.** Proxmox connects VMs and containers to the network through virtual switches called bridges. I use two:

- **vmbr0** for management and services
- **vmbr1** as an isolated network for the [Windows Server and Active Directory lab](/projects/windows-ad-lab)

NAT between the two bridges is handled with iptables, so machines on the lab network can reach out through the main network while staying separate from it.

**Remote access.** The Cloudflare Tunnel connector runs in its own Debian LXC container. The connector makes an outbound connection to Cloudflare, so nothing on my network has to accept inbound connections from the internet. Cloudflare Access sits in front of each service and checks who you are before any request reaches the lab. This is a zero trust approach: access is granted per service and per person, not by being "inside" the network.

## What broke and how I fixed it

**TODO:** Add a problem you hit while setting up the host, storage, bridges, or tunnel, and how you solved it.

## What's next

- A dedicated OPNsense router/firewall and VLANs to segment the network
- Monitoring for host hardware temperatures, plus a Raspberry Pi room sensor
- Infrastructure as Code with Terraform
