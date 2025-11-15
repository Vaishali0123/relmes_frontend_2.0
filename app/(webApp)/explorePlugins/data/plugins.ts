export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rating: number;
  reviews: number;
  downloads: string;
  price: "Free" | "Paid";
  featured: boolean;
  trending: boolean;
  developer: string;
  version: string;
  features: string[];
  pricing: {
    basic: { price: number; features: string[] };
    pro: { price: number; features: string[] };
    enterprise: { price: number; features: string[] };
  };
}

export const mockPlugins: Plugin[] = [
  {
    id: "1",
    name: "Advanced Analytics",
    description:
      "Track server performance with real-time analytics and insights",
    category: "Analytics",
    icon: "📊",
    rating: 4.8,
    reviews: 1245,
    downloads: "50K+",
    price: "Paid",
    featured: true,
    trending: true,
    developer: "DataPro",
    version: "2.1.0",
    features: [
      "Real-time monitoring",
      "Custom dashboards",
      "Alert system",
      "Export reports",
    ],
    pricing: {
      basic: { price: 9.99, features: ["Basic analytics", "Daily reports"] },
      pro: {
        price: 29.99,
        features: [
          "Advanced analytics",
          "Real-time alerts",
          "Custom dashboards",
        ],
      },
      enterprise: {
        price: 99.99,
        features: [
          "Everything in Pro",
          "API access",
          "Priority support",
          "Custom integrations",
        ],
      },
    },
  },
  {
    id: "2",
    name: "Security Shield",
    description:
      "Protect your server from threats with advanced security features",
    category: "Security",
    icon: "🛡️",
    rating: 4.9,
    reviews: 2100,
    downloads: "100K+",
    price: "Paid",
    featured: true,
    trending: false,
    developer: "SecureTech",
    version: "3.0.1",
    features: [
      "Firewall protection",
      "DDoS mitigation",
      "Threat detection",
      "Auto-updates",
    ],
    pricing: {
      basic: { price: 14.99, features: ["Basic firewall", "Weekly scans"] },
      pro: {
        price: 39.99,
        features: [
          "Advanced firewall",
          "DDoS protection",
          "Real-time monitoring",
        ],
      },
      enterprise: {
        price: 129.99,
        features: [
          "Everything in Pro",
          "24/7 monitoring",
          "Custom rules",
          "White-glove support",
        ],
      },
    },
  },
  {
    id: "3",
    name: "Backup Manager",
    description: "Automated backups with cloud storage integration",
    category: "Backup",
    icon: "💾",
    rating: 4.7,
    reviews: 890,
    downloads: "35K+",
    price: "Free",
    featured: false,
    trending: true,
    developer: "CloudSync",
    version: "1.5.2",
    features: [
      "Automated backups",
      "Cloud storage",
      "Restore points",
      "Scheduled backups",
    ],
    pricing: {
      basic: { price: 0, features: ["Daily backups", "5GB storage"] },
      pro: {
        price: 19.99,
        features: ["Hourly backups", "50GB storage", "Cloud sync"],
      },
      enterprise: {
        price: 79.99,
        features: [
          "Everything in Pro",
          "Unlimited storage",
          "Multi-region backup",
          "Priority restore",
        ],
      },
    },
  },
  {
    id: "4",
    name: "Performance Booster",
    description:
      "Optimize server performance with smart caching and compression",
    category: "Performance",
    icon: "⚡",
    rating: 4.6,
    reviews: 1567,
    downloads: "75K+",
    price: "Paid",
    featured: false,
    trending: false,
    developer: "SpeedUp",
    version: "2.3.0",
    features: [
      "Smart caching",
      "Image optimization",
      "CDN integration",
      "Load balancing",
    ],
    pricing: {
      basic: { price: 12.99, features: ["Basic caching", "Image compression"] },
      pro: {
        price: 34.99,
        features: ["Advanced caching", "CDN integration", "Load balancing"],
      },
      enterprise: {
        price: 109.99,
        features: [
          "Everything in Pro",
          "Custom optimization",
          "Dedicated support",
          "SLA guarantee",
        ],
      },
    },
  },
  {
    id: "5",
    name: "Email Notifier",
    description: "Send automated email notifications for server events",
    category: "Communication",
    icon: "📧",
    rating: 4.5,
    reviews: 432,
    downloads: "20K+",
    price: "Free",
    featured: false,
    trending: false,
    developer: "NotifyMe",
    version: "1.2.1",
    features: [
      "Email templates",
      "Event triggers",
      "Multi-recipient",
      "Custom schedules",
    ],
    pricing: {
      basic: { price: 0, features: ["100 emails/month", "Basic templates"] },
      pro: {
        price: 7.99,
        features: [
          "1000 emails/month",
          "Custom templates",
          "Advanced triggers",
        ],
      },
      enterprise: {
        price: 49.99,
        features: [
          "Unlimited emails",
          "API access",
          "Custom branding",
          "Priority support",
        ],
      },
    },
  },
  {
    id: "6",
    name: "Database Optimizer",
    description: "Keep your databases running at peak performance",
    category: "Database",
    icon: "🗄️",
    rating: 4.7,
    reviews: 678,
    downloads: "28K+",
    price: "Paid",
    featured: true,
    trending: false,
    developer: "DBMaster",
    version: "1.8.0",
    features: [
      "Query optimization",
      "Index management",
      "Performance tuning",
      "Health monitoring",
    ],
    pricing: {
      basic: {
        price: 16.99,
        features: ["Basic optimization", "Health checks"],
      },
      pro: {
        price: 44.99,
        features: ["Advanced optimization", "Auto-tuning", "Query analysis"],
      },
      enterprise: {
        price: 139.99,
        features: [
          "Everything in Pro",
          "Custom optimization",
          "Dedicated DBA",
          "24/7 monitoring",
        ],
      },
    },
  },
  {
    id: "7",
    name: "Task Scheduler",
    description: "Schedule and automate tasks with ease",
    category: "Automation",
    icon: "⏰",
    rating: 4.4,
    reviews: 321,
    downloads: "15K+",
    price: "Free",
    featured: false,
    trending: true,
    developer: "AutoTask",
    version: "1.0.5",
    features: ["Cron jobs", "Task queue", "Error handling", "Logging"],
    pricing: {
      basic: { price: 0, features: ["5 scheduled tasks", "Basic logging"] },
      pro: {
        price: 11.99,
        features: ["Unlimited tasks", "Advanced logging", "Error alerts"],
      },
      enterprise: {
        price: 59.99,
        features: [
          "Everything in Pro",
          "Priority queue",
          "Custom workflows",
          "API access",
        ],
      },
    },
  },
  {
    id: "8",
    name: "API Gateway",
    description: "Manage and secure your APIs with advanced routing",
    category: "API",
    icon: "🔌",
    rating: 4.8,
    reviews: 987,
    downloads: "42K+",
    price: "Paid",
    featured: true,
    trending: false,
    developer: "APIGenius",
    version: "2.5.1",
    features: ["API routing", "Rate limiting", "Authentication", "Analytics"],
    pricing: {
      basic: { price: 18.99, features: ["Basic routing", "Rate limiting"] },
      pro: {
        price: 49.99,
        features: ["Advanced routing", "Authentication", "Analytics"],
      },
      enterprise: {
        price: 149.99,
        features: [
          "Everything in Pro",
          "Custom integrations",
          "Dedicated support",
          "SLA",
        ],
      },
    },
  },
];
