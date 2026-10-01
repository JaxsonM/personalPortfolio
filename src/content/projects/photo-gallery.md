## Overview

A private photo gallery for my family, running on my home lab. It replaced a 256GB USB drive full of photos that only one person could look at, at one computer at a time. Now family members can browse, upload from their phones, and share albums from anywhere, while everything stays on hardware I control.

## At a glance

| Component | Details |
|---|---|
| **App** | Lychee, an open-source photo gallery |
| **Database** | MariaDB 11 |
| **Deployment** | Docker Compose, inside an unprivileged Debian 12 LXC container |
| **Storage** | 16GB system disk, plus a 750GB photo volume on the NVMe thin pool |
| **Access** | Cloudflare Tunnel, Cloudflare Access for named family members, and Lychee's own accounts |
| **Platform** | My [Proxmox home lab](/projects/proxmox-home-lab) |

## How it's built

### Choosing Lychee

I compared a plain file share, Plex, Immich, and PhotoPrism before picking Lychee. My requirements were specific: import an existing archive as-is, support multiple users with both private and shared albums, allow uploads from a phone's browser, and skip AI features like face recognition, which I didn't need. Immich and PhotoPrism are excellent, but much of their weight goes into those AI features. Lychee did exactly what I needed and nothing more, which also means less to maintain.

### Storage

The container has two disks, and the split is deliberate:

- **A 16GB system disk** on the SSD holds Debian, Docker, the app's configuration, logs, and temporary files. All of it is small and easy to rebuild.
- **A separate photo volume** on the NVMe thin pool is mounted into the container and mapped into Lychee as its upload folder. The photos are the only data here that can't be replaced, so they live on their own volume, apart from everything else.

I started the photo volume at 500GB and later grew it to 750GB with a single Proxmox command, with no need to rebuild anything. Because the pool is thin-provisioned, the volume only takes up as much real disk space as the photos actually use.

### Docker inside a container

Lychee runs as two Docker containers inside one LXC container: the app and its database. Docker builds containers of its own, and doing that from inside an LXC container requires a Proxmox setting called nesting. I enabled it when I created the container.

The two containers are defined in a Docker Compose file, which describes the whole stack in one place. A few details in it matter:

- **The database starts first.** The app waits for the database to pass a health check before it starts, instead of racing it and failing because the database isn't ready yet.
- **The database isn't reachable from outside.** Only Lychee's web port is published. The database has no published port at all, so it only accepts connections from the app on Docker's internal network, not from my home network and not from the internet.
- **Both restart automatically** unless I stop them on purpose.

### Users and albums

Each family member has their own Lychee account. Albums can be private to one person or shared, and a shared family album allows uploads from everyone, so anyone can add photos from their phone.

### Remote access

The gallery is published through my Cloudflare Tunnel, like everything else in my lab. Its Cloudflare Access policy allows only specific family members' email addresses, so a visitor has to prove who they are before a single request reaches the gallery. Then they still sign in to Lychee with their own account. Two separate logins, controlled by two separate systems.

### Importing the archive

To bring the old photos over, I plugged the USB drive into the Proxmox host and passed it into the container as a temporary second mount. Then I copied everything with `rsync`, which shows progress and can resume where it left off if a large copy gets interrupted.

## What broke and how I fixed it

### "This site can't be reached"

When I first opened the gallery from a laptop on my home network, the browser said the site couldn't be reached. Docker inside an LXC container is known for networking quirks, so that was my first suspect. But a test from inside the container showed Lychee answering normally, so the server was fine.

The real cause was the browser. Lychee was serving plain HTTP on its port, but the browser automatically tried HTTPS first, and the connection failed with an SSL error. Typing `http://` explicitly in the address bar fixed it. On the public address this never comes up, because Cloudflare handles HTTPS in front of the tunnel. It was a good reminder to rule out the simple explanation before chasing the complicated one.

### Thumbnails broke on the public address

The gallery worked on my home network, but through the public address, the page loaded while every thumbnail was broken.

Lychee builds the full URL for each image using a setting called `APP_URL`, and I had set it to the container's local address while testing. The page itself loaded through the tunnel, but every image link pointed to a private address that a browser outside my network can't reach. Setting `APP_URL` to the public address fixed it. Any app that builds absolute links needs to know the address users actually reach it at, not the address of the machine it runs on.

### The bulk import kept timing out

Importing the archive through Lychee's web interface kept failing partway through. Lychee runs on PHP, and PHP stops any web request that takes longer than 30 seconds, which a large import easily does.

Instead of raising the limit, I ran the import from the command line with Lychee's own sync command, run inside its container. Command-line PHP has no execution time limit, so the import ran to completion. Web requests should be short, and long-running jobs belong somewhere else: the same reason real web applications hand heavy work to background workers.

## Security decisions

- **Two layers of authentication:** Cloudflare Access by email, then Lychee's own accounts.
- **The database isn't exposed anywhere,** not even to my home network.
- **Unprivileged container:** if something escaped Lychee's containers and the LXC container, it would land on the Proxmox host as a powerless user.
- **Photos live on their own volume,** separate from the system disk.

## What's next

- **Backups of the photo library.** These are family photos, so this matters more here than anywhere else in my lab. The plan is scheduled backups to separate storage, plus an offsite copy.
- **Move the database passwords out of the Compose file** into a separate environment file that only root can read. Nothing is exposed today, but it's the right habit, and it means the Compose file could be shared or version-controlled safely.
- **Keep the stack updated,** with a routine for pulling new Lychee and MariaDB images.