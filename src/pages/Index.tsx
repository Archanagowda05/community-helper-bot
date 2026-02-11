import { Users, Calendar, Shield, HelpCircle, Award, BookOpen } from "lucide-react";
import ChatBot from "@/components/ChatBot";

const sections = [
  { icon: Users, title: "Community Overview", desc: "Learn about who we are and what we do" },
  { icon: Calendar, title: "Events & Meetups", desc: "Weekly meetups, summits, and skill-shares" },
  { icon: HelpCircle, title: "FAQ", desc: "Common questions answered quickly" },
  { icon: Award, title: "Roles", desc: "Member, Contributor, Moderator paths" },
  { icon: Shield, title: "Moderation", desc: "How we keep the community safe" },
  { icon: BookOpen, title: "Rules & History", desc: "Guidelines and our origin story" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            5,000+ members strong
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Welcome to Our Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            A vibrant space for creators, developers, and enthusiasts. Ask our AI Assistant anything about the community!
          </p>
        </div>
      </header>

      {/* Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <Icon className="w-5 h-5 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          💬 Click the chat button to ask our AI Assistant about any of these topics
        </p>
      </section>

      <ChatBot />
    </div>
  );
};

export default Index;
