export interface KnowledgeEntry {
  section: string;
  content: string;
  keywords: string[];
}

// ---------- Named events (authoritative source) ----------

interface NamedEvent {
  name: string;
  date: string;
  venue: string;
  city: string;
  upcoming?: boolean;
  // sortKey used to order past events (most recent first)
  order: number;
}

// Order reflects chronological order in the knowledge base (higher = more recent).
const NAMED_EVENTS: NamedEvent[] = [
  { name: "Learn Azure Bot Services & Identity Access", date: "Dec 28, 2024", venue: "KARE", city: "Srivilliputhur", order: 1 },
  { name: "AI in Action – Exploring Innovation at Microsoft", date: "Jan 3, 2025", venue: "Microsoft Reactor", city: "Bengaluru", order: 2 },
  { name: "InnovateHer with Microsoft (Women-Only)", date: "Apr 10", venue: "Microsoft Ferns", city: "Bengaluru", order: 3 },
  { name: "Microsoft Global AI Tour – Season of Agents", date: "May 17", venue: "Microsoft Ferns", city: "Bengaluru", order: 4 },
  { name: "Global GenAI Bootcamp – Bengaluru", date: "Jul 5", venue: "Microsoft Ferns", city: "Bengaluru", order: 5 },
  { name: "Microsoft AgentVerse – Bengaluru", date: "Aug 9", venue: "Microsoft Ferns", city: "Bengaluru", order: 6 },
  { name: "Sprint to Imagine Cup – Chennai", date: "Oct 18", venue: "Microsoft Office", city: "Chennai", order: 7 },
  { name: "Sprint to Imagine Cup – Bengaluru", date: "Nov 15", venue: "Microsoft Ferns", city: "Bengaluru", order: 8 },
  { name: "Agentic AI Connect – Chennai", date: "Dec 20", venue: "Yuniq", city: "Chennai", order: 9 },
  { name: "Agentic AI Connect – Bengaluru", date: "Jan 10", venue: "Microsoft Ferns", city: "Bengaluru", order: 10 },
  { name: "Code & Cold Pizza – Bengaluru", date: "Feb 7", venue: "Polaris School of Technology", city: "Bengaluru", order: 11 },
  { name: "GitHub Copilot Dev Day – Bengaluru", date: "Mar 14", venue: "Venue TBA", city: "Bengaluru", order: 12 },
  { name: "NexusAI – Chennai", date: "Feb 28", venue: "Yuniq, Tidel BioPark", city: "Chennai", upcoming: true, order: 99 },
];

const UPCOMING_EVENT = NAMED_EVENTS.find(e => e.upcoming)!;
const PAST_EVENTS = NAMED_EVENTS.filter(e => !e.upcoming).sort((a, b) => b.order - a.order);

const formatEvent = (e: NamedEvent) => `${e.name} – ${e.date} – ${e.venue}, ${e.city}`;

// ---------- Knowledge base entries (general info) ----------

const knowledgeBase: KnowledgeEntry[] = [
  // Overview
  {
    section: "overview",
    content: "TechNexus Community is a technology-focused meetup and professional learning network bringing together developers, engineers, students, AI practitioners, founders, and technology professionals. Tagline: \"Collaborate. Innovate. Elevate.\"",
    keywords: ["about", "overview", "what is", "technexus", "tell me about", "introduction", "community"],
  },
  {
    section: "overview",
    content: "TechNexus focuses on Artificial Intelligence, Data and Analytics, IoT, Cloud and Software Technologies, and Digital Innovation. It runs as a hybrid community via in-person meetups, workshops, learning events, and networking sessions.",
    keywords: ["focus", "areas", "topics", "ai", "cloud", "data", "iot", "innovation"],
  },
  {
    section: "overview",
    content: "TechNexus is led by two co-founders: Vinodh Kumar (Community Lead) and Mohammed Azaruddin (Operations Lead). The community has 12,000 followers across multiple cities.",
    keywords: ["founder", "founders", "leadership", "vinodh", "azaruddin", "lead", "who runs", "who founded"],
  },

  // FAQ / Getting started / Joining
  {
    section: "faq",
    content: "TechNexus is open to everyone — students, early-career professionals, developers, AI/data/cloud enthusiasts, founders, and industry practitioners. There is no mandatory membership fee. To get started, join the official TechNexus WhatsApp group, follow event announcements, and RSVP for events you'd like to attend.",
    keywords: ["join", "get started", "getting started", "start", "how to join", "sign up", "register", "begin", "onboard", "new member", "first steps", "membership", "fee", "cost", "free"],
  },
  {
    section: "faq",
    content: "TechNexus offers Skill-Up programs and certification tracks for Microsoft Azure and AI, with guided curriculum, expert-led sessions, certification readiness, and eligibility-based discounted Microsoft certification vouchers.",
    keywords: ["certification", "voucher", "skill", "learning", "azure", "training", "program", "track"],
  },
  {
    section: "faq",
    content: "Event access categories: Open Events, RSVP-Based, Invitation-Based, Partner-Restricted, and Women-Only Events. Entry may require an event pass, WhatsApp confirmation, and venue verification.",
    keywords: ["access", "category", "rsvp", "invitation", "women only", "partner", "entry", "attend"],
  },
  {
    section: "faq",
    content: "Updates are shared via the TechNexus WhatsApp group (primary channel) and the Meetup platform (public listings and RSVPs).",
    keywords: ["updates", "notifications", "announcements", "news", "whatsapp", "meetup", "stay updated", "channel"],
  },

  // Events — general (NOT event-history)
  {
    section: "events",
    content: "TechNexus events are hosted in Bengaluru, Chennai, Srivilliputhur, partner campuses, and online/hybrid platforms. Many flagship events are held at Microsoft venues such as Microsoft Ferns Bengaluru, Microsoft Reactor Bengaluru, and Microsoft Office Chennai.",
    keywords: ["venue", "venues", "location", "locations", "where", "city", "cities", "microsoft ferns", "reactor", "yuniq"],
  },
  {
    section: "events",
    content: "Event formats include Meetups, Developer Days, AI Conferences, Microsoft Partner Events, Bootcamps, Workshops, Certification Tracks, Student Innovation Days, and Women-in-Tech programs.",
    keywords: ["format", "formats", "type", "types", "kind", "bootcamp", "workshop", "conference", "developer day"],
  },
  {
    section: "events",
    content: "Major event series include Code & Cold Pizza, Agentic AI Connect, Microsoft Developer Day, GitHub Copilot Bootcamp, Global GenAI Bootcamp, Microsoft Global AI Tour, InnovateHer, Sprint to Imagine Cup, Microsoft AgentVerse, AI Innovation Days, and NexusAI.",
    keywords: ["series", "flagship", "programs", "major events", "named events"],
  },
  {
    section: "events",
    content: "TechNexus runs regular meetups across cities. Most events have controlled access requiring RSVP/registration, an event pass, and joining the official TechNexus WhatsApp group. High-demand events may require double verification and arriving 30 minutes early.",
    keywords: ["meetup", "meetups", "regular", "registration", "verification", "pass"],
  },

  // History
  {
    section: "history",
    content: "TechNexus was founded to build a practical, industry-connected technology learning ecosystem in India — bridging academic knowledge, industry needs, and real-world implementation. It began as a local meetup and grew into a multi-city, Microsoft-aligned innovation network.",
    keywords: ["history", "founded", "origin", "started", "beginning", "evolution", "growth", "expansion"],
  },
  {
    section: "history",
    content: "TechNexus expanded into Bengaluru, Chennai, and Srivilliputhur, partnered with Microsoft MVPs, cloud experts, and industry leaders, and developed verticals across AI meetups, Microsoft ecosystem events, developer bootcamps, student innovation programs, women-in-tech initiatives, and enterprise AI sessions.",
    keywords: ["multi-city", "partners", "verticals", "milestones", "achievements"],
  },

  // Rules
  {
    section: "rules",
    content: "Core principles: respectful communication, professional conduct, ethical innovation, inclusive participation, and a safe learning environment across all events, sessions, and WhatsApp groups.",
    keywords: ["rules", "guidelines", "principles", "conduct", "behavior", "respect", "professional"],
  },
  {
    section: "rules",
    content: "Prohibited behavior includes spam, unrelated promotions, fake or misleading information, disrespectful conduct (harassment, discrimination, offensive language), and event disruption. Using the community for personal monetary or social-media gains is not allowed.",
    keywords: ["prohibited", "spam", "promotion", "harassment", "discrimination", "disruption", "not allowed"],
  },
  {
    section: "rules",
    content: "WhatsApp groups are moderated and event-focused. Allowed: event updates, official announcements, session materials, relevant tech discussions. Not allowed: viral forwards, political/religious debates, personal ads, non-tech content.",
    keywords: ["whatsapp", "group", "policy", "messages", "forward"],
  },

  // Moderation
  {
    section: "moderation",
    content: "Moderators maintain safety and discipline across WhatsApp groups and events — they can delete messages, mute users, remove members, and ban repeat offenders. Zero-tolerance violations include harassment, hate speech, fraud, fake voucher distribution, impersonation, plagiarism, and bullying.",
    keywords: ["moderation", "moderator", "ban", "warning", "removal", "violation", "report", "complaint"],
  },
  {
    section: "moderation",
    content: "Enforcement follows: Prevention → Warning → Removal → Ban. Priorities are community safety, inclusivity, a professional learning environment, and brand integrity.",
    keywords: ["enforcement", "philosophy", "discipline"],
  },
];

// ---------- Conversational helpers ----------

const STOP_WORDS = new Set([
  "the", "is", "are", "was", "were", "what", "who", "how", "why", "when",
  "where", "which", "that", "this", "can", "does", "has", "have", "had",
  "will", "would", "should", "could", "may", "might", "shall", "been",
  "being", "about", "with", "from", "into", "for", "and", "but", "not",
  "you", "your", "they", "their", "our", "its", "also", "than", "then",
  "tell", "show", "give", "know", "like", "just", "some", "any", "all",
  "very", "more", "most", "other", "each", "every", "both", "few", "many",
  "me", "us", "do",
]);

const POLITE_REDIRECTS = [
  "Haha 😄 I'd probably mess that up, but I can help you with TechNexus events and community info!",
  "That's a fun question 😅 I'm more of a TechNexus specialist than anything else — ask me about events or joining!",
  "I might not survive giving advice on that 😉 but I can help you with TechNexus updates!",
  "Haha, I'd burn the biryani 🍳 but I'm great with TechNexus stuff — events, community, joining, you name it!",
  "That's a cool topic 😄 Not quite my expertise though — want to hear what's happening at TechNexus?",
  "Oh nice one! I'm a TechNexus specialist though 😊 Ask me about our events or how to get involved!",
];

// ---------- Official TechNexus links ----------

const LINKS = {
  linkedin: "https://www.linkedin.com/company/technexuscommunity/posts/?feedView=all",
  meetup: "https://www.meetup.com/technexus-community/",
  instagram: "https://www.instagram.com/technexus.community/",
  youtube: "https://www.youtube.com/@TechNexus_Community",
};

const ALL_LINKS_BLOCK =
  `Here's how to connect with TechNexus 🚀\n\n` +
  `• LinkedIn: ${LINKS.linkedin}\n` +
  `• Meetup: ${LINKS.meetup}\n` +
  `• Instagram: ${LINKS.instagram}\n` +
  `• YouTube: ${LINKS.youtube}\n\n` +
  `Follow us, RSVP for events, and join the community!`;

function detectLinkIntent(q: string): string | null {
  const askLinkedIn = /\blinkedin\b/.test(q);
  const askMeetup = /\bmeetup\b/.test(q);
  const askInstagram = /\b(instagram|insta)\b/.test(q);
  const askYoutube = /\b(youtube|yt)\b/.test(q);

  const specificCount = [askLinkedIn, askMeetup, askInstagram, askYoutube].filter(Boolean).length;

  if (specificCount === 1) {
    if (askLinkedIn) return `Here's our LinkedIn 👉 ${LINKS.linkedin}`;
    if (askMeetup) return `Here's our Meetup page 👉 ${LINKS.meetup}`;
    if (askInstagram) return `Here's our Instagram 👉 ${LINKS.instagram}`;
    if (askYoutube) return `Here's our YouTube channel 👉 ${LINKS.youtube}`;
  }

  if (specificCount > 1) {
    const lines: string[] = ["Here you go 🚀"];
    if (askLinkedIn) lines.push(`• LinkedIn: ${LINKS.linkedin}`);
    if (askMeetup) lines.push(`• Meetup: ${LINKS.meetup}`);
    if (askInstagram) lines.push(`• Instagram: ${LINKS.instagram}`);
    if (askYoutube) lines.push(`• YouTube: ${LINKS.youtube}`);
    return lines.join("\n");
  }

  const joinOrUpdates =
    /\b(how (do|can) i join|how to join|join (the )?(community|technexus)|where (can|do) i (get|find) updates|get updates|stay updated|community links?|social links?|social media|where (can|do) i follow|follow technexus|all (your )?links?)\b/.test(q);

  if (joinOrUpdates) return ALL_LINKS_BLOCK;

  return null;
}

const GREETING_PATTERNS = /^(hi|hello|hey|yo|sup|hola|howdy|greetings|what'?s up|wassup|hii+|heyy+|broo*|okay+|ok|lol|lmao|haha|hmm+|yo+)\s*[!?.]*$/i;

const GREETING_RESPONSES = [
  "Hey! 👋 How can I help you with TechNexus today?",
  "Hi there 😊 What would you like to know about TechNexus?",
  "Hello! 👋 Got any questions about TechNexus? I'm here to help!",
  "Hey hey! 😄 Ask me anything about TechNexus — events, how to join, and more!",
];

// ---------- Event-intent routing ----------

interface EventIntent {
  upcoming: boolean;
  past: boolean;
  recent: boolean;
  meetupsOnly: boolean;
  city?: string;
}

function detectEventIntent(q: string): EventIntent | null {
  const isEventQuery = /\b(event|events|hackathon|conference|bootcamp|meetup|meetups|workshop|session)\b/.test(q);

  const upcoming = /\b(upcoming|next|future|coming up|scheduled)\b/.test(q);
  const past = /\b(past|previous|last|recent|earlier|completed|history of events|happened|been)\b/.test(q);
  const recent = /\b(recent|latest|last|previous)\b/.test(q);

  // Explicit "do you have meetups?" — only then talk about regular meetups
  const meetupsOnly = /\bdo you (have|hold|run|conduct)\b.*\bmeetups?\b/.test(q) ||
                      /^are there (any )?meetups?\b/.test(q);

  let city: string | undefined;
  if (/\bbengaluru|bangalore\b/.test(q)) city = "Bengaluru";
  else if (/\bchennai\b/.test(q)) city = "Chennai";
  else if (/\bsrivilliputhur\b/.test(q)) city = "Srivilliputhur";

  if (!isEventQuery && !upcoming && !past && !city && !meetupsOnly) return null;

  return { upcoming, past, recent, meetupsOnly, city };
}

function answerEventIntent(intent: EventIntent): string | null {
  // Explicit meetup question
  if (intent.meetupsOnly) {
    return "Yes — TechNexus runs regular meetups across Bengaluru, Chennai, and Srivilliputhur, plus online/hybrid sessions. Most require RSVP and joining the official TechNexus WhatsApp group.";
  }

  // Upcoming events → ONLY the upcoming entry
  if (intent.upcoming && !intent.past) {
    return `📅 Upcoming Event: **${formatEvent(UPCOMING_EVENT)}**.`;
  }

  // City-specific event question
  if (intent.city) {
    const cityEvents = NAMED_EVENTS.filter(e => e.city === intent.city);
    if (cityEvents.length > 0) {
      const upcomingInCity = cityEvents.filter(e => e.upcoming);
      const pastInCity = cityEvents.filter(e => !e.upcoming).sort((a, b) => b.order - a.order);

      if (intent.upcoming) {
        return upcomingInCity.length
          ? `Upcoming in ${intent.city}: ${upcomingInCity.map(formatEvent).join("; ")}.`
          : `No upcoming events listed for ${intent.city} right now. The next confirmed event is **${formatEvent(UPCOMING_EVENT)}**.`;
      }

      const lines = [
        ...(upcomingInCity.length ? [`Upcoming: ${upcomingInCity.map(formatEvent).join("; ")}`] : []),
        `Past events in ${intent.city}:`,
        ...pastInCity.slice(0, 6).map(e => `• ${formatEvent(e)}`),
      ];
      return lines.join("\n");
    }
  }

  // Recent / last / previous → most recent past named event
  if (intent.recent && intent.past) {
    const last = PAST_EVENTS[0];
    return `The most recent completed TechNexus event was **${formatEvent(last)}**.`;
  }

  // Past events generally → list named past events
  if (intent.past) {
    const lines = ["Recent past TechNexus events:", ...PAST_EVENTS.slice(0, 6).map(e => `• ${formatEvent(e)}`)];
    return lines.join("\n");
  }

  // Generic "events" → brief overview + upcoming pointer
  return null; // fall through to keyword search
}

// ---------- Main entry ----------

export function searchKnowledge(query: string): string {
  const trimmed = query.trim();

  // 1. Greetings
  if (GREETING_PATTERNS.test(trimmed)) {
    return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
  }

  const queryLower = trimmed.toLowerCase();

  // 2. Official links (joining, updates, social handles)
  const linkAnswer = detectLinkIntent(queryLower);
  if (linkAnswer) return linkAnswer;

  // 3. Event-intent routing (named events take priority)
  const intent = detectEventIntent(queryLower);
  if (intent) {
    const eventAnswer = answerEventIntent(intent);
    if (eventAnswer) return eventAnswer;
  }

  // 3. Keyword scoring
  const queryWords = queryLower
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const scored = knowledgeBase.map(entry => {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword)) score += 3;
      for (const word of queryWords) {
        if (keyword.includes(word) || word.includes(keyword)) score += 1;
      }
    }
    if (queryLower.includes(entry.section)) score += 2;
    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topResults = scored.filter(s => s.score >= 3).slice(0, 2);

  if (topResults.length === 0) {
    return POLITE_REDIRECTS[Math.floor(Math.random() * POLITE_REDIRECTS.length)];
  }

  return topResults.map(r => r.entry.content).join(" ");
}
