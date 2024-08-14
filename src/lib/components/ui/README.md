# UI Components

Components in this directory are to be reused across the application. They are
not tied to any specific feature or page.

## Buttons and Links

Both Button and Link use the same underlying component: "BaseButton" from
`$components/ui/base-button/Button.svelte`. But, they differ in whether they
take an `href` (for links) or `type` (for buttons).

- if you have an href, use `$components/ui/Link.svelte`
  - (default) if you want it to look like a link, don't specify a variant
  - or, if you want it to look like a button, use variant `default`
- if you have an on:click, use `$components/ui/Button.svelte`
  - (default) if you want it to look like a button, don't specify a variant
  - or, if you want it to look like a link, use variant `link`

The common derivation of Button and Link from BaseButton is to ensure you can
get the styling from the other if you need it.

No, this is bad. we messed up the ordering in which we present the dimensions of the component:

the first class thing is styling. then functionality

- if you want it to look like a link, use the Link component
  - pass in an href
  - or, pass in a type (and probably an on:click), if you want it to act like
    a button, but look like a link
- if you want it to look like a button, use the Button component
  - pass in a type
  - or, pass in an href if you want it to act like a link, but look like a button
