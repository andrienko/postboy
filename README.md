> Ugly problems often require ugly solutions. Solving an ugly problem in a pure manner is bloody hard.
>
> -- *Rasmus Lerdorf*

PostBoy
===
Postboy is a simple tool to markup and prepare html mail. It utilizes
[nunjucks templates](https://mozilla.github.io/nunjucks/) (with plugins) for building markup and
[juice](https://www.npmjs.com/package/juice) for inlining CSS.

**Note: This is unstable. The readme is unfinished. Go away!
Well maybe put on track and go away :3. The behavior and API may and will change over time.
Probably the entire thing will be rewritten after I make sure the tool has everything I need it to.**

**In future I hope to finish my own HTML parser and use it in postboy, until then the entire thing is a set of 
workarounds and ugly solutions.**

Features
---

Features not yet implemented are ***bold-italic***. Ones implemented partially or terribly unstable are *italic*

  - Nunjucks templating engine used. 
  - Nunjucks extensions introduced for easier tables fiddeling.
  - Pre-set styles for embedding/inlined (e.g. images with display:inline-block et cetera)
  - ***ability to watch files for changes and compile them***
  - *you can setup an SMTP server to send test e-mails*

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
  - *strips comments from HTML*

Sending test e-mails via SMTP
---

If you have an access to some kind of a SMTP server - you can use `postboy send` to send an email to some destination.
To do this - add `send` key in your pstboy.config.js:


    send:{
      to: 'ilia@andrienko.org',
      server: 'mail.adm.tools',
      port: 25,
      login: 'noreply@server.com',
      password: 'someKindOfPasswordHere',
      subject: 'Test mail',
      from: 'Postboy <noreply@server.com>'
    }

SMTP `server`, `login` and `password` are required, as well as `to`, which is is the address that the mails will be sent
to. By default, `subject` will be current date and `port` will be 25, `from` will be "Postboy".

Sending test e-mails via gmail
---
Config must be same as with SMTP, but do not specify the "server" field and "login" field must be a gmail email
(e.g., test.mailer.postboy@gmail.com or something like that).

You may also need to  [allow less secure apps](https://myaccount.google.com/u/2/lesssecureapps) in your gmail account,
gmail itself will give you the instructions as you try to send first email if it fails.

Plans
---

  - fix empty tags (empty tags are now turning into self-closing)
  - add self-closing tags
  - move entities decoding to the end of workflow
  - sending via gmail or whatever nodemailer is capable of
  - Beautifies HTML
  - Validates XML for all your XSLT needs
  - Archives the templates
  - Produces different versions of templates
  - Watcher
  - Image sizes
  - integrate this: https://github.com/dudeonthehorse/normalize.email.css

Recommendations
---

There are several rules that apply to email mark-up. Of course, if you want it to look good in most
popular mailing clients.

  - Use tables for mail. Really. CSS is kind of broken mostly in mailers.
  - It's HTML4. Because of outlook and stuff.
  - Specify image sizes. Every single image size. For god's sake.
  - Use inline styles. Gmail strips all styles but inline ones.
  - ...

Okay, I think the recommendations would require me to write the entire article. Or a book maybe.
Probably one day I will.

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
    
