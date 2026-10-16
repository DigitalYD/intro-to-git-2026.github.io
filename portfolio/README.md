# Engineering portfolio template

A personal portfolio site for engineering students, in five styles: a green circuit board, a classic blueprint, a hybrid of the two (a circuit board drawn on blueprint paper), an MCU board where you're the chip in the middle, and a robot courier page where a drone, an RC car, a robot, or a radio tower brings each section. A slide switch in the top bar flips between them. Keep them all, or delete the ones you don't want. It's plain HTML, CSS, and JavaScript: nothing to install, no build step, and it runs free on GitHub Pages.

To make it yours, you edit two files and add your pictures:

| File | What's in it |
| --- | --- |
| `content/site.js` | Your name, intro, links, settings, and the sections of your page |
| `content/projects.js` | Your projects |
| `assets/images/` | Your photos and drawings |

You never have to touch the HTML.

---

## Quick start

1. **Fork** this repository: click **Fork** at the top right of its GitHub page.
2. **Clone** your fork to your computer:
   ```bash
   git clone https://github.com/YOUR-USERNAME/portfolio.git
   cd portfolio
   ```
3. **Open `index.html`** in your browser by double-clicking it. No server needed.
4. **Edit `content/site.js`.** Change `name: "Jordan Park"` to your name, save, and refresh the browser.
5. **Commit and push** the change:
   ```bash
   git add content/site.js
   git commit -m "Add my name"
   git push
   ```
6. **Publish** with GitHub Pages. In your repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, and click **Save**. A minute or two later your site is live at `https://YOUR-USERNAME.github.io/portfolio/`.

From then on, every `git push` updates the live site.

> **Tip:** Rename the repository to `YOUR-USERNAME.github.io` (under **Settings → General**) and your site moves to `https://YOUR-USERNAME.github.io/`, with nothing after the slash.

---

## What's in this folder

```text
portfolio/
├── index.html            The home page. Loads everything below; holds none of your info.
├── project.html          The page for one project: project.html?id=...
├── content/              ← the files you edit
│   ├── site.js           Your name, intro, links, settings, and sections
│   └── projects.js       Your projects
├── assets/
│   └── images/           Your pictures; project pictures go in images/projects/
├── css/
│   ├── tokens.css        Sizes every style shares: the type scale, spacing
│   ├── base.css          Page basics: text, links, the paper texture
│   ├── components.css    How each part is laid out, shared by every style
│   └── themes/           ← one file per style: its colors, fonts, and details
│       ├── circuit.css
│       ├── hybrid.css
│       ├── blueprint.css
│       ├── mcu.css
│       └── couriers.css
├── js/
│   ├── theme.js          Picks the style before the page draws; remembers the switch
│   ├── core.js           Shared helpers: text formatting, images, error messages
│   ├── layout.js         The header and style switch, the title block, page setup
│   ├── hero.js           Your name, your buttons, and the style's drawing
│   ├── art/              ← one drawing per style
│   │   ├── circuit.js    an oscilloscope
│   │   ├── hybrid.js     a fab drawing of a circuit board
│   │   └── blueprint.js  a flange in two views
│   ├── main.js           Builds the home page
│   ├── project-page.js   Builds a project page
│   ├── sections/         One file per section type (about.js, skills.js, ...)
│   └── modes/            ← styles that are whole pages of their own
│       ├── mcu.js        the MCU board
│       ├── parts.js      the circuit board parts the MCU board draws
│       ├── couriers.js   the drone, RC car, robot, and radio tower
│       └── modes.js      starts whichever one the switch picks
├── .editorconfig         Keeps indentation the same in every editor
├── .gitattributes        Keeps line endings the same on Windows, Mac, and Linux
├── .gitignore            Files git should never commit
└── .nojekyll             Tells GitHub Pages to serve the files exactly as they are
```

---

## How it works

Your content and the code that displays it live in separate files:

```text
content/site.js ──────┐
                      ├──▶ js/main.js ──▶ js/sections/<type>.js ──▶ the page you see
content/projects.js ──┘
```

First, `index.html` loads your two content files, which create two JavaScript objects, `SITE` and `PROJECTS`. (`site.js` loads early, in the `<head>`, so `js/theme.js` can read your style settings and switch on the right style before anything is drawn.) Next the page loads the engine in `js/`. Each file in `js/sections/` registers one **section type**: a function that turns a section's data into HTML. Last, `main.js` walks through `SITE.sections` from top to bottom, finds the renderer that matches each section's `type`, and puts the result on the page. The menu is built from the same list, so a new section gets a menu link automatically.

Styles work the same way. Every color, font, and style-specific detail is a CSS variable, and each file in `css/themes/` sets those variables inside its own `[data-theme="..."]` block. The switch changes a single attribute on the page, `data-theme`, and every part of the page follows.

Two styles go further. MCU and Couriers change how the page works, not just how it looks, so each has a script in `js/modes/` that builds a page of its own from the same `SITE` and `PROJECTS`, using the same section renderers. When the switch picks one of them, `js/modes/modes.js` hides the normal page and starts it. Pick any other style and the normal page comes back. Project pages always use the normal layout, in the chosen style's colors.

That separation is the point. You change content in one place, and the HTML, the menu, and the links update themselves. It also keeps your commits small and readable: "Add robot arm project" is a few lines in `projects.js`, not a hunt through HTML.

Everything loads with plain `<script>` tags (no JavaScript modules, no `fetch`). That's why the site works when you double-click `index.html`, and why GitHub Pages can serve it without a build step.

---

## Edit your info

Open `content/site.js`. Every setting has a comment above it. The main ones:

| Setting | What it does |
| --- | --- |
| `name` | Your name, at the top of the page and on the circuit board |
| `tagline` | The line above your name, between the measurement arrows |
| `intro` | One or two sentences under your name |
| `status` | Text next to the green light, like "Open to internships". `""` hides it and turns off the LED on the board. |
| `buttons` | Buttons under your intro. A `url` can be `#section-id`, a file, or a website. |
| `links` | Your email and profiles, listed in the Contact section |
| `revision`, `updated` | Shown in the title block at the bottom. Bump the letter after big updates, like a real drawing. |
| `repo` | Link to this repository, shown in the title block. `""` hides it. |
| `themes`, `theme`, `themeSwitcher` | Which styles the switch offers and which one shows first. See [Pick a style](#pick-a-style). |
| `tintPhotos` | `true` tints photos in the style's color; hovering shows the real colors |
| `animateHero` | `true` makes the board draw itself when the page opens |
| `heroImage` | Optional: your own picture in place of the board drawing |

**Add your résumé:** put your PDF at `assets/resume.pdf`, then delete the `//` at the start of the "Download résumé" line in `buttons`.

---

## Pick a style

The site comes with five styles. The slide switch in the top bar, labeled SW1 like a switch on a real board, flips between them and remembers each visitor's pick.

| Style | What it looks like | What's at the top |
| --- | --- | --- |
| `circuit` | Green solder mask, gold pads, black chips, white silkscreen | An oscilloscope with your name on its screen |
| `hybrid` | A circuit board drawn on blueprint paper | A fab drawing of a small board, with your initials on the chip |
| `blueprint` | White line work on blue grid paper, no copper | A flange in two views, with a part number made from your initials |
| `mcu` | A black circuit board with you as the chip in the middle | The whole page is the board: every section is a module you wire up to read |
| `couriers` | A dark robotics lab | Your photo and intro; a courier brings each section when it's picked |

Three settings near the top of `content/site.js` control them:

```js
themes: ["circuit", "hybrid", "blueprint", "mcu", "couriers"],  // the styles the switch offers, in this order
theme: "hybrid",                                               // the style visitors see first
themeSwitcher: true,                                           // false hides the switch
```

### The MCU and Couriers styles

These two build a page of their own from your content, so there's nothing extra to edit. Each has a few settings in `content/site.js`.

**MCU.** Every section in the menu becomes a module floating around the chip, and each project gets a module of its own. Click a module and a copper trace routes to it, it powers up, and its datasheet opens with that section. Your about section, and every section with `nav: false`, go in the chip's own datasheet, which opens when someone clicks your name.

```js
mcu: {
  mask: "black",        // board color it starts on: "black", "green", or "purple"
  maskPicker: true,     // false hides the board color picker in its top bar
  projectModules: 4,    // up to this many projects get a module each; more share one
},
```

**Couriers.** The page opens on your photo (from the about section), your intro, and your about text, with your `nav: false` sections below. Each section in the menu is a page of its own, and a courier brings it: it drops off the new page and carries the old one away. The browser's back and forward buttons send couriers too. Pick each section's courier with `courier:` in its block (`"drone"`, `"car"`, `"robot"`, or `"radio"`). Leave it out and one is picked by the section's type.

```js
couriers: {
  home: "robot",        // who brings the home page back
  deliveries: true,     // false starts with deliveries off (visitors can turn them on)
  speed: 1,             // 2 makes every delivery twice as fast
},
```

Visitors whose device asks for less motion get instant changes in both styles.

### Remove a style

Delete its name from `themes`. That's all it takes: it's gone from the switch, and nobody can pick it, even visitors who chose it before.

To lock in one style, leave just one name in `themes` and the switch disappears on its own. Setting `themeSwitcher: false` also hides the switch, but always shows the style in `theme`.

### Delete a style's files too

Taking a style out of `themes` is enough to remove it from the site. If you also want its files gone, every piece of a style is labeled `STYLE:` with its name:

| Style | Its look | Its script |
| --- | --- | --- |
| Circuit board | `css/themes/circuit.css` | `js/art/circuit.js` |
| Hybrid | `css/themes/hybrid.css` | `js/art/hybrid.js` |
| Blueprint | `css/themes/blueprint.css` | `js/art/blueprint.js` |
| MCU | `css/themes/mcu.css` | `js/modes/mcu.js` and `js/modes/parts.js` |
| Couriers | `css/themes/couriers.css` | `js/modes/couriers.js` |

1. Take its name out of `themes` in `content/site.js`.
2. Delete its files with `git rm`, so git records the deletion:
   ```bash
   git rm css/themes/blueprint.css js/art/blueprint.js
   ```
   For MCU that's `git rm css/themes/mcu.css js/modes/mcu.js js/modes/parts.js`.
3. Delete the lines that pointed to those files. Search for `STYLE: Blueprint` (or whichever style you're removing): one `<link>` line in `index.html`, one in `project.html`, and the `<script>` lines in `index.html` (one for most styles, two for MCU). Keep `js/modes/modes.js` either way; with no page styles left, it does nothing.

Refresh the page. If anything's missing, the browser console (F12) names the file.

### Make your own style

Copy a file in `css/themes/`, give it a new name like `neon.css`, and change the `[data-theme="..."]` at its top to `[data-theme="neon"]`. Add a matching line to the `<head>` of both HTML files, `<link rel="stylesheet" href="css/themes/neon.css" data-style="neon">`, then add `"neon"` to `themes` and change the colors. A drawing is optional; without a `js/art/neon.js`, the space next to your name stays empty.

A style that's a whole page of its own, like MCU or Couriers, is a bigger project. Start from a copy of `js/modes/couriers.js`: it registers itself in `Portfolio.modes` with a `start` function that builds its page and a `stop` function that removes it, and `js/modes/modes.js` does the rest.

---

## Add a project

Open `content/projects.js`. Each project is one block, from `{` to `},`. Copy a whole block, paste it where you want the card to appear, and change the details:

```js
{
  id: "robot-arm",                     // lowercase, dashes, no spaces, unique
  title: "Three-axis robot arm",
  summary: "One sentence about what it is and what you did.",
  image: "assets/images/projects/robot-arm.jpg",
  imageAlt: "The arm picking up a block",
  date: "Spring 2027",
  role: "Mechanical and firmware",
  tags: ["Arduino", "SolidWorks", "Inverse kinematics"],
  links: [
    { label: "Source code", url: "https://github.com/YOUR-USERNAME/robot-arm" },
  ],
},
```

Only `id`, `title`, and `summary` are required:

| Field | What it does |
| --- | --- |
| `image`, `imageAlt` | The card's picture, and a description of it for screen readers |
| `imageFit` | `"contain"` shows the whole picture instead of cropping it. Good for diagrams and screenshots. |
| `date`, `role` | Shown in the card's title block |
| `tags` | Tools and technologies |
| `links` | Buttons for code, demos, videos, or reports |
| `details` | A write-up. **Adding this gives the project its own page**, and the card links to it. |
| `gallery` | More pictures for the project page: `[{ src, alt, caption }]` |
| `hidden` | `true` hides the project without deleting it |

A project page lives at `project.html?id=your-project-id`, so you can send someone a link to just that project. Pages link to the previous and next project automatically.

To control which projects appear, add `show: ["id-one", "id-two"]` (only these, in this order) or `limit: 3` to the projects section in `site.js`.

---

## Add images

Put the file in `assets/images/`, or in `assets/images/projects/` for project pictures. Then point to it with a path that starts at the top folder, like `image: "assets/images/projects/robot-arm.jpg"`.

**Capital letters matter on GitHub Pages.** `Robot-Arm.JPG` and `robot-arm.jpg` are different files there, even when both work on your laptop. Use lowercase file names with dashes instead of spaces, and the problem never comes up.

Keep pictures small. Resize photos to about 1600 pixels wide; a few hundred KB each is plenty, and huge files make the page slow and the repository heavy. Use `.jpg` for photos, `.png` for screenshots, and `.svg` for drawings and diagrams. Write an `imageAlt` (or `alt`) for every picture: screen readers announce it, and it shows if the picture can't load.

If a path is wrong, the page shows a dashed red box with the exact path it couldn't find, so the typo is easy to spot.

**The photo tint.** With `tintPhotos: true`, photos on the home page are tinted in the style's paper color, like blue cyanotypes in the blueprint and hybrid styles and green in the circuit style, and hovering shows the real colors. Drawings (`.svg`) are never tinted, though the blueprint style shows them in white. Photos on project pages and in galleries always show their real colors. Set `tintPhotos: false` to turn the tint off everywhere.

**Pictures inside text.** In any text written between backticks, put `![A description](assets/images/photo.jpg)` on a line of its own. It becomes a figure, with the description as its caption.

---

## Add, remove, or reorder sections

Each section of your page, and each tab in the menu, is one block in the `sections` list in `content/site.js`. They appear in the order they're listed.

| To... | Do this |
| --- | --- |
| Reorder sections | Move a block up or down |
| Remove one | Delete the block, or add `hidden: true` to keep it for later |
| Keep one off the menu | Add `nav: false`. It stays on the page; only the menu link goes. |
| Shorten a menu label | Add `navLabel: "Research"` |
| Pick its courier in the Couriers style | Add `courier: "drone"` (or `"car"`, `"robot"`, `"radio"`) |
| Add a new one | Copy a block, give it a new `id` and `title`, and pick a `type` |

For example, a Research tab that uses the `text` type:

```js
{
  type: "text",
  id: "research",
  title: "Research",
  text: `
    I work in the **Power Electronics Lab** on GaN converters for EV chargers.
    My current project is a 1 kW bidirectional converter. [See the lab](https://example.com).
  `,
},
```

And a Coursework tab that uses the `list` type:

```js
{
  type: "list",
  id: "coursework",
  title: "Coursework",
  items: [
    { title: "ECE 3710: Microcontrollers", date: "Fall 2025", text: "Built a bare-metal scheduler for an ARM Cortex-M4." },
    { title: "ECE 4500: VLSI Design", date: "Spring 2026" },
  ],
},
```

The `id` becomes the section's web address (`yoursite.github.io/#research`), so keep it lowercase with no spaces, and different from every other section's `id`.

---

## Section types

| Type | What it looks like | Fields |
| --- | --- | --- |
| `about` | Photo, text, and a small spec table | `photo`, `photoAlt`, `text`, `facts: [["Label", "Value"]]` |
| `skills` | One chip per group, drawn like a DIP chip with a skill on each pin | `groups: [{ name, skills: [...] }]` |
| `projects` | Cards from `content/projects.js` | `show`, `limit` (both optional) |
| `timeline` | A drawing's revision table. List newest first; letters are added for you. | `items: [{ date, title, org, url, text }]` |
| `list` | Simple rows for awards, coursework, publications, clubs | `items: [{ title, subtitle, date, text, url }]` |
| `gallery` | A grid of pictures with numbered captions | `images: [{ src, alt, caption }]` |
| `text` | A heading and some writing | `text` |
| `contact` | A connector with one pin per link | `text`, and `links` (uses your main `links` if left out) |

Every section also takes `type`, `id`, `title`, `navLabel`, `nav`, and `hidden`.

---

## Formatting text

Text written between backticks ( `` ` `` ) can use these:

| Write | To get |
| --- | --- |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | `code` |
| `[link text](https://example.com)` | a link |
| `- ` at the start of lines | a bulleted list |
| `## ` at the start of a line | a small heading |
| `![description](assets/images/photo.jpg)` on its own line | a picture with a caption |
| An empty line | a new paragraph |

---

## Make a new section type

When none of the eight types fits, make your own. Here's a `quotes` type for recommendations from professors or managers.

**1. Create `js/sections/quotes.js`:**

```js
(function () {
  "use strict";

  const { esc } = window.Portfolio.util;

  // Receives this section's data from site.js and returns its HTML.
  window.Portfolio.sections.quotes = function (section) {
    const items = section.items || [];
    return `<div class="quotes">${items.map((quote) => `
      <blockquote class="quote">
        <p>${esc(quote.text)}</p>
        <footer>${esc(quote.name)}, ${esc(quote.role)}</footer>
      </blockquote>`).join("")}</div>`;
  };
})();
```

Wrap anything that comes from your content in `esc()`. It makes characters like `<` and `&` display as typed instead of breaking the page. `Portfolio.util` also has `md()` for formatted text and `img()` for pictures; the other files in `js/sections/` show how to use them.

**2. Load it** in `index.html`, with the other section types and before `js/main.js`:

```html
<script src="js/sections/quotes.js"></script>
```

**3. Style it** at the end of `css/components.css`:

```css
.quotes { display: grid; gap: 1.5rem; max-width: 46rem; }
.quote { margin: 0; padding-left: 1.25rem; border-left: 2px solid var(--copper); }
.quote p { margin: 0 0 0.5rem; font-size: 1.1rem; }
.quote footer { color: var(--ink-soft); font-family: var(--font-mono); font-size: var(--step--1); }
```

**4. Use it** in `content/site.js`:

```js
{
  type: "quotes",
  id: "recommendations",
  title: "Recommendations",
  items: [
    { text: "Jordan found the bug in our motor controller faster than anyone.", name: "Dr. Lee", role: "ECE 3720 instructor" },
  ],
},
```

The color and font variables like `var(--copper)` come from the style files in `css/themes/`, so the new section matches whichever style is on, and changes when the switch does.

---

## Change colors and fonts

Each style's colors and fonts live in its own file in `css/themes/`, inside a block like `[data-theme="circuit"] { ... }`. Change a value there and it changes everywhere in that style. Sizes every style shares, like the type scale and page width, are in `css/tokens.css`.

In the MCU style, every color comes from the board's solder mask, so change the mask colors at the top of `css/themes/mcu.css`.

`--paper` is the page, `--ink` is text and line work, and `--copper` is everything you can click. The circuit and hybrid styles follow one rule: copper means "live". Links, buttons, traces, and pins are copper; everything else is drawn in ink. The blueprint style sets `--copper` to white, which is why it has no copper at all. Keep to the rule when you add things and they'll look like they belong.

The fonts are [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) for headings; [B612](https://fonts.google.com/specimen/B612) (Airbus designed it for cockpit displays) and B612 Mono in the hybrid and blueprint styles; and [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) and IBM Plex Mono in the circuit, MCU, and Couriers styles. To swap one, pick a font on [Google Fonts](https://fonts.google.com), add it to the font `<link>` in the `<head>` of both `index.html` and `project.html`, and change the matching `--font-` variable in the style's file.

---

## Troubleshooting

### The page shows a red box

A content file has a typo. The box names the file, and on GitHub Pages or any web server it also gives the line number. The usual cause is a missing comma at the end of the line *above* the one it mentions, or a quote that was opened and never closed.

When you open `index.html` by double-clicking it, browsers hide the line number. Press **F12**, choose **Console**, and the error there includes it. If you're still stuck, `git diff` shows exactly what you changed since your last commit.

### A section says "There's no section type called..."

The section's `type` is misspelled. The box lists the types you can use.

### A picture shows "Image not found"

The path under it doesn't match a file. Check the spelling, the folder, and the capital letters.

### It works on my computer but not on GitHub Pages

It's almost always capital letters in a file name; see [Add images](#add-images). The other usual cause is a file that was never committed. Run `git status` to check.

### My changes don't show up

Save the file, then refresh. If that doesn't do it, hard-refresh with **Ctrl+Shift+R** (Windows and Linux) or **Cmd+Shift+R** (Mac). After a `git push`, GitHub Pages takes a minute or two to update; the **Actions** tab of your repository shows its progress.

### My GitHub Pages site shows a 404

Give it a couple of minutes after you turn Pages on. Then check **Settings → Pages**: the branch should be `main`, the folder `/ (root)`, and `index.html` should be in the top folder of the repository. On a fork, open the **Actions** tab once and enable workflows if GitHub asks, then push any small commit.

### The switch still shows a style I removed

Make sure you saved `content/site.js`, then hard-refresh (see above). Saved visitor choices are dropped once a style is gone, so no one gets stuck on it.

### A style shows up with the wrong colors

Its stylesheet isn't loading. Check that `css/themes/<name>.css` exists and that its `STYLE:` line is still in both `index.html` and `project.html`. If you meant to delete the style, take its name out of `themes` too.

### The MCU or Couriers style shows the normal page

Its script isn't loading, or it stopped with an error, so the page fell back to the normal layout in that style's colors. Check that its file is in `js/modes/` and that its `STYLE:` lines are still in `index.html`, then look in the browser console (F12) for the error.

### A menu link doesn't go anywhere

Two sections probably have the same `id`, or the section is `hidden`. The browser console warns you about duplicate ids.

### The fonts look different offline

The fonts load from Google Fonts. Without internet, the site falls back to your computer's fonts. Everything still works; it just looks plainer.

---

## Practice git with this repo

1. **First commit.** Change your `name` and `tagline`, then `git add`, `git commit`, and `git push`, and watch the live site update.
2. **A branch per feature.** Run `git switch -c add-robot-arm`, add a project, commit, and push the branch. Open a pull request and merge it on GitHub, then run `git switch main` and `git pull`. Watch out: on a fork, GitHub suggests sending the pull request to the original template repository. Change the **base repository** to your own fork.
3. **Break it, then fix it.** Delete a comma in `content/site.js` and refresh to see the red box. Use `git diff` to find what changed, then `git restore content/site.js` to undo it.
4. **A merge conflict on purpose.** Make two branches that each change `tagline` to something different. Merge one into `main`, then the other, and resolve the conflict.
5. **A new section type.** Build the `quotes` type from [Make a new section type](#make-a-new-section-type) on its own branch.
6. **Choose your style for good.** On a branch, take the styles you don't want out of `themes`, then delete their files with `git rm` (see [Delete a style's files too](#delete-a-styles-files-too)). Check `git status` and `git diff --staged` before you commit, and merge once the site still works.
7. **Tag a release.** When your portfolio is ready to share, bump `revision` in `site.js`, commit, then run `git tag v1.0` and `git push --tags`.

---

## For instructors

Before sharing the template, put your name or course in `LICENSE`, and swap in your own example content if you like.

**Fork or template?** Forking keeps a link back to your repository. Students can pull in template fixes later (`git remote add upstream <your repo URL>`, then `git pull upstream main`), but their pull requests default to targeting your repository. If you'd rather each student get an independent copy, turn on **Settings → General → Template repository**; students then click **Use this template** instead of **Fork**.

Students can keep the style switch, or commit to one style with exercise 6. If you'd rather everyone start from a single style, trim `themes` before you share the template.

Exercise 3 works best when students open the site through a local server, which makes the red box show the exact line number. VS Code's Live Server extension does this, as does `python3 -m http.server` run in the repository folder.

---

## License

The template code is under the MIT License; see `LICENSE`. Your words and your pictures are yours.
