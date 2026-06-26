import {
  LayoutDashboard, Users, Briefcase, ShoppingCart, Calculator, Boxes,
  Factory, Store, Repeat, KeyRound, Handshake, Building2, Sparkles,
  Building, GitBranch, WifiOff, ShieldCheck, BarChart3, FileText,
  Settings, Plug, ScrollText, Bell, MessageSquare, Calendar, Star,
  Clock, Bookmark, Zap, Target, Activity, TrendingUp, Search, Workflow,
  User, Folder, FileCheck, Globe, Palette, Lock, KanbanSquare, Bug,
  Headphones, BookOpen, FileSignature, Brush, FileBarChart, Map,
  Smartphone, MonitorSmartphone, Wallet, Trophy, Network, Bot, Crown,
  Server, Database, HardDrive, Cpu, GitMerge, Brain, CreditCard, Scale,
  DollarSign, Compass, Megaphone, LifeBuoy, MapPin, Globe2, LogOut, Link2,
} from "lucide-react";

export type ModuleItem = {
  title: string;
  url: string;
  icon: any;
  group: string;
  desc: string;
};

export const modules: ModuleItem[] = [
  // Master
  { title: "Super Admin", url: "/super-admin", icon: Crown, group: "Master", desc: "Master operating control" },
  // Overview
  { title: "Welcome", url: "/welcome", icon: Sparkles, group: "Overview", desc: "Onboarding & quick start" },
  { title: "AI Dashboard", url: "/dashboard", icon: LayoutDashboard, group: "Overview", desc: "Live KPIs & insights" },
  { title: "Executive", url: "/executive", icon: TrendingUp, group: "Overview", desc: "C-suite overview" },
  { title: "Live Analytics", url: "/live", icon: Activity, group: "Overview", desc: "Real-time metrics" },
  { title: "Calendar", url: "/calendar", icon: Calendar, group: "Overview", desc: "Schedule & events" },
  { title: "Activity", url: "/activity", icon: Clock, group: "Overview", desc: "Recent activity timeline" },
  { title: "Favorites", url: "/favorites", icon: Star, group: "Overview", desc: "Pinned items" },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark, group: "Overview", desc: "Saved views" },
  { title: "Goals", url: "/goals", icon: Target, group: "Overview", desc: "OKRs & targets" },

  // Sales
  { title: "CRM", url: "/crm", icon: Users, group: "Sales", desc: "Leads & pipeline" },
  { title: "Sales / ERP", url: "/erp", icon: Briefcase, group: "Sales", desc: "Quotes, orders, invoicing" },
  { title: "POS", url: "/pos", icon: ShoppingCart, group: "Sales", desc: "Point of sale" },
  { title: "Marketplace", url: "/marketplace", icon: Store, group: "Sales", desc: "Multi-vendor marketplace" },
  { title: "Subscriptions", url: "/subscriptions", icon: Repeat, group: "Sales", desc: "Recurring billing" },

  // Finance
  { title: "Accounting", url: "/accounting", icon: Calculator, group: "Finance", desc: "Ledger & reports" },
  { title: "Invoices", url: "/invoices", icon: FileText, group: "Finance", desc: "Invoice builder" },

  // Operations
  { title: "Inventory", url: "/inventory", icon: Boxes, group: "Operations", desc: "Stock & warehouses" },
  { title: "Manufacturing", url: "/manufacturing", icon: Factory, group: "Operations", desc: "BoM, MO, work centers" },
  { title: "Projects", url: "/projects", icon: KanbanSquare, group: "Operations", desc: "Tasks, sprints, gantt" },

  // People
  { title: "HRM", url: "/hrm", icon: Briefcase, group: "People", desc: "Employees, payroll, leave" },
  { title: "Recruitment", url: "/recruitment", icon: Network, group: "People", desc: "Hiring pipeline" },

  // Partners
  { title: "Licenses", url: "/licenses", icon: KeyRound, group: "Partners", desc: "Issue & manage" },
  { title: "Resellers", url: "/resellers", icon: Handshake, group: "Partners", desc: "Channel partners" },
  { title: "Franchises", url: "/franchises", icon: Building2, group: "Partners", desc: "Franchise network" },
  { title: "MLM Tree", url: "/mlm", icon: Network, group: "Partners", desc: "Referral tree" },

  // Organization
  { title: "Multi Company", url: "/companies", icon: Building, group: "Organization", desc: "Companies & ledgers" },
  { title: "Multi Branch", url: "/branches", icon: GitBranch, group: "Organization", desc: "Branches & regions" },
  { title: "Org Chart", url: "/org-chart", icon: Workflow, group: "Organization", desc: "Hierarchy view" },

  // Insights
  { title: "Analytics", url: "/analytics", icon: BarChart3, group: "Insights", desc: "Cross-module charts" },
  { title: "BI Reports", url: "/reports", icon: FileBarChart, group: "Insights", desc: "Enterprise reports" },
  { title: "Heatmaps", url: "/heatmaps", icon: Activity, group: "Insights", desc: "Density visualizations" },

  // Platform
  { title: "Offline Sync", url: "/offline", icon: WifiOff, group: "Platform", desc: "Offline-first queue" },
  { title: "Notifications", url: "/notifications", icon: Bell, group: "Platform", desc: "System alerts" },
  { title: "Messaging", url: "/messaging", icon: MessageSquare, group: "Platform", desc: "WhatsApp · SMS · Email" },
  { title: "AI Studio", url: "/ai-studio", icon: Sparkles, group: "Platform", desc: "AI flows & assistants" },
  { title: "AI Copilot", url: "/copilot", icon: Bot, group: "Platform", desc: "Live AI chat assistant" },
  { title: "Automation", url: "/automation", icon: Zap, group: "Platform", desc: "Triggers & workflows" },
  { title: "API Manager", url: "/api-manager", icon: Plug, group: "Platform", desc: "Keys & webhooks" },
  { title: "Documents", url: "/documents", icon: Folder, group: "Platform", desc: "Files & e-sign" },
  { title: "Approvals", url: "/approvals", icon: FileCheck, group: "Platform", desc: "Workflow approvals" },
  { title: "Website Builder", url: "/website", icon: Globe, group: "Platform", desc: "Drag-drop builder" },
  { title: "Support", url: "/support", icon: Headphones, group: "Platform", desc: "Tickets & live chat" },
  { title: "Knowledge Base", url: "/knowledge", icon: BookOpen, group: "Platform", desc: "FAQ & docs" },

  // Security
  { title: "Audit Logs", url: "/audit", icon: ShieldCheck, group: "Security", desc: "Security events" },
  { title: "Sessions", url: "/sessions", icon: MonitorSmartphone, group: "Security", desc: "Active sessions" },
  { title: "Devices", url: "/devices", icon: Smartphone, group: "Security", desc: "Registered devices" },
  { title: "Threats", url: "/threats", icon: Lock, group: "Security", desc: "Threat alerts" },
  { title: "Audit Trail", url: "/trail", icon: ScrollText, group: "Security", desc: "Change history" },

  // System
  { title: "Profile", url: "/profile", icon: User, group: "System", desc: "Your profile" },
  { title: "Wallet", url: "/wallet", icon: Wallet, group: "System", desc: "Balance & payouts" },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy, group: "System", desc: "Top performers" },
  { title: "Achievements", url: "/achievements", icon: Trophy, group: "System", desc: "Rewards · XP · trophies · ranks" },
  { title: "Theme", url: "/theme", icon: Palette, group: "System", desc: "Branding & theme" },
  { title: "Roles", url: "/roles", icon: ShieldCheck, group: "System", desc: "Permissions matrix" },
  { title: "Settings", url: "/settings", icon: Settings, group: "System", desc: "Full configuration" },

  // Executive (role dashboards)
  { title: "CEO Board", url: "/ceo", icon: Crown, group: "Executive", desc: "C-suite executive board" },
  { title: "Continent Admin", url: "/continent", icon: Globe2, group: "Executive", desc: "Continent governance" },
  { title: "Country Admin", url: "/country", icon: MapPin, group: "Executive", desc: "Country operations" },
  { title: "Tenants", url: "/tenants", icon: Building2, group: "Executive", desc: "Multi-tenant management" },

  // Infrastructure
  { title: "Tech Admin", url: "/tech-admin", icon: Server, group: "Infrastructure", desc: "Clusters & workloads" },
  { title: "Servers", url: "/servers", icon: Server, group: "Infrastructure", desc: "VMs & dedicated boxes" },
  { title: "Hosting / VPS", url: "/hosting", icon: Globe, group: "Infrastructure", desc: "Subscriptions & panels" },
  { title: "Domains & SSL", url: "/domains", icon: Globe, group: "Infrastructure", desc: "Registrar & certs" },
  { title: "Database", url: "/database", icon: Database, group: "Infrastructure", desc: "Clusters & indexes" },
  { title: "Infrastructure", url: "/infrastructure", icon: Cpu, group: "Infrastructure", desc: "Hosts & containers" },
  { title: "DevOps", url: "/devops", icon: GitMerge, group: "Infrastructure", desc: "Pipelines & DORA" },
  { title: "Observability", url: "/observability", icon: Activity, group: "Infrastructure", desc: "Logs · traces · metrics" },
  { title: "Backup", url: "/backup", icon: HardDrive, group: "Infrastructure", desc: "Jobs & restore points" },

  // Engineering
  { title: "Product", url: "/product", icon: Compass, group: "Engineering", desc: "Insights & roadmap" },
  { title: "QA", url: "/qa", icon: ShieldCheck, group: "Engineering", desc: "Test plans & runs" },
  { title: "Workflows", url: "/workflows", icon: Workflow, group: "Engineering", desc: "Visual automation" },

  // AI
  { title: "AI API", url: "/ai-api", icon: Brain, group: "AI", desc: "Models · keys · safety" },
  { title: "AI Manager", url: "/ai-manager", icon: Brain, group: "AI", desc: "Catalog & evaluations" },
  { title: "Chatbots", url: "/chatbots", icon: Bot, group: "AI", desc: "Agents & tools" },

  // Marketplace
  { title: "Authors", url: "/authors", icon: User, group: "Marketplace", desc: "Creator hub" },
  { title: "Author Page", url: "/author-page", icon: User, group: "Marketplace", desc: "Public storefront" },
  { title: "Vendors", url: "/vendors", icon: Store, group: "Marketplace", desc: "Operator console" },
  { title: "Affiliates", url: "/affiliates", icon: Link2, group: "Marketplace", desc: "Partner program" },
  { title: "Influencers", url: "/influencers", icon: Star, group: "Marketplace", desc: "Creator marketing" },
  { title: "Influencer Hub", url: "/influencer-dashboard", icon: Star, group: "Marketplace", desc: "Creator workspace" },

  // Revenue
  { title: "Payments", url: "/payments", icon: CreditCard, group: "Revenue", desc: "Charges & disputes" },
  { title: "Sales & Support", url: "/sales-support", icon: Briefcase, group: "Revenue", desc: "Unified workspace" },
  { title: "Leads", url: "/leads", icon: Target, group: "Revenue", desc: "Prospect intelligence" },
  { title: "Marketing", url: "/marketing", icon: Megaphone, group: "Revenue", desc: "Campaigns & journeys" },
  { title: "SEO Daily", url: "/seo-exec", icon: TrendingUp, group: "Revenue", desc: "Daily SEO ops" },
  { title: "Content", url: "/content", icon: FileText, group: "Revenue", desc: "Spaces & pages" },
  { title: "Live Chat", url: "/live-chat", icon: MessageSquare, group: "Revenue", desc: "Unified inbox" },
  { title: "Reseller Hub", url: "/reseller-dashboard", icon: Handshake, group: "Revenue", desc: "Partner dashboard" },

  // Back office
  { title: "Finance", url: "/finance", icon: DollarSign, group: "Back office", desc: "Close & treasury" },
  { title: "Legal", url: "/legal", icon: Scale, group: "Back office", desc: "Contracts & redlines" },
  { title: "Lawyer", url: "/lawyer", icon: Scale, group: "Back office", desc: "Practice workspace" },
  { title: "Compliance", url: "/compliance", icon: ShieldCheck, group: "Back office", desc: "Controls & evidence" },
  { title: "Operations", url: "/operations", icon: KanbanSquare, group: "Back office", desc: "Boards & workload" },
  { title: "Tasks", url: "/tasks", icon: KanbanSquare, group: "Back office", desc: "Personal queue" },
  { title: "Promises", url: "/promises", icon: Clock, group: "Back office", desc: "SLA tracker" },
  { title: "Search", url: "/search", icon: Search, group: "Back office", desc: "Indices & relevance" },

  // Account
  { title: "Pro Manager", url: "/pro-manager", icon: Crown, group: "Account", desc: "Pro program" },
  { title: "Pro Workspace", url: "/pro-user", icon: Sparkles, group: "Account", desc: "Your Pro account" },
  { title: "My Dashboard", url: "/basic-user", icon: User, group: "Account", desc: "Personal workspace" },
  { title: "Portal", url: "/portal", icon: LifeBuoy, group: "Account", desc: "Customer portal" },
  { title: "Public", url: "/public", icon: Globe, group: "Account", desc: "Public landing" },
  { title: "Global Search", url: "/global-search", icon: Search, group: "Account", desc: "Command center" },
  { title: "Sign out", url: "/logout", icon: LogOut, group: "Account", desc: "End session" },
];

export const groups = Array.from(new Set(modules.map(m => m.group)));
