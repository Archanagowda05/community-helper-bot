export interface KnowledgeEntry {
  section: string;
  content: string;
  keywords: string[];
}

const knowledgeBase: KnowledgeEntry[] = [
  // Overview
  {
    section: "overview",
    content: "Welcome to our community! We are a vibrant group of creators, developers, and enthusiasts who come together to share knowledge, collaborate on projects, and support each other's growth. Founded in 2020, our community has grown to over 5,000 members across multiple platforms.",
    keywords: ["community", "about", "overview", "what is", "who", "introduction", "welcome"],
  },
  {
    section: "overview",
    content: "Our community focuses on technology, creative arts, and professional development. We host regular events, maintain open-source projects, and provide mentorship opportunities for members at all skill levels.",
    keywords: ["focus", "mission", "purpose", "technology", "creative", "development"],
  },
  // Events
  {
    section: "events",
    content: "We host weekly community meetups every Wednesday at 7 PM EST via our virtual meeting room. These meetups feature guest speakers, project showcases, and open discussion sessions. All members are welcome to attend and participate.",
    keywords: ["meetup", "weekly", "wednesday", "meeting", "event", "schedule"],
  },
  {
    section: "events",
    content: "Our annual Community Summit takes place every September. It's a 3-day event featuring workshops, hackathons, networking sessions, and keynote presentations from industry leaders. Early bird registration typically opens in June.",
    keywords: ["summit", "annual", "conference", "hackathon", "workshop", "september"],
  },
  {
    section: "events",
    content: "Monthly skill-sharing sessions happen on the first Saturday of each month. Members can sign up to teach a 30-minute session on any topic they're passionate about. Past topics include web development, digital art, machine learning, and public speaking.",
    keywords: ["skill", "sharing", "monthly", "saturday", "teach", "learn", "session"],
  },
  // FAQ
  {
    section: "faq",
    content: "To join our community, simply visit our website and click 'Join Now'. You'll need to create an account and agree to our community guidelines. Membership is free and open to everyone regardless of experience level.",
    keywords: ["join", "sign up", "register", "membership", "free", "how to join"],
  },
  {
    section: "faq",
    content: "We communicate primarily through our Discord server, community forum, and weekly newsletter. Important announcements are posted across all channels. You can customize your notification preferences in your account settings.",
    keywords: ["communicate", "discord", "forum", "newsletter", "notifications", "channels"],
  },
  {
    section: "faq",
    content: "Yes, we have channels and groups for different interests including web development, data science, design, gaming, and general discussion. You can join any channel that interests you from the channels directory.",
    keywords: ["channels", "groups", "interests", "web development", "data science", "design"],
  },
  // Roles
  {
    section: "roles",
    content: "Community roles include: Member (default), Contributor (active participants who help others), Moderator (community guardians who enforce guidelines), and Admin (community leadership team). Roles are earned through consistent positive participation.",
    keywords: ["roles", "member", "contributor", "moderator", "admin", "leadership"],
  },
  {
    section: "roles",
    content: "To become a Contributor, you need to be an active member for at least 3 months, help answer questions regularly, and be nominated by an existing Contributor or Moderator. Contributors get access to exclusive channels and early event registration.",
    keywords: ["contributor", "become", "requirements", "nomination", "benefits", "promotion"],
  },
  // Moderation
  {
    section: "moderation",
    content: "Our moderation team is available 24/7 to ensure a safe and welcoming environment. If you encounter any issues, you can report them using the /report command in Discord or by contacting a moderator directly. All reports are handled confidentially.",
    keywords: ["moderation", "report", "safety", "moderator", "issue", "help"],
  },
  {
    section: "moderation",
    content: "Violations of community guidelines result in a three-strike system: first offense receives a warning, second offense results in a temporary mute (24-72 hours), and third offense leads to a permanent ban. Severe violations may result in immediate action.",
    keywords: ["violation", "strike", "warning", "ban", "mute", "punishment", "offense"],
  },
  // Rules
  {
    section: "rules",
    content: "Core community rules: 1) Be respectful and inclusive to all members. 2) No spam, self-promotion, or advertising without permission. 3) Keep discussions on-topic in designated channels. 4) No harassment, hate speech, or discriminatory behavior.",
    keywords: ["rules", "guidelines", "respect", "spam", "harassment", "behavior"],
  },
  {
    section: "rules",
    content: "Content sharing rules: Share original content or properly credit sources. No piracy or sharing of copyrighted material. NSFW content is strictly prohibited. Technical discussions should include context and be constructive.",
    keywords: ["content", "sharing", "copyright", "nsfw", "original", "credit"],
  },
  // History
  {
    section: "history",
    content: "Our community was founded in March 2020 by a small group of 12 developers who wanted to create a supportive learning environment during the global pandemic. What started as a small Discord server quickly grew into a thriving multi-platform community.",
    keywords: ["history", "founded", "origin", "started", "beginning", "2020", "pandemic"],
  },
  {
    section: "history",
    content: "Key milestones: 2020 - Community founded with 12 members. 2021 - Reached 1,000 members, launched mentorship program. 2022 - First annual summit, launched open-source initiative. 2023 - 5,000+ members, partnered with tech companies for events. 2024 - Launched AI Assistant and expanded globally.",
    keywords: ["milestones", "growth", "timeline", "achievements", "history"],
  },
];

export function searchKnowledge(query: string): string {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

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
  const topResults = scored.filter(s => s.score > 0).slice(0, 3);

  if (topResults.length === 0) {
    return "I'm sorry, I don't have that information in our knowledge base. Please contact a community admin for further assistance.";
  }

  return topResults.map(r => r.entry.content).join("\n\n");
}
