# uLace – Homepage & PDP

Static, responsive build of the uLace homepage and the uLace Classic – Black product page. No build step.

## Folder structure

```
ulace-website/
├── index.html            Homepage  →  /
├── classic-black.html    PDP       →  /classic-black
├── vercel.json           Vercel settings (clean URLs, image caching)
├── README.md
└── assets/               All images – keep this folder next to the HTML files
    ├── ulace-logo.png, shark-tank-callout.png
    ├── hero-family.webp, founder.webp, promo-stairs.webp
    ├── size-classic.webp, size-kiddos.webp, size-slims.webp, size-shorts.webp
    ├── pdp/        classic-black-1…5.webp (product gallery)
    ├── press/      9 press logos
    └── swatches/   5 patterned colour swatches
```

## Deploy

1. Push this whole folder (all files and the `assets` folder) to the branch.
2. In Vercel, import the repo and select the branch.
3. Framework preset: **Other**. Leave Build Command and Output Directory empty.
4. If this folder is not the repo root, set Vercel's **Root Directory** to `ulace-website`.
5. Deploy.

Tested at 375, 768, 1024, 1368, 1440 and 1920 px wide.
