## Overview

A public, zoomable map of our Minecraft Bedrock world. The terrain updates every hour, players show up as live dots that move on their own, and the same pipeline keeps a backup of the world every 6 hours.

![Screenshot of the world map: forests, lakes and coastline around the spawn island in the top left, a snowy biome on the right with one live player dot labeled with its coordinates, and plain white squares along the bottom and right edges where nobody has explored yet](/images/world-map-screenshot.webp)

The red pin in the top left marks the world's spawn point, where new players first appear. The dot on the right is a friend who was online when I took the screenshot, labeled with their gamertag (blurred here) and their X, Y and Z coordinates. It moves as they play.

The map can only draw areas that someone has explored, because Minecraft doesn't generate terrain until a player gets near it. The plain white squares along the bottom and right edges are areas nobody has visited yet. The textured white area on the right is real terrain, a snowy biome.

Bedrock has no plugin system, so there's no off-the-shelf "live map" to install. This is built from a map renderer, a few Bash scripts, systemd timers, and the server's own console. It's part of my [Minecraft Bedrock server](/projects/minecraft-bedrock-server) project, alongside the [status dashboard](/projects/minecraft-server-dashboard).

## At a glance

| Component | Details |
|---|---|
| **Renderer** | [uNmINeD](https://unmined.net) command-line version, pinned to one tested release |
| **Platform** | Its own unprivileged Debian 12 LXC container on my [Proxmox home lab](/projects/proxmox-home-lab), with a 50GB data volume on a separate NVMe drive |
| **Web server** | Caddy serving static files, with cache rules per file type |
| **Publishing** | A route on my Cloudflare Tunnel, so no new ports were opened |
| **World updates** | Hourly snapshot and incremental render, on a systemd timer |
| **Player dots** | Updated every minute from the server console, refreshed in the browser every 30 seconds |
| **Backups** | A full world copy every 6 hours, with tiered retention |
| **Look** | Zoom down to 8 pixels per block, 3D shadows, and real block textures |

## Diagrams

- [How the map updates](/projects/minecraft-world-map/diagrams/pipeline): the hourly snapshot and render pipeline across three machines, the every-minute player position loop, and how visitors reach the map

## How it works

The work is split across three machines on purpose. The game server container knows how to snapshot itself, the map container knows how to back up and render, and the Proxmox host only carries data between them. Keeping the Minecraft-specific logic inside the containers keeps the custom code on the hypervisor small, since anything running there runs as root on the machine every guest depends on.

### Taking a safe copy of a live world

Bedrock stores the world in a LevelDB database that the server writes to constantly, and every few minutes it compacts that database by merging files and deleting the old ones. Copying the folder while that's happening can capture half-written files or miss files that disappear mid-copy.

The server has three console commands for exactly this, which my script sends through the console pipe:

1. **`save hold`** makes the server finish pending writes and stop rewriting or deleting world files. The game keeps running and players notice nothing.
2. **`save query`** asks whether the files are ready. When they are, the server replies with the full list of files and a length for each one.
3. **`save resume`** lets the server write again once the copy is done. The hold usually lasts a second or two.

The script also uses a Bash **trap**, which runs cleanup however the script exits. If anything fails mid-copy, the trap still sends `save resume`. Without it, a crash could leave saving paused: the game would look perfectly normal while every change piled up in memory, lost at the next restart.

### The hourly pipeline

At the top of every hour, a systemd timer on the Proxmox host:

1. Runs the snapshot script inside the game server container, which holds, copies, resumes, trims (see below), and packs the copy into one archive.
2. Records the archive's SHA-256 checksum, carries it to the map container with Proxmox's `pct` tool, and checks the checksum again on arrival. A mismatch deletes the bad copy and stops the run.
3. Runs the update script inside the map container. It unpacks the snapshot into a fresh folder, refuses it if the world's main file is missing, and swaps it in. Then it keeps a backup if it's a backup hour, prunes old backups, and renders the map.

Every script stops at its first error, so a failed run can't touch the live map or the last good world copy. The render runs last on purpose: by then the backup is already saved, so a renderer crash can never cost a backup.

### Rendering only what changed

uNmINeD renders incrementally by default, redrawing only the regions that changed since the last run. An hour where nobody plays takes about 10 seconds end to end. A busy evening takes a few minutes. A full redraw, only needed after changing render settings, takes about 8 minutes.

That made one rule critical: **every render must use identical settings.** If one run forgot the shadows option, it would draw the areas that changed without shadows while leaving everything else shaded, and the map would slowly turn into a patchwork. So the settings live in exactly one place, a single Bash array in the update script.

uNmINeD also rewrites its web viewer files on every render, so the script re-applies my changes afterward: the page title, a custom favicon, and the script tag for live player markers.

### Live player positions

uNmINeD can export player positions for Java worlds, but its player option found nothing in our Bedrock world. So I built my own, using the server console:

- `list` returns the gamertags of everyone online.
- `querytarget` returns a player's exact position and dimension as JSON. Asked about everyone at once, it returns positions with internal IDs but no names, so my script asks about **each player by name** and pairs every answer with the name it asked for.

Every minute, a second timer on the host runs that script and pipes the result straight into the map container. I used a pipe instead of the file copy tool there, because each `pct push` and `pull` creates an entry in Proxmox's task log, and once a minute would bury anything important.

On the map container, a script turns the positions into map markers: a dot at the player's exact spot, their gamertag, and their X, Y and Z coordinates, each in their own color with a black outline so it reads on any terrain. Only players in the Overworld are shown, since Nether coordinates don't line up with this map. Position data older than 5 minutes is ignored, so if anything stops, the dots disappear instead of freezing in place.

In the browser, a small script I wrote downloads the marker list every 30 seconds and swaps in a fresh marker layer, adding the new one before removing the old so there's no flicker. It skips refreshes while the tab is in the background.

### Serving it

Caddy serves the map folder as plain HTTP on my home network. HTTPS ends at Cloudflare, and the last hop to Caddy travels over the LAN through my Cloudflare Tunnel, the same way my other self-hosted sites are published. Visitors can only reach files inside the map's web folder, never the world copy or backups next to it.

## Backups

Since the snapshot was already consistent and verified, I made it do double duty as a world backup. Every 6 hours (midnight, 6am, noon and 6pm), the update script keeps that hour's snapshot instead of deleting it. A cleanup step then keeps:

| Rule | Keeps |
|---|---|
| Recent | Every backup from the last 48 hours |
| Daily | The midnight backup from each of the last 14 days |
| Weekly | The Sunday midnight backup from each of the last 8 weeks |

That's about 30 copies, at roughly 140MB each. The cleanup only deletes files that match the automatic naming pattern, so it can only ever remove files it created itself. A backup I made by hand is safe from it.

The backups live on a different physical drive (NVMe) than the live world (SSD), so a single drive failure can't take out both. They don't protect against losing the whole host, which is why an offsite copy is on my to-do list.

## What broke and how I fixed it

### "Save hold" doesn't freeze everything

After my first manual snapshot, I compared each copied file against the lengths the server had listed. Two files were longer than the server had promised: the database's log file by about 40KB, and its table of contents (the MANIFEST) by a few hundred bytes.

I'd assumed `save hold` stopped all writes, so this looked like a contradiction. It doesn't stop everything. It promises two things: listed files won't be deleted or rewritten, and their first N bytes are final. Players are still playing, and their changes have to go somewhere, so the server keeps **appending** to the log and MANIFEST, which are append-only files.

The bytes past the listed length weren't garbage, they were newer changes from a later moment than the rest of the snapshot, and the last record could have been cut off mid-write by the copy. So the snapshot script trims every file to its listed length. Hold plus trim gives a clean snapshot; neither one alone does.

### Reading a stack trace

The very first render crashed near the end with `InvalidOperationException` thrown from a method called `GetJpegEncoder`. Reading the stack trace from the top told me where it broke: the code that saves tiles as JPEG, JPEG being the default format. The help output explained why. WEBP had three settings with defaults, JPEG had none, so the default path tried to read a setting nothing ever filled in. That release had come out the same day. Switching to WEBP fixed it, and lossless WEBP keeps blocky pixel art crisper than JPEG would anyway.

It was also an early reminder of why I pin the renderer's version: every current uNmINeD release is a development build, and I want upgrades to happen when I choose and test them, not overnight.

### The zoom change that didn't show up

I re-rendered with more zoom levels, but the map in my browser still wouldn't zoom in further, even after a hard refresh. On the server, the map's settings file said the new maximum zoom. Opening that same file through the public URL showed the old one.

Cloudflare was caching it. By default it caches files like `.js` at its edge based on their extension, and my web server wasn't sending any cache instructions. uNmINeD rewrites that settings file on every render, but Cloudflare had no way of knowing that.

The fix had to happen at the source, not just in Cloudflare. I added `Cache-Control` headers in Caddy: `no-cache` for the files that change on every render (which means "check with the server before reusing a copy," not "never store it"), and a 5 minute lifetime for map tiles. **Then** I purged the stale copy. Order matters: purge first, and Cloudflare could fetch the file again under the old rules and cache it all over again.

### Shadows that disappeared when I zoomed

After turning on shadows, they showed on the main view but vanished whenever I zoomed in. A private browser window showed shadows everywhere, which pointed at my browser's cache, not the server.

The pattern made sense once I understood it: a hard refresh only bypasses the cache for files the page loads during that refresh. Zooming loads different tiles, and those came from the normal cache, which still held flat ones. But they should have expired after 5 minutes. The cause was a Cloudflare setting, Browser Cache TTL, set to 4 hours, which **overrode** the headers I was sending and told browsers to keep everything for 4 hours. I changed it to respect existing headers, so the application, which knows which files change, decides.

### A purge that revealed a problem instead of causing one

At one point, purging Cloudflare's cache made shadows disappear from the main map. It looked like the purge broke something. Checking the Caddy config showed the real cause: the new config pointing at the shaded map had never been written, so Caddy was still serving the old, flat test folder. The purge just made Cloudflare fetch fresh copies of the wrong files. When something breaks right after an action, I now check whether the action caused it or only exposed it.

### Timestamps that lied

I needed to know whether uNmINeD rewrites its viewer files on every render, which decides whether a hand edit would survive. The files' modified times said 2024, which suggested they were never touched. But uNmINeD copies them out of a template and keeps the template's original dates.

Linux records a second timestamp, the change time (ctime), which the kernel updates on every write and no program can backdate. It showed the files were rewritten at the exact minute of the last render. So my changes to those files had to become a step in the script, not a one-time edit.

### Finding features the docs didn't mention

I wanted player names outlined so they'd read on any background. uNmINeD's marker documentation only lists a text color and font. But the viewer's JavaScript ships right next to the map, so I read the code that builds marker labels and found support for outlines, background boxes and padding that aren't documented anywhere.

Reading the code also saved me from a wrong assumption. The viewer has a function called `updateMarkersLayer()`, which sounded like exactly what live markers needed. In the code, it only shows or hides the existing layer. My refresh script uses the viewer's public layer-building function instead. Since these features are undocumented, they could change in any release, which is one more reason the renderer's version is pinned.

### Block textures that silently did nothing

My first texture test looked identical to the plain map. Two problems were hiding behind that.

First, the texture option needs a value (`--blockrender=true`). When it was the last option on the line, the renderer accepted it without complaint and quietly ignored it. Only when I added another option after it did it print "defined with a bad format." My lesson: check that an option actually took effect, not just that the command didn't error.

Second, even switched on, it had nothing to draw with. The release notes explained that block rendering now uses Java Edition's block models, even for Bedrock worlds, and needs a Java client JAR file. I downloaded it straight from Mojang's version manifest and verified it against the SHA-1 checksum Mojang publishes. That's a stronger check than recording my own checksum after downloading, which would only prove the file never changed later, not that I got the right file in the first place.

## Measuring before committing

Before each expensive change, I rendered a small square around spawn and scaled the result up to estimate the full cost:

| Change | Estimated | Actual |
|---|---|---|
| More zoom (zoom level 3) | 6 to 7 min, 150 to 200MB | 5.5 min, 206MB |
| Block textures at zoom 3 | 13 to 14 min, 500 to 700MB | 8 min, 327MB |

The first estimate landed close. The second overshot because the area around spawn has far more builds than an average patch of the world, so it wasn't a representative sample. Both estimates were still good enough to make the decision: each change fit well inside the hourly schedule and the job's 30 minute timeout, while a higher zoom level that would have cost 16 times the tiles didn't make the cut.

## Security and privacy decisions

- **Public on purpose:** the map is open to anyone with the link. Before publishing, I checked with my friends, since a public map shows where everyone's bases are, and with live dots, where they are right now.
- **Locked down first:** while building, the site sat behind Cloudflare Access. I confirmed the lock worked before deliberately switching it to public, since my existing Access rules only covered specific hostnames and a new one would have been open the moment it existed.
- **Least privilege:** the renderer runs as a dedicated user with no login shell that owns only the map's files. Caddy can read the website but can't write to it.
- **No new exposure:** the map is published through the existing tunnel, so no new ports were opened.
- **Licenses respected:** uNmINeD is free for personal use and may not be redistributed, and the same goes for Mojang's client JAR. My scripts can be shared; the programs they call are downloaded from their official sources.

## What's next

- **Test a restore** from a backup, and document the procedure.
- **Failure alerts:** post to a private Discord channel when a scheduled run fails, since today a failure is silent.
- **Separate the render into its own service**, so a render failure and a backup failure show up separately and neither can block the other.
- **Backups that catch up:** keep a backup whenever the newest one is 6 or more hours old, so a failed run at 6pm doesn't leave a 12 hour gap.
- **An offsite copy** of the backups, for the 3-2-1 rule.
