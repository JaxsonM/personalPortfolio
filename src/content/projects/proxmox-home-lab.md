## Overview

My home lab runs on a gaming PC I retired and rebuilt as a server. I use it to practice the infrastructure work I want to do more of: virtualization, Linux, networking, and Windows Server. It also hosts real services for me, my friends, and my family, so it has actual users and has to stay up.

I set two goals for the foundation: keep the Windows lab safely separated from my home network, and manage everything remotely from a browser without opening ports on my router or installing a VPN client.

## At a glance

| Component | Details |
|---|---|
| **Hardware** | Intel i7-7700K, 32GB RAM, repurposed gaming PC |
| **Hypervisor** | Proxmox VE 9 |
| **Storage** | 500GB SATA SSD, plus a 1TB NVMe drive as an LVM-thin pool |
| **Networks** | Two bridges: home network services, and an isolated Windows lab network |
| **Remote access** | Cloudflare Tunnel, with Cloudflare Access in front of every service |
| **Workloads** | 3 Windows Server VMs and 4 Debian LXC containers |

![Diagram of the Proxmox home lab network, showing the two bridges, the containers and VMs, the NAT path out of the isolated lab, and the outbound Cloudflare Tunnel](/images/proxmox-home-lab-diagram.svg)

## How it's built

### Hardware

The server is a gaming PC I wasn't using anymore. It has no graphics card; the CPU's integrated graphics are enough for a server console. Before trusting an old NVMe drive that had thrown errors in Windows, I checked its SMART health data. It reported 95% of its rated life remaining and no critical warnings, so I put it back into service.

### Proxmox host

Proxmox VE is installed on the SSD with a static address on my home network. After installing, I switched Proxmox from its enterprise update repositories (which require a paid subscription) to the no-subscription repository, the standard choice for a home lab.

### Storage

The SSD holds Proxmox itself plus VM disks. The NVMe drive is one LVM-thin pool spanning the whole disk. I considered splitting it into fixed partitions (one for photos, one for VMs) but chose a single pool instead, so each workload can grow as needed without a hard boundary. Thin provisioning means a virtual disk only uses the space that has actually been written to it.

### Networking

Proxmox connects VMs and containers to the network through virtual switches called bridges. I use two:

- **vmbr0** connects to my home network. The Linux services live here.
- **vmbr1** is an isolated network for the [Windows Server and Active Directory lab](/projects/windows-ad-lab). It has no physical network port, so machines on it can only talk to each other.

The isolation matters because domain controllers run network services like DNS and DHCP. If a lab domain controller sat on my home network, its DHCP server would compete with my router and start handing out addresses to phones and laptops.

The lab still needs internet access for updates, so the Proxmox host acts as its gateway. IP forwarding lets the host pass traffic between the two bridges, and an iptables NAT rule rewrites lab traffic so it leaves looking like it came from the host. That's the same trick a home router uses to share one public address across a whole house.

### Containers and VMs

Linux services each run in their own LXC container. Containers share the host's kernel, so they start in seconds and use far less memory than full VMs. Windows can't run in a Linux container, so the Windows servers are full VMs. The containers are unprivileged, and services inside them run as dedicated non-root users.

### Remote access

The Cloudflare Tunnel connector runs in its own container instead of directly on the Proxmox host. If the connector were ever compromised, the damage would be limited to that container, not the hypervisor running everything else.

The connector makes an outbound connection to Cloudflare, so nothing on my network accepts inbound connections for management. Each service gets its own hostname and its own Cloudflare Access application, and Access checks my identity before any request reaches the lab. When I publish a new service, I create the Access application first and the public hostname second, so the address is never reachable without protection, even briefly.

To make this possible, I moved my domain's DNS from AWS Route 53 to Cloudflare. My portfolio site is still hosted on AWS; Cloudflare just answers DNS for it now.

## What broke and how I fixed it

**No video after reviving the PC.** The motherboard's HDMI port showed nothing. The cause was a leftover setting from the machine's previous life: the BIOS still had the old graphics card set as the primary display, which disabled the integrated graphics. Resetting the BIOS (clearing CMOS) set it back to automatic. The lesson I took from it: when you repurpose hardware, reset it to a known state first instead of assuming its old configuration still makes sense.

**The isolated network was too isolated.** After building the first domain controller, the lab had no internet access. That was by design, since the lab bridge has no physical port. The fix was the gateway and NAT setup described above: the lab can reach the internet without ever being connected directly to my home network.

**Moving DNS without taking my website down.** Switching DNS providers meant copying every record carefully, including a validation record AWS uses to renew my site's SSL certificate. Missing it wouldn't have broken anything that day. HTTPS would have failed months later, at renewal time, long after I'd forgotten about the migration.

## Security decisions

- No inbound ports are open for management. All remote access goes through an outbound tunnel.
- Every service sits behind an identity check before traffic reaches it.
- The tunnel connector is isolated in its own container, away from the hypervisor.
- The Windows lab is on its own network, separated from my home devices.
- Containers are unprivileged, and services run as non-root users.

## What's next

- **OPNsense and VLANs:** replace the host's NAT rules with a dedicated router and firewall, and segment the network properly.
- **Backups:** scheduled backups of every VM and container.
- **Monitoring:** host hardware temperatures and service health, plus a Raspberry Pi sensor for the room the server lives in.
- **Remote desktop into the lab:** give the tunnel connector a second network interface on the lab network, so I can reach the Windows servers through the same tunnel.
- **Infrastructure as Code:** manage lab resources with Terraform instead of clicking through the web UI.