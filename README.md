# 🤖 Community Helper Bot

> **TechNexus AI Support Assistant — powered by Mistral AI**

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Mistral](https://img.shields.io/badge/Mistral-Nemo-orange)

---

## 📖 What is this?

An AI-powered chat widget for the **TechNexus** community. It answers questions about events, rules, roles, moderation, and how to get started — right from the browser, no backend needed.

---

## ⚙️ How It Works

1. User sends a message in the chat widget
2. The bot searches the local TechNexus knowledge base for relevant context
3. Context is sent to the **Mistral AI API** which generates a friendly, accurate response
4. If the API is unavailable, the bot falls back to the local knowledge base automatically

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **AI** | Mistral API (`open-mistral-nemo`) |
| **Build Tool** | Vite |

---

## 📁 Project Structure

```
community-helper-bot/
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx        # Main chat UI — calls Mistral API directly
│   │   ├── ChatMessage.tsx       # Renders messages with markdown support
│   │   ├── ChatBot.tsx           # Floating button + open/close animation
│   │   └── TypingIndicator.tsx   # Animated typing dots
│   └── lib/
│       └── knowledgeBase.ts      # TechNexus knowledge base + fallback search
├── knowledge_base/
│   ├── events.md
│   ├── faq.md
│   ├── rules.md
│   ├── roles.md
│   ├── moderation.md
│   ├── overview.md
│   ├── history.md
│   └── getting_started.md
```

---

## 📚 Knowledge Base

| File | Contents |
|---|---|
| `events.md` | Upcoming & past TechNexus events |
| `faq.md` | Common questions and answers |
| `rules.md` | Community conduct guidelines |
| `roles.md` | Member roles and what they mean |
| `moderation.md` | How moderation works |
| `overview.md` | What TechNexus is |
| `history.md` | Community origin and growth |
| `getting_started.md` | How to join TechNexus |

---

## 🔗 TechNexus Community Links

- 💼 LinkedIn: [linkedin.com/company/technexuscommunity](https://www.linkedin.com/company/technexuscommunity/)
- 📅 Meetup: [meetup.com/technexus-community](https://www.meetup.com/technexus-community/)
- 📸 Instagram: [instagram.com/technexus.community](https://www.instagram.com/technexus.community/)
- 🎥 YouTube: [youtube.com/@TechNexus_Community](https://www.youtube.com/@TechNexus_Community)

---

*Built with ❤️ for the TechNexus Community*
