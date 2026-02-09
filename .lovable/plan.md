

## Auto-Unmuted Video Testimonials with Single-Play Logic

### What changes
- Video testimonials will play with full audio automatically when tapped/clicked (no mute state at all)
- When a user plays one video, all other videos stop immediately
- No mute/unmute toggle -- audio is always on

### Technical approach

**1. Add a shared "active video" context**

Lift the "currently playing" state up to the parent component level. Add a state variable like `activeVideoId` that tracks which testimonial video is currently playing.

**2. Pass callbacks to TestimonialCard**

- Add `onPlay` and `activeVideoId` props to `TestimonialCard`
- When a video is clicked to play, call `onPlay(id)` to notify the parent
- When `activeVideoId` changes and doesn't match this card's `id`, pause the video

**3. Remove muted attribute**

- Remove `muted` from the `<video>` element so audio plays by default
- Note: Most browsers block autoplay with audio, but since these are user-initiated (click to play), this will work fine

**4. useEffect to pause when another video starts**

Inside `TestimonialCard`, add a `useEffect` watching `activeVideoId` -- if it changes to a different card's id, pause this card's video and reset `isPlaying` to false.

### Files modified
- `src/pages/TheProducerBlueprint001.tsx` -- TestimonialCard component and its usage (3 instances)
- `src/pages/TheProducerBlueprint002Spotify.tsx` -- same changes for consistency

