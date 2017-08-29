> Ugly problems often require ugly solutions. Solving an ugly problem in a pure manner is bloody hard.
>
> -- *Rasmus Lerdorf*

PostBoy
===
Postboy is a simple tool to markup and prepare html mail. It utilizes
[nunjucks templates](https://mozilla.github.io/nunjucks/) (with plugins) for building markup and
[juice](https://www.npmjs.com/package/juice) for inlining CSS.

**Note: This is not usable yet. Under development. None of these actually work. Et cetera. Also the
readme is unfinished. Go away! Well maybe put on track and go away :3. The behavior may and will change!
Probably the entire thing will be rewritten after I make sure the tool has everything I need it to.**

**In future I hope to finish my own HTML parser and use it in postboy**

Features
---

Features not yet implemented are ***bold-italic***. Ones implemented partially or terribly unstable are *italic*

  - Nunjucks templating engine used. 
  - Nunjucks extensions introduced for easier tables fiddeling.
  - Pre-set styles for embedding/inlined (e.g. images with display:inline-block et cetera)
  - ***ability to watch files for changes and compile them***
  - ***you can setup an SMTP server to send test e-mails***

Workflow (how postboy prepares letters for delivery)
 
  - you type `postboy init` and get a basic email template with some stuff already ses
  - compiles LESS files (`embed.less` and `inline.less`) if any
  - compiles nunjucks template (`index.html` file). ***Postboy adds its own plugin for tables. Also nunjucks-append, nunjucks-capture, nunjucks-date and nunjucks-markdown extensions used.***
  - merges styles and classes. So duplicate class and style attributes are fine (for ease of nunjucks use)
  - *wraps all anchor elements with `<span>` tag for Outlook styling*
  - replaces html symbol entities with unicode representation (`&nbsp;` becomes `&#xA0;`)
  - inlines CSS styles from `inline.css`
  - removes CSS classes
  - embeds CSS styles from `embed.css`
  - *replaces short-hand colors (`#333` becomes `#333333`)* (may be unstable)
  - replaces short-hand CSS properties 
  - ***adds image sizes***
  - *strips comments from HTML*
  - ***Beautifies HTML***
  - ***Validates XML for all your XSLT needs***
  - ***Archives the templates***
  - ***Produces different versions of templates***

That is pretty much all.

Recommendations
---

There are several rules that apply to email mark-up. Of course, if you want it to look good in most
popular mailing clients.

  - Use tables for mail. Really. CSS is kind of broken mostly in mailers.
  - It's HTML4. Because of outlook and stuff.
  - Specify image sizes. Every single image size. For god's sake.
  - Use inline styles. Gmail strips all styles but inline ones.

Initialization and file structure
---

To instsall postboy

    npm install -g postboy

To initialize the project type

    postboy init

This should create a couple folders with couple files in. All the sources will be contained within
**source** folder.

***!!!THE FOLDER STRUCTURE IS DIFFERENT NOW!!!***

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
    
