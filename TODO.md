# TODO

- changing filters should not cause torrents to be seen

- maybe deprioritize the "Make Default" button. this feels like a rare thing and
  is destructive.

- saved tag sets

- Min/max size of torrent. update: this is actually not trivial for what i want.

  the size +- range format on Emp is user-hostile. min/max size is more user-friendly.
  therefore, we need to have mapping functions between the two:

  i like PCPartPicker's styling for this.
  https://pcpartpicker.com/products/internal-hard-drive/ it's a slider with two
  handles, logarithmic scale, and labels for each handle. they only use GB,
  which i think is fair and simplifies the UI and conversions.

  - from size +- range to min/max size:
    - let size = convertToGiB(size, unit);
    - let range = convertToGiB(range, unit);
    - let min = size - range
    - let max = size + range
  - from min/max size to size +- range, where min and max are optionally defined:
    - let max = max ?? 5120 GiB (current biggest is ~1.5 TiB, so this is good
      default)
    - let min = min ?? 0 GiB
    - size = (max + min) / 2
    - range = (max - min) / 2

  note that this is probably a lossy transformation. round to a reasonable
  number depending on the magnitude

  also note that we can determine if these values are filled from the search form

- add feature cards to www page. the original forum post is uneditable and only
  mentions a subset of the features.

- fix architecture: we're doing all sorts of crazy shit all over like awaiting
  promises, global stores, etc. i feel like the search page component should
  make setcontext a store, and components just pull from it. flesh this idea
  out. many components are dealing with app-wide concerns instead of
  component-specific concerns.
