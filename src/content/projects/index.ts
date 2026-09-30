// Card details for each project. The write-up itself lives in the matching .md file.
import proxmoxHomeLab from './proxmox-home-lab.md';
import windowsAdLab from './windows-ad-lab.md';
import minecraftBedrockServer from './minecraft-bedrock-server.md';
import photoGallery from './photo-gallery.md';
import browserDevEnvironment from './browser-dev-environment.md';

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status: 'Complete' | 'In Progress' | 'Planned';
  featured?: boolean;
  content: string; // URL of the bundled .md file
}

export const projects: Project[] = [
  {
    slug: 'proxmox-home-lab',
    title: 'Proxmox Home Lab and Secure Remote Access',
    summary:
      'A repurposed gaming PC running Proxmox VE 9 that hosts my lab and self-hosted services. Two network bridges keep the Windows lab on its own isolated network, and remote access goes through Cloudflare Tunnel behind Cloudflare Access instead of a VPN or open inbound ports.',
    tags: ['Proxmox VE', 'LXC', 'LVM-thin', 'Linux bridges', 'iptables NAT', 'Cloudflare Tunnel', 'Cloudflare Access'],
    status: 'Complete',
    featured: true,
    content: proxmoxHomeLab,
  },
  {
    slug: 'windows-ad-lab',
    title: 'Windows Server and Active Directory Lab',
    summary:
      'Two domain controllers and a member server on an isolated lab network, built hands-on alongside an AZ-802 course.',
    tags: ['Windows Server', 'Active Directory', 'Proxmox VE'],
    status: 'In Progress',
    content: windowsAdLab,
  },
  {
    slug: 'minecraft-bedrock-server',
    title: 'Minecraft Bedrock Server',
    summary:
      'A dedicated server for friends on Xbox and PC, running as a systemd service in an LXC container, with my own Bash DDNS updater keeping its DNS record current.',
    tags: ['Debian', 'LXC', 'systemd', 'Bash', 'Cloudflare API', 'DNS'],
    status: 'Complete',
    content: minecraftBedrockServer,
  },
  {
    slug: 'photo-gallery',
    title: 'Self-Hosted Photo Gallery',
    summary:
      'Lychee and MariaDB with Docker Compose, protected by Cloudflare Access plus the app\'s own login, with private albums and a shared family album.',
    tags: ['Docker Compose', 'Lychee', 'MariaDB', 'LXC', 'Cloudflare Access'],
    status: 'Complete',
    content: photoGallery,
  },
  {
    slug: 'browser-dev-environment',
    title: 'Browser-Based Dev Environment',
    summary:
      'VS Code in the browser with code-server, running under systemd in an LXC container and published through Cloudflare Tunnel behind Cloudflare Access.',
    tags: ['code-server', 'Debian', 'LXC', 'systemd', 'Cloudflare Tunnel', 'Cloudflare Access'],
    status: 'Complete',
    content: browserDevEnvironment,
  },
];

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug);
