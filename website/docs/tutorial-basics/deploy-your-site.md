---
sidebar_position: 5
---

# Deploy your site

Docusaurus is a __static-site-generator__ (also called __[Jamstack](https://jamstack.org/)__).

It builds your site as simple __static HTML, JavaScript and CSS files__.

## Build your site

Build your site __for production__:

```bash
npm run build
```text

The static files are generated in the `build` folder.

## Deploy your site

Test your production build locally:

```bash
npm run serve
```text

The `build` folder is now served at [http://localhost:3000/](http://localhost:3000/).

You can now deploy the `build` folder __almost anywhere__ easily, __for free__ or very small cost (read the
**[Deployment Guide](https://docusaurus.io/docs/deployment)__).
