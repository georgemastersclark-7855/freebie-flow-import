

## Green to White/Neutral Parity

Apply the two styling changes from the Career variant (003) to the remaining variants:

### 1. "Student Wins" Badge -- Green to Neutral

Replace `bg-[#D3FF02]/10 text-[#D3FF02]` with `border border-zinc-700 text-zinc-300 bg-zinc-900/50` on:

- **001** (line 1385)
- **002 Spotify** (line 1340)
- **004 Gear** (line 1361)
- **005 Workflow** (line 1352)

### 2. CTA Button Below Bonuses -- Green to White

Replace `bg-[#D3FF02] text-black ... hover:bg-[#b8e000] ... shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]` with `bg-white text-black ... hover:bg-zinc-200` (no glow) on:

- **001** (line 645)
- **004 Gear** (line 645)
- **005 Workflow** (line 645)

002 Spotify has no `below_bonuses` CTA so no change needed there.

No other elements will be changed.

