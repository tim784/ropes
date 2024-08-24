# TODO

- consider using filters from NSE, or write my own. doesn't look too hard.

- collapse duplicates. Just start by identifying torrents with the same image
  src.

- when clearing the search form (via button or manually), we should be
  submitting an _empty_ search, not going to the default search. i think the
  difference is that, strangely, empornium considers a lack of `taglist` query
  parameter to mean to go to the default search, while a present but empty one
  means to search for everything.

- maybe deprioritize the "Make Default" button. this feels like a rare thing and
  is destructive.

- Min/max size