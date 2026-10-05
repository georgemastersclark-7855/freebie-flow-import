import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight, ListOrdered } from "lucide-react";
import { usePortalStore } from "../PortalStore";

const sections = [
  { id: "method-story", label: "Rob's approach" },
  { id: "method-process", label: "Weekly process" },
  { id: "method-feedback-library", label: "Feedback & your library" },
];

export function LoopMethod() {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = sections.find((section) => `#${section.id}` === location.hash)?.id ?? "method-story";
  const { weeks } = usePortalStore();
  const target = weeks.reduce((sum, week) => sum + week.requiredIdeas, 0);

  return <section className="mp-method" aria-labelledby="loop-method-title">
    <header>
      <p className="mm-overline">How the mentorship works</p>
      <h2 id="loop-method-title" className="mp-display mp-lesson-title">ROB'S LOOP METHOD</h2>
    </header>
    <Tabs.Root value={selected} onValueChange={(value) => navigate({ pathname: location.pathname, search: location.search, hash: `#${value}` }, { replace: true })}>
      <Tabs.List className="mm-tabs" aria-label="How the mentorship works">
        {sections.map((section) => <Tabs.Trigger key={section.id} value={section.id} className="mp-focus-ring mm-tab">{section.label}</Tabs.Trigger>)}
      </Tabs.List>

    <Tabs.Content value="method-story" className="mp-focus-ring mm-tab-panel">

    <section id="method-story" className="mm-story" aria-labelledby="method-story-title">
      <div className="mm-story-title">
        <h3 id="method-story-title">Why I take song starters into writing sessions</h3>
        <p>Rob Late</p>
      </div>
      <div className="mm-reading">
        <blockquote>The thing that completely changed the game for me was creating song starters.</blockquote>
        <p>I'd go into a session with 30 or 40 small ideas in a folder. Chord progressions with interesting sounds, rhythms, little seeds of ideas that I could scroll through in front of the artist.</p>
        <p>After three or four, a writer in the room would say, "Ah, that's cool," and BANG, they'd start writing over it. Then the pressure's off me. I can get into building the drums and producing the song with everyone in the room, knowing that if this song makes it through, <strong>my writing and production are already part of it.</strong> This is how I got cuts in those writing camps with major artists.</p>
        <p>If you bring a finished track, someone might like the chords but get put off by the drums or the tempo. Or it's so fully formed that they don't know how to contribute. A song starter leaves room for them. The same approach works in a session with an independent artist, or when you're looking for an idea to develop into your own track.</p>
      </div>
    </section>

    </Tabs.Content>
    <Tabs.Content value="method-process" className="mp-focus-ring mm-tab-panel">
    <section id="method-process" className="mm-process" aria-labelledby="method-process-title">
      <div className="mm-section-title"><ListOrdered size={21} aria-hidden="true" /><h3 id="method-process-title">What to submit and when</h3></div>
      <div className="mm-phase">
        <header className="mm-phase-heading"><h4>Weeks 1 to 4</h4><span>Repeat these two steps each week</span></header>
        <ol className="mm-step-list">
          <li className="mm-step"><span className="mm-step-number" aria-hidden="true">01</span><div><h5>Make five song starters each week</h5><p>I want five fresh <strong>4, 8 or 16-bar ideas</strong> from you. They don't need to be amazing. Make small hooks and ideas you think are cool, then upload them in Your Weekly Submissions.</p></div></li>
          <li className="mm-step"><span className="mm-step-number" aria-hidden="true">02</span><div><h5>Develop one through the first chorus or drop</h5><p>Choose your favourite and build the intro, verse and first chorus or drop. That's how far we usually work in sessions so the artist can hear the hook and decide what to take forward. <strong>Upload an MP3 or WAV of that song and a ZIP of its matching stems</strong>, then send your submission to me.</p></div></li>
        </ol>
        <section className="mm-reps" aria-labelledby="method-reps-title"><h4 id="method-reps-title">Why you're making new ideas every week</h4><p>This is what I mean by REPS. I could make 10 to 15 of these in the time it took me to finish a full track. I want to get you creating ideas quickly and regularly, then choosing the strongest ones to take further. Even on days when you don't feel inspired or you feel overwhelmed, make a couple of small ideas and save them in your folder.</p></section>
      </div>
      <div className="mm-phase">
        <header className="mm-phase-heading"><h4>Weeks 5 and 6</h4><span>Work on your selected track</span></header>
        <ol className="mm-step-list" start={3}>
          <li className="mm-step"><span className="mm-step-number" aria-hidden="true">03</span><div><h5>Finish one of your songs in full</h5><p>At the end of week 4, choose the song you want to finish. You'll develop it from start to finish over the final two weeks, <strong>with my support and guidance.</strong> Upload your progress and updated stems. <strong>You don't need to make new song starters in these weeks.</strong></p></div></li>
        </ol>
      </div>
    </section>

    </Tabs.Content>
    <Tabs.Content value="method-feedback-library" className="mp-focus-ring mm-tab-panel">
    <div id="method-feedback-library" className="mm-support">
      <section aria-labelledby="method-feedback-title"><p className="mm-overline">Feedback &amp; live calls</p><h3 id="method-feedback-title">Use my feedback in your next week's work</h3><p>I'll give you personal feedback on the developed song you submit each week. On our group call, I'll produce one student's track live and teach from the things that came up in that week's submissions. Ask questions, watch how I make decisions and put what you learn into your next track.</p></section>
      <section aria-labelledby="method-library-title"><p className="mm-overline">Your song starter library</p><h3 id="method-library-title">Take your song starters into your next session</h3><p>{target ? <>Complete the weekly starters and you'll have <strong>{target} ideas minimum in your folder as well as your finished track.</strong>{" "}</> : "Your weekly starters give you a folder of ideas as well as your finished track. "}Every loop you upload is saved in your Song Starter Library. Listen back, download them and take that folder into a session with an artist, or choose one to start your own next track.</p><Link to="/mentorship-portal/library" className="mp-focus-ring mm-text-link">Open your Song Starter Library<ArrowRight size={16} aria-hidden="true" /></Link></section>
    </div>
    </Tabs.Content>
    </Tabs.Root>
  </section>;
}
