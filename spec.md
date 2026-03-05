# Future Fashion Textile

## Current State
New project. No existing codebase.

## Requested Changes (Diff)

### Add
- Professional landing page for "Future Fashion Textile" brand
- Hero section with brand name and tagline
- About section introducing the textile design studio
- Print Pattern Design services section showcasing offerings
- Portfolio/gallery section displaying print pattern work (sample content)
- Contact form for clients to reach out (name, email, message, submit)
- Contact messages stored in backend, viewable in admin panel
- Admin panel (login-protected) to manage portfolio projects and view contact messages
- Navigation bar with smooth scroll links
- Footer with brand info and contact details

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend:
   - Authorization module for admin login
   - Portfolio projects CRUD (title, description, category, imageUrl)
   - Contact messages store (name, email, message, timestamp, read status)
   - Public queries: getProjects, getServices
   - Admin queries: getMessages, markMessageRead, addProject, updateProject, deleteProject

2. Frontend:
   - Navbar with brand logo/name and nav links
   - Hero section: brand name "Future Fashion Textile", tagline, CTA button
   - About section: studio introduction
   - Services section: Print Pattern Design offerings (custom patterns, fabric prints, repeat patterns, color variations)
   - Portfolio gallery: grid of pattern design cards with image, title, description
   - Contact section: form with name, email, message fields and submit button
   - Admin panel: protected route with login, projects management table, messages inbox
   - Responsive design throughout
