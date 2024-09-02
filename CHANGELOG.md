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
