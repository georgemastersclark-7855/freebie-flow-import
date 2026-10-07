export type ApplicationQuestionType = 'text' | 'email' | 'textarea' | 'choice';
export type ApplicationQuestion = {
  key: string;
  title: string;
  description: string;
  placeholder: string;
  section: string;
  type: ApplicationQuestionType;
  required: boolean;
  options?: string[];
  maxLength: number;
};
export type ApplicationFormConfig = {
  welcome: { eyebrow: string; title: string; description: string; buttonText: string };
  identity: { title: string; description: string; cohortLabel: string; details: string[] };
  completion: { title: string; description: string };
  questions: ApplicationQuestion[];
};
export type ValidatedApplication = {
  answers: Record<string, string>;
  storedAnswers: Array<{ key: string; question: string; answer: string }>;
  lead: { full_name: string; email: string; source: string; source_detail: string; goals: string; music_url: string | null; application_url: null; stage: 'applied' };
  email: string;
};
export type ApplicationAttribution = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'referrer', string>>;

export const BASE_APPLICATION_FORM_CONFIG: ApplicationFormConfig = {
  welcome: {
    eyebrow: 'Apply for cohort 2',
    title: 'LET’S HEAR ABOUT YOU.',
    description: 'Tell me where you’re at with your music and what you want to work on. I’ll use your answers to see whether the mentorship is right for you.',
    buttonText: 'Start application',
  },
  identity: {
    title: 'WORK DIRECTLY WITH ROB LATE.',
    description: 'Six weeks of making music, with my feedback on your work.',
    cohortLabel: 'Cohort 02 / Application',
    details: ['6 weeks', '12 places', '$2,497 USD'],
  },
  completion: {
    title: 'THANKS FOR TELLING ME ABOUT YOUR MUSIC.',
    description: 'We’ll review your application and get back to you at {email}. Keep an eye on your inbox.',
  },
  questions: [
    { key: 'name', title: "What's your name?", description: "Let's start with what we should call you.", placeholder: 'Your full name', section: 'About you', type: 'text', required: true, maxLength: 160 },
    { key: 'email', title: "What's your email address?", description: "We'll get back to you here about your application.", placeholder: 'you@example.com', section: 'About you', type: 'email', required: true, maxLength: 254 },
    { key: 'social', title: "What's your social media handle?", description: "Include the platform if it isn't Instagram.", placeholder: '@yourhandle', section: 'About you', type: 'text', required: false, maxLength: 120 },
    { key: 'music', title: 'Got any music we can listen to?', description: 'Spotify, SoundCloud, YouTube or a private listening link. Make sure we can play it.', placeholder: 'Paste your music links here…', section: 'Your music', type: 'textarea', required: false, maxLength: 2048 },
    { key: 'experience', title: 'How long have you been producing?', description: "This helps me understand where you're starting from.", placeholder: '', section: 'Your music', type: 'choice', required: false, options: ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years', 'Returning after a break'], maxLength: 100 },
    { key: 'goal', title: "What's your goal with music?", description: "Pick the one that best describes what you're working towards.", placeholder: '', section: 'Your goals', type: 'choice', required: false, options: ['Full-time career', 'Side income alongside my job', 'Serious hobby'], maxLength: 100 },
    { key: 'struggles', title: 'What are the 3 main struggles holding you back with your music?', description: 'Tell me where you get stuck. The more specific you can be, the better.', placeholder: 'The things I want help with are…', section: 'Your goals', type: 'textarea', required: false, maxLength: 2000 },
    { key: 'income', title: 'How much are you currently making from music?', description: "This gives me a little more context about where you're at. Amounts are in US dollars.", placeholder: '', section: 'Your goals', type: 'choice', required: false, options: ['$0', 'Under $1k/month', '$1–5k/month', '$5k+/month'], maxLength: 100 },
    { key: 'investment', title: 'The six-week mentorship is $2,497 USD. Are you ready to invest?', description: "Applying doesn't take a payment or reserve a place. We'll review your application first.", placeholder: '', section: 'Your place', type: 'choice', required: true, options: ["Yes, I'm ready", 'I have questions first', 'Not right now'], maxLength: 100 },
    { key: 'source', title: 'How did you hear about Rob?', description: 'Where did you first discover my work?', placeholder: '', section: 'Your place', type: 'choice', required: false, options: ['Instagram', 'YouTube', 'Friend/word of mouth', 'Other'], maxLength: 100 },
  ],
};

const BUILTIN_KEYS = new Set(['name', 'email', 'social', 'music', 'experience', 'goal', 'struggles', 'income', 'investment', 'source']);
const KEY_PATTERN = /^q_[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function record(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid ${name}`);
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, allowed: string[], name: string): void {
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error(`Unexpected ${name} property`);
}

function boundedString(value: unknown, field: string, max: number, allowEmpty = true): string {
  if (typeof value !== 'string') throw new Error(`Invalid ${field}`);
  const result = value.trim();
  if ((!allowEmpty && !result) || result.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(result)) throw new Error(`Invalid ${field}`);
  return result;
}

export function validateFormConfig(input: unknown): ApplicationFormConfig {
  const root = record(input, 'form config');
  exactKeys(root, ['welcome', 'identity', 'completion', 'questions'], 'form config');
  const welcome = record(root.welcome, 'welcome copy');
  exactKeys(welcome, ['eyebrow', 'title', 'description', 'buttonText'], 'welcome copy');
  const identity = record(root.identity, 'identity copy');
  exactKeys(identity, ['title', 'description', 'cohortLabel', 'details'], 'identity copy');
  const completion = record(root.completion, 'completion copy');
  exactKeys(completion, ['title', 'description'], 'completion copy');
  if (!Array.isArray(root.questions) || root.questions.length < 2 || root.questions.length > 30) throw new Error('Add between 2 and 30 questions');

  const questions = root.questions.map((item, index): ApplicationQuestion => {
    const question = record(item, `question ${index + 1}`);
    exactKeys(question, ['key', 'title', 'description', 'placeholder', 'section', 'type', 'required', 'options', 'maxLength'], `question ${index + 1}`);
    const key = boundedString(question.key, 'question key', 48, false);
    if (!BUILTIN_KEYS.has(key) && !KEY_PATTERN.test(key)) throw new Error(`Invalid question key: ${key}`);
    if (!['text', 'email', 'textarea', 'choice'].includes(String(question.type))) throw new Error(`Invalid question type: ${key}`);
    if (typeof question.required !== 'boolean') throw new Error(`Invalid required setting: ${key}`);
    if (!Number.isInteger(question.maxLength) || (question.maxLength as number) < 1 || (question.maxLength as number) > 4000) throw new Error(`Invalid maximum length: ${key}`);
    const type = question.type as ApplicationQuestionType;
    if (key === 'name' && (type !== 'text' || !question.required || (question.maxLength as number) > 160)) throw new Error('Name must be a required text question up to 160 characters');
    if (key === 'email' && (type !== 'email' || !question.required || (question.maxLength as number) > 254)) throw new Error('Email must be a required email question up to 254 characters');
    const options = question.options;
    if (type === 'choice') {
      if (!Array.isArray(options) || options.length < 2 || options.length > 20) throw new Error(`Choice questions need 2 to 20 options: ${key}`);
      const normalizedOptions = options.map((option, i) => boundedString(option, `option ${i + 1}`, 100, false));
      if (new Set(normalizedOptions).size !== normalizedOptions.length) throw new Error(`Duplicate choice option: ${key}`);
      return {
        key,
        title: boundedString(question.title, 'question title', 180, false),
        description: boundedString(question.description, 'question description', 800),
        placeholder: boundedString(question.placeholder, 'question placeholder', 200),
        section: boundedString(question.section, 'question section', 80, false),
        type,
        required: question.required,
        options: normalizedOptions,
        maxLength: question.maxLength as number,
      };
    }
    if (options !== undefined) throw new Error(`Only choice questions may have options: ${key}`);
    return {
      key,
      title: boundedString(question.title, 'question title', 180, false),
      description: boundedString(question.description, 'question description', 800),
      placeholder: boundedString(question.placeholder, 'question placeholder', 200),
      section: boundedString(question.section, 'question section', 80, false),
      type,
      required: question.required,
      maxLength: question.maxLength as number,
    };
  });

  const keys = questions.map(({ key }) => key);
  if (new Set(keys).size !== keys.length) throw new Error('Question keys must be unique');
  const name = questions.filter(({ key }) => key === 'name');
  const email = questions.filter(({ key }) => key === 'email');
  if (name.length !== 1 || name[0].type !== 'text' || !name[0].required) throw new Error('A required name question is required');
  if (email.length !== 1 || email[0].type !== 'email' || !email[0].required) throw new Error('A required email question is required');
  const detailsRaw = identity.details;
  if (!Array.isArray(detailsRaw) || detailsRaw.length < 1 || detailsRaw.length > 10) throw new Error('Identity details must contain 1 to 10 items');
  const details = detailsRaw.map((value, index) => boundedString(value, `identity detail ${index + 1}`, 100, false));

  return {
    welcome: {
      eyebrow: boundedString(welcome.eyebrow, 'welcome eyebrow', 60),
      title: boundedString(welcome.title, 'welcome title', 180, false),
      description: boundedString(welcome.description, 'welcome description', 1000),
      buttonText: boundedString(welcome.buttonText, 'welcome button', 60, false),
    },
    identity: {
      title: boundedString(identity.title, 'identity title', 160, false),
      description: boundedString(identity.description, 'identity description', 800),
      cohortLabel: boundedString(identity.cohortLabel, 'cohort label', 80, false),
      details,
    },
    completion: {
      title: boundedString(completion.title, 'completion title', 180, false),
      description: boundedString(completion.description, 'completion description', 1000),
    },
    questions,
  };
}

function safeHttpsLinks(value: string): string[] {
  if (/\bhttp:\/\//i.test(value)) throw new Error('Music links must use HTTPS');
  const links = (value.match(/https:\/\/[^\s<>"']+/gi) ?? []).map((match) => match.replace(/[),.;!?\]}]+$/g, ''));
  if (links.length > 8 || links.some((value) => {
    try { const url = new URL(value); return url.protocol !== 'https:' || !url.hostname || Boolean(url.username || url.password); } catch { return true; }
  })) throw new Error('Invalid music link');
  return links;
}

export function validateApplicationAnswers(configInput: unknown, answersInput: unknown): ValidatedApplication {
  const config = validateFormConfig(configInput);
  const incoming = record(answersInput, 'answers');
  const questionsByKey = new Map(config.questions.map((question) => [question.key, question]));
  if (Object.keys(incoming).some((key) => !questionsByKey.has(key))) throw new Error('Unexpected answer key');
  const answers: Record<string, string> = {};
  for (const question of config.questions) {
    const raw = incoming[question.key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (typeof raw !== 'string' && raw !== undefined && raw !== null) throw new Error(`Invalid answer: ${question.key}`);
    if (!value && question.required) throw new Error(`Answer required: ${question.key}`);
    if (value.length > question.maxLength || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) throw new Error(`Invalid answer: ${question.key}`);
    if (question.type === 'email' && value && (!EMAIL_PATTERN.test(value) || value.length > 254)) throw new Error('Invalid email');
    if (question.type === 'choice' && value && !question.options?.includes(value)) throw new Error(`Invalid choice: ${question.key}`);
    if (question.key === 'music' && value) safeHttpsLinks(value);
    answers[question.key] = question.type === 'email' ? value.toLowerCase() : value;
  }
  const email = answers.email;
  const attributionSource = answers.source || 'Not recorded';
  const music = answers.music ? safeHttpsLinks(answers.music)[0] || null : null;
  const goalParts = [answers.goal, answers.struggles].filter(Boolean);
  return {
    answers,
    storedAnswers: config.questions.map((question) => ({ key: question.key, question: question.title, answer: answers[question.key] })),
    lead: {
      full_name: answers.name,
      email,
      source: attributionSource,
      source_detail: '',
      goals: goalParts.join('\n\n').slice(0, 4000),
      music_url: music,
      application_url: null,
      stage: 'applied',
    },
    email,
  };
}

export function validateApplicationAttribution(input: unknown): ApplicationAttribution {
  if (input === undefined || input === null) return {};
  const raw = record(input, 'attribution');
  const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer'] as const;
  exactKeys(raw, [...allowed], 'attribution');
  const result: ApplicationAttribution = {};
  for (const key of allowed) {
    const value = boundedString(raw[key] ?? '', `attribution ${key}`, 200);
    if (key === 'referrer' && value) {
      try {
        const url = new URL(value);
        if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password || url.toString().length > 200) throw new Error();
        result[key] = url.toString();
      } catch { throw new Error('Invalid attribution referrer'); }
    } else if (value) result[key] = value;
  }
  return result;
}

export function buildApplicationLead(input: ValidatedApplication, attribution: Record<string, string>): ValidatedApplication['lead'] {
  const summary = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .map((key) => attribution[key] ? `${key}=${attribution[key]}` : '').filter(Boolean).join('&').slice(0, 1000);
  return { ...input.lead, source_detail: summary };
}
