export interface KnowledgeEntry {
  section: string;
  content: string;
  keywords: string[];
}

const knowledgeBase: KnowledgeEntry[] = [
  // Overview
  {
    section: "overview",
    content: "TechNexus is a student-driven technology community focused on learning, collaboration, and innovation.",
    keywords: ["community", "about", "overview", "what is", "technexus", "introduction", "welcome"],
  },
  {
    section: "overview",
    content: "The mission of TechNexus is to bridge the gap between academic learning and real-world technology skills by providing a platform for continuous learning and peer collaboration.",
    keywords: ["mission", "purpose", "goal", "vision", "academic", "skills"],
  },
  {
    section: "overview",
    content: "TechNexus is open to students, beginners, and technology enthusiasts interested in software development, artificial intelligence, data science, and emerging technologies.",
    keywords: ["join", "eligible", "students", "beginners", "open to", "members", "who can join"],
  },
  // Events
  {
    section: "events",
    content: "TechNexus conducts weekly meetups every Sunday at 10 AM where members discuss technical topics, share learning resources, and review progress.",
    keywords: ["meetup", "weekly", "sunday", "meeting", "event", "schedule"],
  },
  {
    section: "events",
    content: "A monthly hackathon is organized on the last Saturday of every month, encouraging members to build innovative projects in teams.",
    keywords: ["hackathon", "monthly", "saturday", "projects", "teams", "competition"],
  },
  {
    section: "events",
    content: "Hands-on workshops and short bootcamps are conducted regularly on topics such as web development, AI, machine learning, and cloud computing.",
    keywords: ["workshop", "bootcamp", "training", "web development", "ai", "machine learning", "cloud"],
  },
  {
    section: "events",
    content: "Industry professionals and experienced developers are invited to share insights and career guidance through guest speaker sessions.",
    keywords: ["guest", "speaker", "industry", "career", "guidance", "session"],
  },
  // FAQ
  {
    section: "faq",
    content: "You can join TechNexus by registering through the official website or by accepting an invitation shared by a community member.",
    keywords: ["join", "register", "sign up", "membership", "how to join", "invite"],
  },
  {
    section: "faq",
    content: "No, TechNexus is completely free to join. There is no membership fee.",
    keywords: ["fee", "cost", "price", "free", "payment", "charge"],
  },
  {
    section: "faq",
    content: "No prior experience is required. Beginners are welcome and encouraged to learn through community activities.",
    keywords: ["experience", "beginner", "prerequisite", "requirement", "skill level", "new"],
  },
  {
    section: "faq",
    content: "Event updates are shared through the community website, email notifications, and official communication channels.",
    keywords: ["updates", "notifications", "email", "announcements", "stay updated", "news"],
  },
  // Roles
  {
    section: "roles",
    content: "Community Members participate in discussions, attend events, and collaborate on projects.",
    keywords: ["member", "role", "participate", "default"],
  },
  {
    section: "roles",
    content: "Moderators ensure that community rules are followed and help maintain a positive and inclusive environment.",
    keywords: ["moderator", "moderate", "enforce", "rules"],
  },
  {
    section: "roles",
    content: "Organizers are responsible for planning events, managing schedules, and coordinating community activities.",
    keywords: ["organizer", "organize", "planning", "events", "coordinate"],
  },
  {
    section: "roles",
    content: "Mentors guide members by providing technical advice, project feedback, and career suggestions.",
    keywords: ["mentor", "guide", "advice", "feedback", "career"],
  },
  // Moderation
  {
    section: "moderation",
    content: "The TechNexus moderation team monitors discussions and activities to ensure a safe and respectful community environment.",
    keywords: ["moderation", "safety", "monitor", "environment"],
  },
  {
    section: "moderation",
    content: "Members who violate community rules may receive warnings or face temporary or permanent removal depending on the severity.",
    keywords: ["violation", "warning", "ban", "removal", "punishment", "strike"],
  },
  {
    section: "moderation",
    content: "Any inappropriate behavior or concerns can be reported directly to moderators or organizers for review.",
    keywords: ["report", "inappropriate", "concern", "complaint", "issue"],
  },
  // Rules
  {
    section: "rules",
    content: "All members must maintain respectful and professional behavior while interacting within the TechNexus community.",
    keywords: ["rules", "guidelines", "respect", "behavior", "professional"],
  },
  {
    section: "rules",
    content: "Posting irrelevant links, advertisements, or promotional content without permission is strictly prohibited.",
    keywords: ["spam", "advertising", "promotion", "links", "prohibited"],
  },
  {
    section: "rules",
    content: "Members are encouraged to collaborate, help others, and give proper credit for shared work or ideas.",
    keywords: ["collaborate", "credit", "sharing", "ethics", "teamwork"],
  },
  {
    section: "rules",
    content: "Harassment, discrimination, or abusive language of any form is not tolerated in the TechNexus community.",
    keywords: ["harassment", "discrimination", "abuse", "hate", "conduct"],
  },
  // History
  {
    section: "history",
    content: "TechNexus was founded by a group of passionate students aiming to create a collaborative technology learning environment.",
    keywords: ["history", "founded", "origin", "started", "beginning", "created"],
  },
  {
    section: "history",
    content: "The community grew through word-of-mouth, consistent events, and peer-driven learning initiatives.",
    keywords: ["growth", "grew", "expand", "word of mouth"],
  },
  {
    section: "history",
    content: "Key milestones include hosting the first hackathon, organizing industry-led workshops, and reaching a growing member base across multiple institutions.",
    keywords: ["milestones", "achievements", "hackathon", "workshops", "institutions"],
  },
  // Getting Started
  {
    section: "getting_started",
    content: "To get started, register through the official TechNexus website or accept an invitation. Membership is free. Introduce yourself in the welcome channel and explore available resources.",
    keywords: ["getting started", "start", "begin", "onboard", "new member", "first steps", "how to start"],
  },
  {
    section: "getting_started",
    content: "Attend your first weekly meetup on Sunday at 10 AM, join a project or study group, and start asking questions in discussion channels.",
    keywords: ["first event", "meetup", "study group", "project", "contribute", "participate"],
  },
];

const STOP_WORDS = new Set([
  "the", "is", "are", "was", "were", "what", "who", "how", "why", "when",
  "where", "which", "that", "this", "can", "does", "has", "have", "had",
  "will", "would", "should", "could", "may", "might", "shall", "been",
  "being", "about", "with", "from", "into", "for", "and", "but", "not",
  "you", "your", "they", "their", "our", "its", "also", "than", "then",
  "tell", "show", "give", "know", "like", "just", "some", "any", "all",
  "very", "more", "most", "other", "each", "every", "both", "few", "many",
]);

const POLITE_REDIRECTS = [
  "That's a cool topic 😄 I'm here to help with TechNexus events and community info though! Anything you'd like to know?",
  "Haha, I wish I knew more about that! 😊 But hey, want to hear about what's happening at TechNexus?",
  "Great question! Not quite my thing though — I'm all about TechNexus. Ask me about events, roles, or how to join!",
  "Hey, that sounds interesting! 😊 I'm best at TechNexus stuff though — events, community details, you name it!",
  "Oh nice topic! I'm a TechNexus specialist though 😄 Want to know about our events or how to get involved?",
];

const GREETING_PATTERNS = /^(hi|hello|hey|yo|sup|hola|howdy|greetings|what'?s up|wassup|hii+|heyy+|broo*|okay+|ok|lol|lmao|haha|hmm+|yo+)\s*[!?.]*$/i;

const GREETING_RESPONSES = [
  "Hey! 👋 How can I help you with TechNexus today?",
  "Hi there 😊 What would you like to know about TechNexus?",
  "Hello! 👋 Got any questions about TechNexus? I'm here to help!",
  "Hey hey! 😄 Ask me anything about TechNexus — events, roles, how to join, and more!",
];

export function searchKnowledge(query: string): string {
  const trimmed = query.trim();

  // Handle greetings
  if (GREETING_PATTERNS.test(trimmed)) {
    return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
  }

  const queryLower = trimmed.toLowerCase();
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
