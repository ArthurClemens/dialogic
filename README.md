# Dialogic: manage dialogs and notifications

## Supported JavaScript libraries

* React
* Mithril
* Svelte

## Features

_item: a dialog/modal or a notification_

* Manage multiple items
  * Manage simultaneous (stacked) items
  * Manage a queue of items to show one after the other
* Transitions
  * Show and hide an item with specific transition attributes (or use CSS)
  * Handle separate spawn locations (for example for different types of notifications)
  * Replace an already displayed item
  * Hide all items, or only ones matching a specific id or spawn
  * Remove all items, or only ones matching a specific id or spawn
* Timer
  * Automatic timeout to hide items after a given time
  * Pause, resume and stop a timer
* State
  * Get the number of displayed items (all, per id or per spawn)
  * Get the paused state of a displayed item using a timer
  * Get the remaining time of a displayed item using a timer
  * Use a callback function when an item is shown or hidden
  * Use the returned Promise when an item is shown or hidden
* Styling 
  * Use custom CSS classes or style attributes
  * Manage timings with CSS (or use transition attributes)
  * Use any UI library

## Status

* Core functionality: stable
* Tests: almost complete
* Documentation: TODO
* Demos: TODO
