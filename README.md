# Photography Portfolio

A minimal Jekyll-based photography portfolio with progressive image loading and blur effects.

## Features

- **Two-column layout**: 1/3 navigation sidebar, 2/3 content area
- **Progressive image loading**: Images load with smooth blur-to-sharp transition
- **Responsive design**: Adapts to mobile and desktop screens
- **Smooth animations**: Elegant transitions and page loads
- **Full-width layout**: Uses entire browser width

## Structure

- **Homepage**: Displays first image from each project
- **Project pages**: Same layout, shows all project images and description

## Installation

```bash
bundle install
```

## Usage

### Development

```bash
bundle exec jekyll serve
```

Then visit `http://localhost:4000`

### Creating Projects

Add new project files to `_posts/` directory:

```markdown
---
layout: post
title: "Your Project Title"
date: 2025-10-29
images:
  - /path/to/image1.jpg
  - /path/to/image2.jpg
  - /path/to/image3.jpg
---

Your project description here...
```

### Customization

- Edit `_config.yml` to change site title
- Modify `assets/css/style.css` for styling changes
- Update `_layouts/default.html` to change layout structure

## Deploy

Push to GitHub and the site will automatically deploy via GitHub Pages.
