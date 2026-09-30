## Overview

A self-hosted photo gallery with private albums and a shared family album.

**TODO:** Add why you chose to self-host photos instead of using a cloud photo service.

## How it's built

**App and database.** Lychee, an open source photo gallery, runs with a MariaDB database. Both run as containers defined in one Docker Compose file, inside an LXC container on my [Proxmox home lab](/projects/proxmox-home-lab). Compose lets me describe the app, the database, and how they connect in a single file, and bring them up or down together.

**Storage.** Photos are stored on the 1TB LVM-thin pool, so the library can grow without me resizing a disk up front.

**Access.** There are two layers of login. Cloudflare Access checks who you are before a request reaches the gallery, and then Lychee's own login controls which albums you can see.

## What broke and how I fixed it

**TODO:** Add a problem you hit while setting up Lychee, MariaDB, or storage, and how you solved it.

## What's next

**TODO:** Add what you plan to improve next.
