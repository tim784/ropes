# TODO

- put images (gifs?) in the README

- finish reworking the mounting:

  - make sure all our CSS is inside our components. leave no trace.
  - mess with emitCss on svelte. does this even do anything?
  - have the cssInjectedByJsPlugin inject CSS on a data attribute on some element.
    - actaully first, verify if we even need this with emitCss.
  - maybe don't clear other CSS and just be more strict about resets in our
    `app.css`.

- consider using filters from NSE, or write my own. doesn't look too hard.

- small-screen search layout is different between dev and production:
  - dev form takes full width
  - production form is less than full width, left-justified

- when clearing the search form (via button or manually), we should be
  submitting an _empty_ search, not going to the default search. i think the
  difference is that, strangely, empornium considers a lack of `taglist` query
  parameter to mean to go to the default search, while a present but empty one
  means to search for everything.

- maybe deprioritize the "Make Default" button. this feels like a rare thing and
  is destructive.

- make download button smaller? 