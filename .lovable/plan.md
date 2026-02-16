

## Swap Rightmost Avatar to Lorenzo

1. Copy the uploaded image to `src/assets/avatars/avatar-lorenzo.jpg`
2. In `src/pages/TheProducerBlueprint005Workflow.tsx`:
   - Add import: `import avatarLorenzo from "@/assets/avatars/avatar-lorenzo.jpg";`
   - At line 994, change `src={avatarProducer3}` to `src={avatarLorenzo}`
   - Change fallback from `P3` to `L`

Only the 005Workflow variant is modified. 1 file, 2 small edits.

