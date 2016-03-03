** Note: This is not usable yet. Under development. None of these actually work. Et cetera. This readme is unfinished. Go away! Well maybe put on track and go away :3**

PostBoy
===
A simple tool to markup and prepare html mail.

Features
---

  - Nunjucks templating engine used. Also nunjucks-append, nunjucks-capture, nunjucks-date and nunjucks-markdown extensions used.
  - Nunjucks extensions introduced for easier tables fiddeling.
  - Links are wrapped with inner <span> element (for outlook styling, because it is kind of weird)
  - Short-hand links replacement (e.g. `<body bgcolor="#f0f">` will become `<body bgcolor="#ff00ff">`)
  - Inline styles from less/css file. Embed styles from other less/css file.
  - Pre-set styles for embedding/inlined (e.g. images with display:inline-block et cetera)

Recommendations
---

There are several rules that apply to email mark-up. Of course, if you want it to look good in most popular mailing clients.

  - Use tables for mail. Really. CSS is kind of broken mostly in 
  - It's HTML4. Because of outlook and stuff.
  - Specify image sizes. For god's sake.

Initialization and file structure
---

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
