## Overview

A Windows Server and Active Directory environment I'm building hands-on alongside an AZ-802 course, as preparation for Azure administration. Building a domain from scratch shows me how the pieces fit together in a way that reading about them doesn't.

## How it's built

The lab runs as VMs on my [Proxmox home lab](/projects/proxmox-home-lab):

- **DC1** and **DC2**, two domain controllers. With two, the domain keeps working if one of them is down.
- **SRV1**, a member server joined to the domain.

All three sit on **vmbr1**, an isolated network bridge that is separate from my main network. They reach the outside world through NAT on the Proxmox host.

**TODO:** Add the Windows Server version and what you've configured so far (for example DNS, OUs, Group Policy).

## What broke and how I fixed it

**TODO:** Add a problem you hit while building the lab and how you solved it.

## What's next

- Add a Windows client VM to the domain
