---
sidebar_position: 2
---

# Create a Document

Documents are __groups of pages__ connected through:

- a __sidebar**
- __previous/next navigation**
- __versioning**

## Create your first Doc

Create a Markdown file at `docs/hello.md`:

```md title="docs/hello.md"
# Hello

This is my __first Docusaurus document__!
```text

A new document is now available at [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello).

## Configure the Sidebar

Docusaurus automatically __creates a sidebar__ from the `docs` folder.

Add metadata to customize the sidebar label and position:

```md title="docs/hello.md" {1-4}
---
sidebar_label: "Hi!"
sidebar_position: 3
---

# Hello

This is my __first Docusaurus document__!
```text

It is also possible to create your sidebar explicitly in `sidebars.js`:

```js title="sidebars.js"
export default {
  tutorialSidebar: [
    "intro",
    // highlight-next-line
    "hello",
    {
      type: "category",
      label: "Tutorial",
      items: ["tutorial-basics/create-a-document"]
    }
  ]
}
```text
