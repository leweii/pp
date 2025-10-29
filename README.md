# Photography Portfolio

A minimal Jekyll-based photography portfolio with progressive image loading, blur effects, and CDN support.

## Features

### Desktop
- **Two-column layout**: 1/3 navigation sidebar, 2/3 content area (vertical scroll)
- **Progressive image loading**: Images load with smooth blur-to-sharp transition
- **Full-width layout**: Uses entire browser width

### Mobile
- **Horizontal tab navigation**: Projects displayed as swipeable tabs at the top
- **Horizontal scroll galleries**: Swipe left/right through images
- **Scroll snap**: Smooth snapping to each image
- **Touch-optimized**: Native swipe gestures with momentum scrolling
- **Auto-scroll active tab**: Currently selected project scrolls into view

### All Devices
- **CDN support**: Seamlessly works with CDN-hosted images
- **Flexible URL configuration**: Support for custom domains and subpaths
- **Progressive blur loading**: Smooth blur-to-sharp image transitions
- **Responsive design**: Optimized layouts for desktop, tablet, and mobile

## Installation

```bash
bundle install
```

## Configuration

### URL Configuration

Edit `_config.yml` to configure your site URL and baseurl:

#### For Root Domain
```yaml
url: "https://yourdomain.com"
baseurl: ""
```

#### For Subdirectory
```yaml
url: "https://yourdomain.com"
baseurl: "/portfolio"
```

#### For GitHub Pages
```yaml
url: "https://username.github.io"
baseurl: "/repo-name"
```

### CDN Configuration

Configure your CDN base URL in `_config.yml`:

```yaml
cdn_url: "https://cdn.yourdomain.com"
# or
cdn_url: "https://your-bucket.s3.amazonaws.com"
# or
cdn_url: "https://your-cdn.cloudfront.net"
```

The site automatically handles three types of image paths:

1. **Full URLs** - Used as-is (e.g., `https://example.com/image.jpg`)
2. **CDN relative paths** - Prefixed with `cdn_url` (e.g., `projects/image.jpg`)
3. **Site relative paths** - Used for local images (e.g., `/assets/images/photo.jpg`)

## Usage

### Development

```bash
bundle exec jekyll serve
```

Then visit `http://localhost:4000` (or `http://localhost:4000/your-baseurl/` if baseurl is set)

### Creating Projects

Add new project files to `_posts/` directory:

#### Using Full URLs
```markdown
---
layout: post
title: "Your Project Title"
date: 2025-10-29
images:
  - https://cdn.example.com/image1.jpg
  - https://cdn.example.com/image2.jpg
---

Your project description here...
```

#### Using CDN Relative Paths
Set `cdn_url` in `_config.yml`, then use relative paths:

```markdown
---
layout: post
title: "Your Project Title"
date: 2025-10-29
images:
  - projects/urban-landscapes/image1.jpg
  - projects/urban-landscapes/image2.jpg
  - projects/urban-landscapes/image3.jpg
---

Your project description here...
```

#### Using Local Images
```markdown
---
layout: post
title: "Your Project Title"
date: 2025-10-29
images:
  - /assets/images/photo1.jpg
  - /assets/images/photo2.jpg
---

Your project description here...
```

### CDN Setup Examples

#### AWS S3 + CloudFront
```yaml
cdn_url: "https://d1234567890.cloudfront.net"
```

#### Custom CDN Domain
```yaml
cdn_url: "https://cdn.yoursite.com"
```

#### Direct S3 Bucket
```yaml
cdn_url: "https://your-bucket.s3.amazonaws.com"
```

### Customization

- **Site title**: Edit `title` in `_config.yml`
- **Styling**: Modify `assets/css/style.css`
- **Layout**: Update `_layouts/default.html`
- **Blur intensity**: Change `blur(20px)` in `assets/css/style.css:148`
- **Transition speed**: Adjust `0.8s` in `assets/css/style.css:149`

## Project Structure

```
├── _config.yml          # Site and CDN configuration
├── _includes/
│   └── image-url.html   # Smart image URL handler
├── _layouts/
│   ├── default.html     # Two-column layout wrapper
│   └── post.html        # Project page template
├── _posts/              # Your photography projects
├── assets/
│   ├── css/style.css    # Styling with blur effects
│   └── js/script.js     # Image loading & animations
└── index.html           # Homepage gallery
```

## Deploy

### GitHub Pages

1. Ensure `url` and `baseurl` are correctly set in `_config.yml`
2. Push to GitHub
3. Site will automatically deploy via GitHub Actions

### Custom Domain

1. Set your domain in `_config.yml`:
   ```yaml
   url: "https://yourdomain.com"
   baseurl: ""
   ```
2. Deploy to your hosting provider
3. Point your domain to the hosting server

## Image Optimization Tips

For best progressive loading experience:

1. **Use optimized images** - Compress images before uploading to CDN
2. **Consistent aspect ratios** - Helps with layout stability
3. **Reasonable file sizes** - 500KB-2MB per image recommended
4. **CDN with compression** - Use a CDN that supports automatic image optimization
5. **Multiple formats** - Consider WebP with fallbacks for better performance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Progressive image loading uses Intersection Observer API with fallback for older browsers.
