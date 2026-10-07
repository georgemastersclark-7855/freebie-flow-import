export const sopRoot = '/mentorship-portal/admin/sops';

export const staffSops = [
  {
    id: 'onboarding', title: 'Run an onboarding call', owner: 'Rob',
    description: 'Listen to their music, understand what they want to achieve and agree a practical focus for week one.',
    outcome: 'A saved starting point, one or two coaching priorities, a week-one plan and any promised follow-ups.',
    sections: [
      { title: 'Before the call', points: [
        'Open the student record and listen to the music they have shared. Note what already works and the specific moments you want to discuss.',
        'Have the track, their profile and the onboarding questionnaire open. Check that the call recorder has joined and recording is active, and let the student know. Confirm the recording afterwards; do not assume it has been captured.',
      ] },
      { title: 'Understand their goal and starting point', points: [
        'Ask: “What would make these six weeks a success for you?” Get a concrete goal, such as improving their writing, finishing a release or feeling more prepared for sessions.',
        'Ask what they already finish, what they are working on now and where they tend to get stuck. Ask how much time they can realistically put into the weekly work.',
        'Use what you hear in their music to understand their level. An experienced producer may need a precise second opinion; a newer producer may need a skill broken down and demonstrated.',
      ] },
      { title: 'Listen together and identify the priority', points: [
        'Start with something that works. Play the relevant section and explain the main thing that would improve it. Focus on one or two priorities they can act on.',
        'Ask: “What were you going for here?” and “What have you tried already?” Make sure your advice serves their intention for the music.',
        'Show how to make the change with a short demonstration, a reference or a clear practical example. “Improve your drums” needs a specific next step.',
      ] },
      { title: 'Agree how they will practise in week one', points: [
        'Ask them to apply the focus within their song starters and the song they develop. For example, explore stronger drum grooves in the starters, then build the strongest idea into the intro through the first chorus or drop.',
        'Explain why we use that structure: in writing sessions it lets the artist hear the idea, reach the hook and decide what to take forward.',
        'Tell them what you will listen for in the first submission. Ask: “Talk me through what you’re going to try first.” Clarify anything that is still vague.',
      ] },
      { title: 'Agree support and any existing-track review', points: [
        'Explain that Rob reviews their weekly submission and George is a midweek coaching touchpoint for students who want more music reviewed or help applying feedback.',
        'Ask: “Are you working on any other songs you would like me to hear?” Rob can agree an additional review of an existing track case by case, alongside the normal weekly submission.',
        'If Rob agrees, record the track and version, the question to answer, which section or full track he will hear, and when he will review it. Confirm how the student should share it. Keep the weekly repetitions and agreed plan clear.',
      ] },
      { title: 'Close the call and record the plan', points: [
        'Recap their goal, the main coaching focus, what they will practise and what Rob will listen for. Check that the student can explain the plan back in their own words.',
        'Save the questionnaire to the student record. Update Goals & current focus with the agreed plan, and add any promised review or check-in under Follow-ups with an owner and date.',
        'Attach the recording link or relevant transcript when available. Give George the context he needs for midweek support. Share the agreed plan with the student through the agreed channel; saving staff notes does not send it.',
      ] },
    ],
  },
  {
    id: 'midweek-coaching', title: 'Run a midweek coaching touchpoint', owner: 'George',
    description: 'Help a student apply feedback and make progress while their music is still developing.',
    outcome: 'A clear adjustment to try, a brief note for Rob and a follow-up if one is needed.',
    sections: [
      { title: 'Read their current focus first', points: [
        'Check the onboarding plan, Rob’s latest feedback and any open follow-ups before listening. Keep your advice connected to the direction already agreed.',
        'Ask what they want you to listen for, what they have changed and where they are stuck. Agree the relevant section or track to review.',
      ] },
      { title: 'Listen and give an actionable response', points: [
        'Identify what is working and the most useful next adjustment. Use a reference, short demonstration or specific instruction when that will make the advice easier to apply.',
        'Help them test the adjustment and keep moving. If you think the main coaching direction needs changing, flag that for Rob with the reason and the relevant audio.',
      ] },
      { title: 'Leave a useful handover', points: [
        'Record which track and version you heard, the question, the advice you gave and what the student plans to try. Distinguish advice given from a change you have actually heard them make.',
        'Add an owned follow-up if you or Rob have promised another listen. The normal weekly review with Rob continues alongside this support.',
      ] },
    ],
  },
  {
    id: 'existing-track-review', title: 'Agree an additional track review', owner: 'Rob',
    description: 'Support a student’s current release or other work with an individually agreed extra review.',
    outcome: 'An agreed track, listening scope, question and review date, recorded as a follow-up.',
    sections: [
      { title: 'Decide whether the review will help', points: [
        'Ask what the student is working towards with the song, what stage it is at and what decision they need help making. An existing song can be useful material for their personal coaching.',
        'Rob can agree this additional review case by case. It sits alongside the guaranteed weekly submission review; it does not automatically replace the weekly starters or developed song.',
      ] },
      { title: 'Agree exactly what Rob will hear', points: [
        'Choose the track and version, one or two questions and the appropriate listening scope. An arrangement question may need the full song; a sound or mix question may only need a specific section.',
        'Agree when Rob will review it and how the student should share the file. Ask for stems only when they are needed for the work agreed.',
      ] },
      { title: 'Record and follow through', points: [
        'Add the review under the student’s Follow-ups with Rob as owner and the agreed date. Include the track name, version, question and listening scope.',
        'After the review, save the advice and next action in the student record. Mark the follow-up complete once the review has been delivered.',
      ] },
    ],
  },
] as const;
