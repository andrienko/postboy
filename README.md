** Note: This is not usable yet. Under development. None of these actually work. Et cetera. This readme is unfinished. Go away! Well maybe put on track and go away :3. But we already have a badass quote:**

> Ugly problems often require ugly solutions. Solving an ugly problem in a pure manner is bloody hard.
*Rasmus Lerdorf*

PostBoy
===
A simple tool to markup and prepare html mail.

Features
---

  - Nunjucks templating engine used. 
  - Nunjucks extensions introduced for easier tables fiddeling.
  - Pre-set styles for embedding/inlined (e.g. images with display:inline-block et cetera)

Workflow (how postboy prepares letters for delivery)
 
  - ***you type `postboy init` and get a basic email template with some stuff already set
  - ***compiles LESS files (`embed.less` and `inline.less`) if any***
  - compiles nunjucks template (`index.html` file). ***Postboy adds its own plugin for tables. Also nunjucks-append, nunjucks-capture, nunjucks-date and nunjucks-markdown extensions used.***
  - wraps all anchor elements with `<span>` tag for Outlook styling
  - inlines CSS styles from `inline.css`
  - embeds CSS styles from `embed.css`
  - replaces short-hand colors (`#333` becomes `#333333`)
  - ***adds image sizes***
  - *strips comments from HTML*

That is pretty much all.
The key features are [nunjucks template engine](https://mozilla.github.io/nunjucks/) (with plugins) and [juice](https://www.npmjs.com/package/juice).

Recommendations
---

There are several rules that apply to email mark-up. Of course, if you want it to look good in most popular mailing clients.

  - Use tables for mail. Really. CSS is kind of broken mostly in 
  - It's HTML4. Because of outlook and stuff.
  - Specify image sizes. Every single image size. For god's sake.

Initialization and file structure
---

To instsall postboy

    npm install -g postboy

To initialize the project type

    postboy init

This should create a couple folders with couple files in. All the sources will be contained within **source** folder.

    source/
    -- css/
       -- inline.css - contains css styles that will be inlined in
                       elements (if the file exists).
       -- embed.css - styles that will be embedded in <style> tag
                      under <head> section if it exists or at the end
                      of the file if it does not.
    -- common/
       -- layout.html - Main layout (html etc)
       -- macros.html - Macros file. If it exists it will be included
                        in all the files compiled by default.

To build the mail just type `postboy`. It will look for `postboy.js` file in a folder you typed it in.
    
