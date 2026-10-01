## Overview

A Windows Server and Active Directory environment I'm building from scratch alongside an AZ-802 course on Udemy, as preparation for the AZ-802 Windows Server Administrator Associate certification. I work with Active Directory in an enterprise environment, but always inside a domain someone else designed. Building one myself shows me the parts I don't see day to day: how a forest gets created, how domain controllers find and back each other up, and how much of it depends on DNS.

This is a work in progress. I'm about a third of the way through the course, and I add to the lab as I go.

## At a glance

| Component | Details |
|---|---|
| **OS** | Windows Server 2025 Standard (Desktop Experience) |
| **Domain** | lab.jaxsoncodes.com |
| **Domain controllers** | DC1 and DC2, both running DNS |
| **Member server** | SRV1 |
| **VM specs** | 2 vCPUs, 4GB RAM, 60GB disk each |
| **Network** | Isolated lab network on my [Proxmox home lab](/projects/proxmox-home-lab), with internet access through NAT |
| **Course** | AZ-802 on Udemy, about one third complete |

## Progress

- [x] Build three Windows Server VMs on an isolated network
- [x] Create a new forest and promote DC1 to a domain controller
- [x] Join SRV1 to the domain
- [x] Add DC2 as a second domain controller
- [x] Fix DNS so the second domain controller actually provides redundancy
- [ ] Organizational units and Group Policy, tested on a Windows 11 client
- [ ] DHCP on the domain controllers
- [ ] WSUS for patch management
- [ ] Backup and restore testing
- [ ] Hybrid management with Azure

## How it's built

### The VMs

All three servers run as VMs on my Proxmox host with matching specs, so they behave the same way and are easy to compare. They use a SATA virtual disk and an Intel E1000 network adapter, which Windows supports out of the box with no extra drivers. Each VM also runs the QEMU guest agent, a small service that lets Proxmox see inside the VM: it can show the VM's IP address, shut Windows down cleanly instead of cutting the power, and pause disk writes at a safe moment before a backup.

### The network

The lab lives on its own isolated network, separate from my home network. Domain controllers run DNS and eventually DHCP, and I don't want those answering devices in the rest of my house. The [Proxmox write-up](/projects/proxmox-home-lab) covers how the host gives the lab internet access through NAT without connecting it directly to my home network.

There's no DHCP server on the lab network yet, so every server has a static address. The domain controllers will take over DHCP later in the course.

### Naming the domain

I named the domain `lab.jaxsoncodes.com` instead of using `jaxsoncodes.com` directly. A domain controller becomes the authoritative DNS server for its domain name, for every machine joined to the domain. If I had used my real domain, domain-joined machines would get their DNS answers from the lab instead of the internet, and couldn't reach my real website without me copying its records into the lab by hand. That's called **split-brain DNS**, and using a subdomain avoids it completely. It's the same pattern companies use: something like `corp.company.com` for internal Active Directory, while `company.com` stays public.

### DC1: creating the forest

DC1 was the first domain controller, so promoting it created a brand-new forest. The DNS role installed alongside Active Directory, and DC1 points DNS at itself, since it's now the DNS server for the domain.

Two things about the promotion surprised me:

- **There's no separate domain admin password step.** When the first domain controller is promoted, its local Administrator account becomes the domain's Administrator account, with the same password.
- **The DSRM password is its own thing.** Directory Services Restore Mode is a recovery mode where Active Directory is offline, so no domain account can log in. The DSRM password is the local, break-glass credential for that situation, like repairing the directory database from a backup.

### SRV1: joining the domain

SRV1 points its DNS at the domain controller rather than at itself, because it isn't a DNS server. That setting is what makes joining the domain possible: a computer finds domain controllers by asking DNS for special records that list them, so if a member server can't reach the domain's DNS, it can't find the domain at all.

### DC2: a second domain controller

DC2 joined the existing domain as a second domain controller, also running DNS. Domain controllers replicate the directory between each other, so either one can handle logins. That's the main reason real environments never run just one.

## What I found along the way

### Two domain controllers, but only one that counted

After promoting DC2, I asked myself a question: if DC1 went down, could I still log into SRV1? Thinking it through turned up a gap. DC2 was a fully working domain controller with its own DNS, but **every machine in the lab, including DC2 itself, still pointed DNS only at DC1.** If DC1 went offline, nothing would know how to find DC2. The redundancy existed on paper but wouldn't have worked.

The fix was making each machine's DNS settings match its role:

- **DC2** points at itself first, with DC1 as its backup. It's a DNS server, so depending on DC1 to answer its own domain's lookups is an unnecessary weak point.
- **SRV1** keeps DC1 as its first choice and adds DC2 as an alternate, so it falls back automatically if DC1 doesn't answer.

Working through it also cleared up a related misconception. I assumed that with no domain controller reachable, nobody could log into SRV1 with a domain account. That's not quite true: Windows caches a user's last successful login, so a previously used domain account can still sign in. But it's a limited fallback. No new Group Policy applies, and the machine can't check whether the account was disabled since. A working second domain controller is what keeps things running properly.

The lesson: adding a second server doesn't create redundancy by itself. Every client has to know the backup exists, and in Active Directory, that knowledge lives in DNS.

## What's next

- **Organizational units and Group Policy,** tested on a domain-joined Windows 11 client VM, so I can see policies actually apply.
- **DHCP on the domain controllers,** replacing static addresses for clients.
- **WSUS** for managing Windows updates across the lab.
- **Backup and restore, tested two ways:** Windows Server Backup inside the VMs, and Proxmox backups at the hypervisor level.
- **LAPS,** so each machine's local Administrator account gets its own unique, automatically rotated password.
- **Remote access to the lab** through my Cloudflare Tunnel, by giving the tunnel connector a network interface on the lab network.
- **Hybrid management,** connecting the lab to Azure as the course gets to it.
- **Finish the course and pass AZ-802.**