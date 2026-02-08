
## Make Quiz Dialog Full Screen (Employee View)

A simple one-line change. The project already has a `FullscreenDialogContent` component in the design system -- we just need to use it.

### What Changes

- The quiz dialog on the employee video page (`VideoPage.tsx`) currently opens as a medium-width modal (`max-w-4xl`).
- After: it opens as a full-screen dialog (same style used by the video player fullscreen dialog), filling the viewport with a small inset margin.

### Principal Engineer Review

**Top 5 Risks/Issues:**
1. None significant -- this is a one-component swap using an existing design-system primitive
2. The quiz title in DialogHeader still shows `quiz?.title || 'Quiz'` which was previously cleared; verify it renders sensibly
3. No mobile-specific concerns -- `FullscreenDialogContent` already handles responsive insets
4. No accessibility impact -- same close button and focus management
5. No data or logic changes

**Top 5 Fixes/Improvements:**
1. Swap `DialogContent` to `FullscreenDialogContent` in the quiz dialog
2. Update the import to include `FullscreenDialogContent`
3. Remove the `max-w-4xl` class (not needed for fullscreen)
4. Consider removing the DialogHeader title since QuizModal already renders its own "Quiz questions (N)" heading -- avoids duplication
5. No other changes needed

**Database Change Required:** No

**Go/No-Go Verdict:** Go -- single-line swap using an existing component.

### Technical Details

**`src/pages/VideoPage.tsx`:**
- Update import: add `FullscreenDialogContent` from `@/components/ui/dialog`
- Line 329: replace `<DialogContent className="max-w-4xl">` with `<FullscreenDialogContent>`
- Line 342: replace closing `</DialogContent>` with `</FullscreenDialogContent>`
- Optionally remove `<DialogHeader>` block (lines 330-334) since QuizModal already shows "Quiz questions (N)" as a heading -- keeping both would be redundant
