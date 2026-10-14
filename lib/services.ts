/** @format */

// The services we sell: one entry = one landing page at /services/<slug>.
// Each page targets its own search keywords, so write for what a buyer would type into Google.
//
// Copy rule: describe WHAT we do and HOW we work. Do not add result numbers ("2x leads",
// "30% cheaper"), client names or guarantees unless you can prove them. The site is advertising,
// and unprovable claims can breach advertising rules.

export type Service = {
  slug: string;
  name: string;
  /** One-line summary used on cards and in the meta description fallback. */
  summary: string;
  /** <title> for the page (the site name is appended automatically). */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  includes: { title: string; text: string }[];
  process: { title: string; text: string }[];
  idealFor: string[];
  faqs: { q: string; a: string }[];
  /** Slugs of other services to link to at the bottom of the page. */
  related: string[];
};

const COMMON_PROCESS = {
  discover: {
    title: "Discovery call",
    text: "We learn about your business, your customers and what success looks like, then agree the scope with you.",
  },
  propose: {
    title: "Clear proposal",
    text: "You receive a written plan and quote with no obligation to proceed.",
  },
};

export const services: Service[] = [
  {
    slug: "ai-chatbot-integration",
    name: "AI Chatbot Integration",
    summary:
      "Intelligent AI chatbots for new or existing websites and apps that answer questions, qualify leads and support customers.",
    metaTitle: "AI Chatbot Integration for Websites & Apps",
    metaDescription:
      "Add an AI chatbot to your website or app. SetupGram builds and integrates chatbots that answer customer questions, capture leads and reduce repetitive support work.",
    keywords: [
      "AI chatbot integration",
      "AI chatbot for website",
      "custom chatbot development",
      "customer support chatbot",
      "lead generation chatbot",
    ],
    intro:
      "A good chatbot answers real customer questions in your tone, hands over to a person when it should, and turns visitors into enquiries. We design, build and integrate AI chatbots for new and existing websites and applications, so your customers get instant answers and your team spends less time on repetitive questions.",
    includes: [
      { title: "Conversation design", text: "We map the questions your customers actually ask and shape answers, tone and hand-over rules around them." },
      { title: "Knowledge from your business", text: "The assistant is set up to answer from information about your products, services and policies." },
      { title: "Lead capture", text: "Visitors who are ready to talk can leave their details, and enquiries land where your team already works." },
      { title: "Integration with your site or app", text: "We add the chatbot to your existing website or application, or build it into a new one." },
      { title: "Safe fallbacks", text: "When the assistant is unsure, it says so and routes the visitor to a person instead of guessing." },
      { title: "Review and improvement", text: "We look at real conversations after launch and refine answers over time." },
    ],
    process: [
      COMMON_PROCESS.discover,
      { title: "Design and build", text: "We prepare the conversation flows and knowledge, build the assistant and connect it to your site or app." },
      { title: "Test with your team", text: "You try it on real questions and we adjust before it goes live." },
      { title: "Launch and refine", text: "We go live and keep improving answers based on what visitors ask." },
    ],
    idealFor: [
      "Businesses that answer the same customer questions every day",
      "Websites that get enquiries outside working hours",
      "Teams that want to qualify leads before a person gets involved",
      "Product teams adding an assistant to an existing app",
    ],
    faqs: [
      { q: "Can you add a chatbot to a website that already exists?", a: "Yes. We integrate chatbots into existing websites and applications as well as new builds." },
      { q: "Will the chatbot make things up?", a: "AI assistants can make mistakes, so we set clear boundaries, restrict it to your business information and add a hand-over to a person for anything it cannot answer reliably. We test it with your team before launch." },
      { q: "How much does it cost?", a: "It depends on scope: the channels, the amount of knowledge and the integrations. After a short discovery call we send a clear written quote." },
      { q: "Do you support the chatbot after launch?", a: "Yes. We stay involved after delivery, reviewing conversations and improving the assistant with you." },
    ],
    related: ["app-development", "crm-solutions", "business-consulting"],
  },
  {
    slug: "app-development",
    name: "App Development",
    summary:
      "Fast, scalable web, Android and iOS applications built around your business needs, from first idea to launch.",
    metaTitle: "Custom App Development: Web, Android & iOS",
    metaDescription:
      "SetupGram builds custom web, Android and iOS applications, from planning and design to launch and support. Talk to us about your app idea.",
    keywords: [
      "app development company India",
      "custom web application development",
      "Android app development",
      "iOS app development",
      "mobile app developers",
    ],
    intro:
      "Whether you need a customer-facing app, an internal tool or a full product, we build fast, scalable web, Android and iOS applications tailored to how your business works. We plan the scope with you, build in clear stages and stay involved after launch.",
    includes: [
      { title: "Web applications", text: "Modern, responsive web apps and portals that work on every device." },
      { title: "Android and iOS apps", text: "Mobile apps for both major platforms, built to feel fast and familiar." },
      { title: "Product planning", text: "We turn your idea into a clear scope, screens and a build plan before writing code." },
      { title: "Integrations", text: "Payments, CRMs, messaging, analytics and other tools your business already uses." },
      { title: "AI features", text: "Chatbots and automation built into your product when they add real value." },
      { title: "Launch and support", text: "We help you release the app and keep improving it afterwards." },
    ],
    process: [
      COMMON_PROCESS.discover,
      COMMON_PROCESS.propose,
      { title: "Build in stages", text: "We deliver working pieces you can review, so there are no surprises at the end." },
      { title: "Launch and iterate", text: "We release, measure how people use the app and improve it with you." },
    ],
    idealFor: [
      "Founders turning an idea into a first product",
      "Businesses that need a custom internal tool or customer portal",
      "Companies replacing spreadsheets and manual processes",
      "Teams that need web and mobile versions of the same product",
    ],
    faqs: [
      { q: "Which platforms do you build for?", a: "Web, Android and iOS." },
      { q: "How long will my app take?", a: "It depends on scope. We give a realistic timeline in the proposal after the discovery call, and you see working progress along the way." },
      { q: "Can you improve an app I already have?", a: "Yes. Tell us what you have and what is not working, and we will suggest the best next step." },
      { q: "Do you work with clients outside India?", a: "Yes. We are based in India and work with clients remotely worldwide." },
    ],
    related: ["ai-chatbot-integration", "crm-solutions", "business-consulting"],
  },
  {
    slug: "crm-solutions",
    name: "CRM Solutions",
    summary:
      "Custom CRM setup and integrations that organise leads and customers and streamline day-to-day operations.",
    metaTitle: "CRM Solutions & Integrations for Growing Businesses",
    metaDescription:
      "Organise leads, customers and follow-ups with a CRM built around your process. SetupGram designs, customises and integrates CRM systems.",
    keywords: [
      "CRM development",
      "custom CRM software",
      "CRM integration services",
      "lead management system",
      "sales pipeline software",
    ],
    intro:
      "When leads live in inboxes and spreadsheets, follow-ups get missed. We set up and customise CRM systems that fit your sales process, connect them to your website, forms and tools, and make sure your team can see every enquiry and its status in one place.",
    includes: [
      { title: "Process mapping", text: "We model how a lead becomes a customer in your business and build the CRM around it." },
      { title: "Custom CRM or integration", text: "A purpose-built CRM, or integration with the one you already use." },
      { title: "Lead capture", text: "Website forms, chatbot conversations and other sources feed straight into the pipeline." },
      { title: "Status and follow-ups", text: "Clear stages, ownership and reminders so no enquiry is forgotten." },
      { title: "Notifications", text: "Your team is alerted when a new enquiry arrives." },
      { title: "Training and support", text: "We show your team how to use it and stay available afterwards." },
    ],
    process: [
      COMMON_PROCESS.discover,
      { title: "Design the pipeline", text: "We agree stages, fields and automations that match how you sell." },
      { title: "Build and connect", text: "We build the CRM and connect your website, forms and other tools." },
      { title: "Train and improve", text: "We train your team and refine the setup as you use it." },
    ],
    idealFor: [
      "Businesses tracking leads in spreadsheets or email",
      "Sales teams that lose track of follow-ups",
      "Companies that want website enquiries to flow straight into a pipeline",
      "Owners who want a clear view of leads and conversions",
    ],
    faqs: [
      { q: "Can you work with the CRM we already use?", a: "Yes. We can integrate and customise existing systems, or recommend a better fit if yours is holding you back." },
      { q: "Can website enquiries go directly into the CRM?", a: "Yes. Website forms and chatbot conversations can feed leads into your pipeline automatically." },
      { q: "Do you provide training?", a: "Yes. We train your team and remain available after the system goes live." },
    ],
    related: ["ai-chatbot-integration", "app-development", "digital-marketing"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    summary:
      "Data-driven SEO, social media and performance marketing designed around the outcomes your business cares about.",
    metaTitle: "Digital Marketing, SEO & Social Media Services",
    metaDescription:
      "Grow your business online with SEO, content, social media and performance marketing from SetupGram. Strategy, execution and reporting in one team.",
    keywords: [
      "digital marketing services",
      "SEO services India",
      "social media marketing",
      "performance marketing agency",
      "content marketing",
    ],
    intro:
      "Digital marketing works when strategy, content and measurement fit together. We plan and run SEO, social media and performance marketing around your goals, track what is working and report back in plain language.",
    includes: [
      { title: "SEO", text: "Keyword research, on-page improvements, technical fixes and content that helps the right customers find you." },
      { title: "Content marketing", text: "Articles and pages that answer what your customers are searching for." },
      { title: "Social media", text: "Content planning and campaigns for the platforms where your audience spends time." },
      { title: "Performance marketing", text: "Campaigns focused on measurable actions such as enquiries and sales." },
      { title: "Analytics and tracking", text: "Set up so you can see which activity brings in enquiries." },
      { title: "Reporting", text: "Regular, plain-language updates and next steps." },
    ],
    process: [
      COMMON_PROCESS.discover,
      { title: "Strategy", text: "We agree goals, audiences and channels, and what we will measure." },
      { title: "Execute", text: "We create, publish and optimise across the agreed channels." },
      { title: "Measure and improve", text: "We review results with you and adjust the plan." },
    ],
    idealFor: [
      "Businesses that want to be found on Google",
      "Brands starting or restarting their social media presence",
      "Companies that want marketing tied to enquiries, not just traffic",
      "Teams without an in-house marketing function",
    ],
    faqs: [
      { q: "How quickly will SEO work?", a: "SEO builds over time and nobody can honestly promise a ranking. We focus on the fundamentals, measure progress and explain it to you regularly." },
      { q: "Do you guarantee results?", a: "No honest agency can guarantee rankings or sales. We commit to clear strategy, careful execution and transparent reporting." },
      { q: "Can you also run paid ads?", a: "Yes. See our Advertising service for paid campaigns on Google, Meta and more." },
    ],
    related: ["advertising", "business-consulting", "ai-chatbot-integration"],
  },
  {
    slug: "advertising",
    name: "Advertising",
    summary:
      "Paid campaigns on Google, Meta, Instagram, LinkedIn, YouTube and more, with full-funnel strategy from creative to conversions.",
    metaTitle: "Paid Advertising: Google, Meta, Instagram & LinkedIn Ads",
    metaDescription:
      "SetupGram plans and manages paid ad campaigns on Google, Meta, Instagram, LinkedIn and YouTube, with creative, targeting, A/B testing and daily optimisation.",
    keywords: [
      "Google Ads management",
      "Meta ads agency",
      "Instagram advertising",
      "LinkedIn ads management",
      "performance marketing India",
    ],
    intro:
      "We manage paid campaigns across Google, Meta, Instagram, LinkedIn, YouTube and other platforms. That covers strategy, creative, targeting, A/B testing and daily optimisation, so your budget goes toward the audiences and messages that bring in enquiries.",
    includes: [
      { title: "Campaign strategy", text: "Goals, audiences, budget split and funnel stages agreed before anything goes live." },
      { title: "Creative", text: "Ad copy and visuals built for each platform." },
      { title: "Targeting", text: "Audiences and keywords chosen around your customers." },
      { title: "A/B testing", text: "We test messages and creatives and keep what performs." },
      { title: "Daily optimisation", text: "Budgets and bids are reviewed and adjusted regularly." },
      { title: "Tracking and reporting", text: "Conversion tracking set up and clear reports on spend and results." },
    ],
    process: [
      COMMON_PROCESS.discover,
      { title: "Plan the funnel", text: "We define platforms, audiences, creatives and what counts as a conversion." },
      { title: "Launch and test", text: "Campaigns go live with structured tests." },
      { title: "Optimise and report", text: "We optimise continuously and report results with you." },
    ],
    idealFor: [
      "Businesses ready to put budget behind ads",
      "Brands launching a product or offer",
      "Companies whose current ads are not bringing enquiries",
      "Teams that want one partner for creative and campaign management",
    ],
    faqs: [
      { q: "Which platforms do you advertise on?", a: "Google, Meta (Facebook and Instagram), LinkedIn, YouTube and other major platforms, chosen to fit your audience." },
      { q: "Do I pay for ads separately?", a: "Ad spend is paid to the platforms; our management is agreed with you in the proposal. We explain both clearly up front." },
      { q: "Can you promise a return on ad spend?", a: "No one can honestly guarantee that. We set up tracking, test carefully and optimise toward your goals, and we report openly on what works." },
    ],
    related: ["digital-marketing", "crm-solutions", "business-consulting"],
  },
  {
    slug: "business-consulting",
    name: "Business Consulting",
    summary:
      "Strategic roadmaps and market-entry plans for businesses moving online and scaling their digital presence.",
    metaTitle: "Digital Transformation & Business Consulting",
    metaDescription:
      "Get a clear roadmap for taking your business online. SetupGram offers strategic consulting, digital transformation planning and market-entry advice.",
    keywords: [
      "digital transformation consulting",
      "business consulting India",
      "online business strategy",
      "technology consulting",
      "go-to-market strategy",
    ],
    intro:
      "Moving a business online raises big questions: what to build first, which tools to use and how to reach customers. Our consulting gives you a clear, practical roadmap, grounded in your goals and resources, that you can act on with us or with your own team.",
    includes: [
      { title: "Digital roadmap", text: "A prioritised plan for your website, tools, marketing and technology." },
      { title: "Market-entry planning", text: "How to position and launch online in a new market or segment." },
      { title: "Technology guidance", text: "Which platforms and tools fit your size and budget." },
      { title: "Growth strategy", text: "Where to invest time and budget for the best return." },
      { title: "Process improvement", text: "Finding manual work that can be automated." },
      { title: "Execution support", text: "We can help deliver the plan if you want us to." },
    ],
    process: [
      COMMON_PROCESS.discover,
      { title: "Assess", text: "We review your current situation, goals and constraints." },
      { title: "Roadmap", text: "We deliver a prioritised plan with clear next steps." },
      { title: "Support", text: "We help you carry out the plan, or hand it to your team." },
    ],
    idealFor: [
      "Traditional businesses moving online",
      "Founders unsure what to build or buy first",
      "Companies entering a new market",
      "Owners who want an outside view before investing",
    ],
    faqs: [
      { q: "Do I have to hire you to build what you recommend?", a: "No. The roadmap is yours to use with us or anyone else." },
      { q: "How do we start?", a: "Book a free consultation. We will talk through your goals and suggest the best next step." },
    ],
    related: ["digital-marketing", "app-development", "ai-chatbot-integration"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
