

## Update Training Dialog Typography

### Changes (2 files)

**1. `src/components/VideoPlayerFullscreen.tsx`** -- line 500

| Before | After |
|--------|-------|
| `<p className="text-small text-foreground">` | `<p className="text-body text-foreground">` |

The video/training description text upgrades from 13px to 16px for better readability.

**2. `src/components/shared/TrainingAttestation.tsx`** -- line 57

| Before | After |
|--------|-------|
| `<p className="font-semibold text-foreground">` | `<p className="font-bold text-foreground">` |

The "Training Acknowledgment" title upgrades from weight 600 to 700.

### Review
1. **Risks:** None -- two single-class swaps with no side effects.
2. **Fixes:** (1) Description text is now standard body size for senior readability. (2) Attestation title weight matches the design system heading standard.
3. **Database Change:** No
4. **Verdict:** Go -- two one-word edits.

