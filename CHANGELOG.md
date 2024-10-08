# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and, while this project adheres to [Semantic
Versioning](https://semver.org/spec/v2.0.0.html), we only ever increment the
major version number.

The types of changes are:

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## [17.0.0](https://github.com/tim784/ropes/commits/v17.0.0) - 2024-09-29

### Added

- The Home page is now accessible from the navigation menu under "Site General".

### Fixed

- Navigating to your default search with the button in the search form should no
  longer cause the taglist flash with an empty list.
- Torrents no longer become "Seen" after toggling filters on or off.
- All torrents in groups now become seen when they scroll into the viewport,
  versus just the currently-selected one.

### Changed

- Non-user-facing: The torrent grouping algorithm is now simpler and more
  extensible.

## [16.0.0](https://github.com/tim784/ropes/commits/v16.0.0) - 2024-09-25

### Changed

- Whether a filter is enabled/disabled is now per-tab state instead of being
  shared amongst all tabs. Additionally, you can now set which filters are on by
  default in the Filters modal.
- The Filter modal now provides better feedback about errors in filter
  configuration, such as notifying when a tag is simultaneously in the Include
  and Exclude lists.
- Turning on SFW Mode now immediately destroys the old image element for faster
  swapping.

### Fixed

- The paginator at the top and bottom of the results section no longer shows an
  ellipsis when it's not needed.

## [15.0.0](https://github.com/tim784/ropes/commits/v15.0.0) - 2024-09-23

### Changed

- The results heading now uses a clearer format to describe the number of
  torrents shown.

### Fixed

- The page title now properly reverts to its original value when coming back
  from SFW Mode.
- The size inputs no longer attempt to autocomplete with previously entered
  values.

## [14.0.0](https://github.com/tim784/ropes/commits/v13.0.0) - 2024-09-22

### Fixed

- The search form is now responsive to changes in the current page's query
  parameters and search FormData. Specifically, when you press the button to go
  to your default search, the taglist will update as expected.

## [13.0.0](https://github.com/tim784/ropes/commits/v13.0.0) - 2024-09-22

### Added

- The search form now supports limiting the size of torrent results.
- Clicking on a torrent image now nagivates to that torrent's page. Expanding
  the torrent image is still possible by clicking the icon in the top-right.
- Taglist parsing provides better errors and warnings.

### Changed

- The default build is, again, minified, which should provide a slight
  performance benefit. Additionally, you can now download an unminified build
  from [the website](https://ropes.win/) if you run into issues and want
  better log output.
- Many non-user-facing changes:
  - Simplified how page state is managed
  - Used more (Svelte) framework features to reduce boilerplate
  - Did many, many other small things

## [12.0.0](https://github.com/tim784/ropes/commits/v12.0.0) - 2024-09-01

### Added

- Torrents in search results can now be filtered by their tags. A filter has an
  Exclude List and an Include List, both of which are optional.

  - A torrent with at least one tag in the Exclude List will not be shown.
  - A torrent with at least one tag in the Include List will be shown. Exclusion
    happens before over inclusion.

  Multiple filters can be toggled on, which combines their effects.

  Filters are configured from the "Configure Filters" button at the top of the results
  page.

### Fixed

- Components that use a "portal" (a way to put elements in some other part of
  the document) now work properly through loads and unloads of Ropes.

## [11.0.0](https://github.com/tim784/ropes/commits/v11.0.0) - 2024-08-27

### Changed

- Torrent grouping is now more robust against some edge cases.
- The "See Tags" button got some additional styles for consistency with other
  popovers.

### Fixed

- In the search form, the "Clear Tags" and "Clear All" buttons now actually
  clear the tags instead of taking users to their default search.

## [10.0.0](https://github.com/tim784/ropes/commits/v10.0.0) - 2024-08-26

### Added

- Torrent variations are now grouped (such as resolution, encoding, container).
  This means that if a torrent has multiple variations, then buttons for each
  will be displayed on a single torrent card. See the details of the group
  algorithm
  [here](https://github.com/tim784/ropes/blob/master/src/lib/torrent.ts).

### Fixed

- The Settings modal's close button now always works.

## [9.0.0](https://github.com/tim784/ropes/commits/v9.0.0) - 2024-08-24

### Added

- Most icons now have a tooltip that describes their function.

### Fixed

- The Scroll to Top button no longer blocks content underneath it.

## [8.0.0](https://github.com/tim784/ropes/commits/v8.0.0) - 2024-08-24

### Fixed

- Allow the search form to take up the full width of the screen for small screen
  widths.
- Revert some work on screen viewport breakpoints that caused jerky layout-shift
  when resizing the window.

### Changed

- Refactor some internals with how Ropes is mounted inside the Empornium page.
  This should better prevent styles from Empornium and other userscripts from
  contaminating Ropes' styles.

## [7.0.0](https://github.com/tim784/ropes/commits/v7.0.0) - 2024-08-22

### Changed

- The content of the page is now constrained to a maximum width, making it more
  readable on large screens.
- Builds are no longer minified. This should provide more helpful error messages
  in the console and add some transparency to the code. The size of the script
  has increased, but this should matter less because userscripts
  are loaded from disk, not the network.

### Fixed

- (Possibly) no longer crash due to a malformed query selector when gathering
  torrent data from the page.
- Ropes' styles no longer conflict with EMP Dark's.

## [6.0.0](https://github.com/tim784/ropes/commits/v6.0.0) - 2024-08-21

### Added

- The theme (for colors) is now customizable in settings. Choose from blue,
  green, orange, red, rose, violet, yellow, and zinc (the default). These colors
  also work in dark mode.

### Fixed

- Clicking a torrent's Download button will no longer attempt to open a new tab.
- Instead of showing `NaN`, upload dates can now still be parsed when the user
  has the Empornium "Time Style" setting as "Display times as date and time".
  This is probably uncommon.
- Instead of crashing, don't show an image when the user has set the Empornium
  "Hide floating info window on browse torrents page" setting. (Empornium does
  not send image hrefs in this case.) This is probably uncommon.
- Instead of crashing, don't show a "See Tags" button when the user has set the
  Empornium "Hide tags in lists" setting. (Empornium does not send tags in this
  case.) This is probably uncommon.

### Changed

- For small screen sizes, the navigation menu after clicking on the hamburger
  icon now has better styling.
- Breakpoints for the search form layout and torrent card width have been
  adjusted to better fit the screen.
- Skeleton colors (the placeholder when an element is loading) have been
  adjusted.

## [5.0.0](https://github.com/tim784/ropes/commits/v5.0.0) - 2024-08-20

### Added

- Scroll to Top button appears after scrolling down some distance
- Many elements now have descriptions accessible to screen readers
- The paginator component now has left and right buttons for relative-step
  navigation
- Started keeping a changelog (all previous versions are retroactively added)

### Fixed

- Rich Tag Input now properly loses focus when pressing Enter to submit the
  search

### Changed

- Modals now have an autofocused close button, have fade in/out animations, and
  use a different backend component that makes things much simpler to maintain.
- Refactored some internal code around Rich Tag Input to better utilize the
  underlying component. Should be slightly more performant now.

## [4.0.0](https://github.com/tim784/ropes/commits/v4.0.0) - 2024-08-15

(No user-facing changes. This release tested the release process.)

## [3.0.0](https://github.com/tim784/ropes/commits/v3.0.0) - 2024-08-15

(No user-facing changes. This release tested the release process.)

## [2.0.0](https://github.com/tim784/ropes/commits/v2.0.0) - 2024-08-15

### Fixed

- Fixed a test that broke after a refactor
- Links now respect the Open in New Tab setting

### Changed

- Corrected the placeholder forum thread link in the settings modal

## [1.0.0](https://github.com/tim784/ropes/commits/v1.0.0) - 2024-08-14

### Added

- Initial release of the project.
