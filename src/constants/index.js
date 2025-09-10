// import { people01, people02, people03, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star  } from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "How it works",
    title: "How it works",
  },
  {
    id: "FAQ",
    title: "FAQ",
  },
];

export const features = [
  {
    id: "feature-1",
    // icon: star,
    title: "Timetable Generation",
    content:
      "Generate optimized schedules with AI-driven accuracy.",
  },
  {
    id: "feature-2",
    // icon: shield,
    title: "Faculty Load Balancing",
    content:
      "Distribute teaching workload with AI-driven fairness.",
  },
  {
    id: "feature-3",
    // icon: send,
    title: "Optimal Room Allocation",
    content:
      "Assign classrooms and labs efficiently based on availability and capacity.",
  },
];

export const HowItWorks = [
  {
    id: "HowItWorks-1",
    content:
    //Collect & Validate Inputs 
      "Admin, Faculty, Lab In-Charge and Students upload data and constraints (courses, enrollments, room/lab capacities, faculty availability, break policy). The system validates inputs and flags missing/conflicting information.",
    // name: "Herman Jensen",
    // title: "Founder & Leader",
    // img: people01,
  },
  {
    id: "HowItWorks-2",
    content:
    //AI Optimization & Conflict Resolution
      "The Optimization Engine runs the AI/optimization model (ILP/OR-Tools, heuristics) to produce an optimal timetable: room allocations, balanced faculty loads, and lab/equipment schedules. It detects clashes, suggests alternatives, and assigns staggered breaks.",
    // name: "Steve Mark",
    // title: "Founder & Leader",
    // img: people02,
  },
  {
    id: "HowItWorks-3",
    content:
    //Review, Publish & Monitor
      "Admin/Faculty/Students review the draft, apply manual overrides if needed, then publish the final timetable. The dashboard shows utilization reports and alerts; the system supports re-optimization on changes and ongoing monitoring.",
    // name: "Kenn Gallagher",
    // title: "Founder & Leader",
    // img: people03,
  },
];

export const FAQ = [
  {
    id: "FAQ-1",
    title: "How is this better than using Excel or ERP tools?",
    content: "Unlike static tools, our system uses AI optimization to automatically detect clashes, balance faculty workload, and assign rooms/labs efficiently.",
  },
  {
    id: "FAQ-2",
    title: "Can faculty or students request timetable changes?",
    content: "Yes, faculty can request workload adjustments, and students can view updated timetables instantly after admin approval.",
  },
  {
    id: "FAQ-3",
    title: "What if constraints or policies change mid-semester?",
    content: "The system re-optimizes schedules dynamically, allowing admins to update inputs and generate conflict-free timetables in real-time.",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    // icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    // icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    // icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    // icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

export const clients = [
  {
    id: "client-1",
    // logo: airbnb,
  },
  {
    id: "client-2",
    // logo: binance,
  },
  {
    id: "client-3",
    // logo: coinbase,
  },
  {
    id: "client-4",
    // logo: dropbox,
  },
];