# Roadmap

Things that came up while building but were left for later.

## Mobile share sheet

The dashboard's **Share** button copies the list link to the clipboard. On phones it should open the native share sheet instead (`navigator.share`), falling back to the clipboard copy where that isn't available.

Where: `src/app/dashboard/share-list-button.tsx`

## Touch-friendly drag and drop

Items on the list edit page are reordered with the browser's built-in drag and drop, which is unreliable on touch screens; phones have to use the ↑ / ↓ buttons. A touch-friendly version needs pointer events or a drag library, ideally with the order updating immediately rather than after the save.

Where: `src/app/dashboard/item-drag.tsx`
