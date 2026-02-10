

## Update URL Field: Label, Placeholder, Helper Text, and Info Tooltip

Four copy updates plus one new info icon with tooltip in `src/components/content/AddContentModal.tsx`.

### Changes

| Element | Current | New |
|---------|---------|-----|
| Label (line 260) | "Video or Presentation URL" | "Video or Presentation Link" |
| Placeholder (line 266) | "Enter YouTube or Google Slides (PPSX only) URL" | "https://youtube.com/... or https://docs.google.com/..." |
| Helper text (line 286) | "Only HTTPS URLs are supported for security" | "Set Google Slides (saved as .ppsx) to 'Anyone with the link' and YouTube to 'Unlisted' so your team can see it." |
| New info icon | n/a | "i" icon with tooltip explaining privacy rationale |

### Technical Details

**Imports (line 16):** Add `Info` to the Lucide import. Add `Tooltip`, `TooltipTrigger`, `TooltipContent` from `@/components/ui/tooltip`.

**Line 260:** Update label text.

**Line 266:** Update placeholder text.

**Line 286:** Replace the helper `<p>` with:

```tsx
<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
  Set Google Slides (saved as .ppsx) to 'Anyone with the link' and YouTube to 'Unlisted' so your team can see it.
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" className="inline-flex flex-shrink-0" aria-label="More info about privacy settings">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      Using 'Unlisted' on YouTube and 'Anyone with the link' on Slides ensures only people with access to this portal can view your content. It will not be searchable on the web.
    </TooltipContent>
  </Tooltip>
</p>
```

The `button` with `type="button"` ensures keyboard accessibility without triggering form submission. The tooltip renders via Portal to avoid dialog scroll clipping.

- **Database Change Required**: No
- **Go/No-Go**: Go

