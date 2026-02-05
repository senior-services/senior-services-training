
# Plan: Update Badge Text and Variants

## Changes

### 1. Required Training Badge (line 460-462)
- **Text**: Change `{count} pending` → `{count} To-do`
- **Variant**: Change `hollow-primary` → `default` (primary solid)

### 2. Completed Training Badge (line 497-499)
- **Text**: Change `{count} completed` → `{count} Completed`
- **Variant**: Change `soft-success` → `success` (success solid)

---

## File Changes

**`src/pages/EmployeeDashboard.tsx`**

| Lines | Before | After |
|-------|--------|-------|
| 460-462 | `<Badge variant="hollow-primary">{count} pending</Badge>` | `<Badge variant="default">{count} To-do</Badge>` |
| 497-499 | `<Badge variant="soft-success">{count} completed</Badge>` | `<Badge variant="success">{count} Completed</Badge>` |

### Code Changes

**Lines 460-462:**
```jsx
// Before
<Badge variant="hollow-primary">
  {trainingData.required.length} pending
</Badge>

// After
<Badge variant="default">
  {trainingData.required.length} To-do
</Badge>
```

**Lines 497-499:**
```jsx
// Before
<Badge variant="soft-success">
  {trainingData.completed.length} completed
</Badge>

// After
<Badge variant="success">
  {trainingData.completed.length} Completed
</Badge>
```

---

## Result

| Badge | Text | Variant |
|-------|------|---------|
| Required Training | "X To-do" | Primary solid (`default`) |
| Completed Training | "X Completed" | Success solid (`success`) |
