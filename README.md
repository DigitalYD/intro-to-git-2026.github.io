# Engineering portfolio

The website lives in the [`portfolio`](portfolio/) folder. The full guide to editing it, with every setting explained, is [`portfolio/README.md`](portfolio/README.md).

## How this repository is laid out

```text
├── index.html     The launcher. The site's main address opens it, and it
│                  sends visitors straight to portfolio/.
├── .nojekyll      Tells GitHub Pages to publish the files exactly as they are.
├── README.md      This page.
└── portfolio/     The website. Everything you edit is in portfolio/content/.
```

## Publish it with GitHub Pages

1. Open **Settings › Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the **main** branch and the **/ (root)** folder, then click **Save**.

A few minutes later the site is live. Its address depends on the repository's name:

| Repository name | Site address |
| --- | --- |
| Exactly `your-username.github.io` | `https://your-username.github.io/` |
| Anything else, even if it ends in `.github.io` | `https://your-username.github.io/repository-name/` |

Either way, the launcher sends visitors on to `portfolio/`.

## Change where the launcher goes

Open `index.html` and change `"portfolio/"` in the two places marked `LAUNCH TARGET`. To show the launcher page with a button instead of opening the portfolio right away, set `AUTO_OPEN` to `false`. The page then shows your name and tagline from `portfolio/content/site.js`.
