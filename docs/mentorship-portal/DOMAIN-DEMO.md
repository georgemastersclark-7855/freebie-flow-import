# Rob mentorship demo

The walkthrough is at /mentorship-demo. It uses the isolated src/mentorshipDemo copy and example accounts only. Its live service client deliberately throws if called; local demo storage has its own namespace. The original /mentorship-portal and all other existing routes keep their original implementations.

Choose Student view or Rob's view, then Sign in. Sign out to switch. No real password is required. Private lesson recordings are excluded; thumbnails, lesson notes, worksheets, navigation and example workflows can be reviewed.

Source copied from codex/mentorship-rob-demo commit e2c569d, changing route prefixes and browser-storage keys. Future changes should be made in the production source deliberately, not by merging the old demo-only index entry. No production Supabase schema or function updates are included.
