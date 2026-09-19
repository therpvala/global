import {
  LayoutDashboard, Users, Briefcase, ShoppingCart, Calculator, Boxes,
  Factory, Store, Repeat, KeyRound, Handshake, Building2, Sparkles,
  Building, GitBranch, WifiOff, ShieldCheck, BarChart3, FileText,
  Settings, Plug, ScrollText, Bell, MessageSquare, Calendar, Star,
  Clock, Bookmark, Zap, Target, Activity, TrendingUp, Search, Workflow,
  FlaskConical, FileSearch, User, Folder, FileCheck, Globe, Palette, Lock, KanbanSquare, Bug,
  Headphones, BookOpen, FileSignature, Brush, FileBarChart, Map,
  Smartphone, MonitorSmartphone, Wallet, Trophy, Network, Bot, Crown,
  Eye, Brain, Server, Globe2, Flag, Terminal, Scale, ListTodo, DollarSign, Home,
  Code2 as Code2Icon,
  Megaphone, HeartHandshake, UserCircle, Timer, MonitorPlay, Lightbulb,
  Radar, Rocket, Beaker, Gauge, Boxes as BoxesIcon, MessageCircle, ClipboardList,
  Shield, PlayCircle, LineChart, Layers, GraduationCap, Landmark, Truck, LifeBuoy,
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
  { title: "Permission Audit", url: "/permission-audit", icon: FileSearch, group: "Security", desc: "Allow/deny event log" },

  // System
  { title: "Profile", url: "/profile", icon: User, group: "System", desc: "Your profile" },
  { title: "Wallet", url: "/wallet", icon: Wallet, group: "System", desc: "Balance & payouts" },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy, group: "System", desc: "Top performers" },
  { title: "Achievements", url: "/achievements", icon: Trophy, group: "System", desc: "Rewards · XP · trophies · ranks" },
  { title: "Theme", url: "/theme", icon: Palette, group: "System", desc: "Branding & theme" },
  { title: "Roles", url: "/roles", icon: ShieldCheck, group: "System", desc: "Permissions matrix" },
  { title: "Role Simulator", url: "/role-simulator", icon: FlaskConical, group: "System", desc: "Test effective access" },
  { title: "Role Comparison", url: "/role-compare", icon: FileSearch, group: "System", desc: "Diff grants between roles" },
  { title: "Settings", url: "/settings", icon: Settings, group: "System", desc: "Full configuration" },

  // ===== Control Panel · Grade 1 (Command) =====
  { title: "Boss Dashboard", url: "/cp/boss", icon: Crown, group: "Control Panel · Command", desc: "Master owner cockpit" },
  { title: "CEO Dashboard", url: "/cp/ceo", icon: Eye, group: "Control Panel · Command", desc: "Executive read-only cockpit" },
  { title: "Vala AI", url: "/cp/vala-ai", icon: Brain, group: "Control Panel · Command", desc: "AI management core" },
  { title: "Server Manager", url: "/cp/server-manager", icon: Server, group: "Control Panel · Command", desc: "Infra & uptime control" },
  { title: "AMS Manager", url: "/cp/ams-manager", icon: LifeBuoy, group: "Control Panel · Command", desc: "Achievement & ticket management system" },
  { title: "AI API Manager", url: "/cp/api-ai-manager", icon: Zap, group: "Control Panel · Command", desc: "AI keys, quotas, routing" },

  // ===== Control Panel · Grade 2 (Delivery) =====
  { title: "Development Manager", url: "/cp/development-manager", icon: Code2Icon, group: "Control Panel · Delivery", desc: "Engineering delivery control" },
  { title: "Product Manager", url: "/cp/product-manager", icon: BoxesIcon, group: "Control Panel · Delivery", desc: "Roadmap & releases" },
  { title: "Demo Manager", url: "/cp/demo-manager", icon: Terminal, group: "Control Panel · Delivery", desc: "Demo environments" },
  { title: "Task Manager", url: "/cp/task-manager", icon: ListTodo, group: "Control Panel · Delivery", desc: "Work queues & SLAs" },
  { title: "Promise Tracker", url: "/cp/promise-tracker", icon: Timer, group: "Control Panel · Delivery", desc: "Commitments & deadlines" },
  { title: "Assist Manager", url: "/cp/assist-manager", icon: MonitorPlay, group: "Control Panel · Delivery", desc: "Assisted sessions" },

  // ===== Control Panel · Grade 3 (Growth) =====
  { title: "Marketing Manager", url: "/cp/marketing-manager", icon: Megaphone, group: "Control Panel · Growth", desc: "Campaigns & spend" },
  { title: "SEO Manager", url: "/cp/seo-manager", icon: Search, group: "Control Panel · Growth", desc: "Rankings & content ops" },
  { title: "Lead Manager", url: "/cp/lead-manager", icon: Target, group: "Control Panel · Growth", desc: "Lead routing & scoring" },
  { title: "Sales & Support", url: "/cp/sales-support", icon: Headphones, group: "Control Panel · Growth", desc: "Revenue + service desk" },
  { title: "Customer Support", url: "/cp/customer-support", icon: HeartHandshake, group: "Control Panel · Growth", desc: "Tickets & CSAT" },

  // ===== Control Panel · Grade 4 (Network) =====
  { title: "Franchise Owner", url: "/cp/franchise-owner", icon: Building2, group: "Control Panel · Network", desc: "Franchise P&L" },
  { title: "Reseller Manager", url: "/cp/reseller-manager", icon: Handshake, group: "Control Panel · Network", desc: "Channel performance" },
  { title: "Influencer Manager", url: "/cp/influencer-manager", icon: Users, group: "Control Panel · Network", desc: "Creator programs" },
  { title: "Influencer Dashboard", url: "/cp/influencer-dashboard", icon: User, group: "Control Panel · Network", desc: "Creator earnings view" },

  // ===== Control Panel · Grade 5 (Regions) =====
  { title: "Continent Admin", url: "/cp/continent-admin", icon: Globe2, group: "Control Panel · Regions", desc: "Continent-level control" },
  { title: "Country Admin", url: "/cp/country-admin", icon: Flag, group: "Control Panel · Regions", desc: "Country-level control" },

  // ===== Control Panel · Grade 6 (Corporate) =====
  { title: "Finance Manager", url: "/cp/finance-manager", icon: DollarSign, group: "Control Panel · Corporate", desc: "Revenue, payouts, budgets" },
  { title: "Legal Manager", url: "/cp/legal-manager", icon: Scale, group: "Control Panel · Corporate", desc: "Contracts & compliance" },
  { title: "Developer Dashboard", url: "/cp/developer-dashboard", icon: Code2Icon, group: "Control Panel · Corporate", desc: "Individual dev cockpit" },
  { title: "Pro Manager", url: "/cp/pro-manager", icon: Star, group: "Control Panel · Corporate", desc: "Pro tier operations" },

  // ===== Control Panel · Grade 7 (Portals) =====
  { title: "Pro User Dashboard", url: "/cp/pro-user", icon: UserCircle, group: "Control Panel · Portals", desc: "Pro customer workspace" },
  { title: "Basic User Dashboard", url: "/cp/basic-user", icon: User, group: "Control Panel · Portals", desc: "Basic customer workspace" },
  { title: "Client Portal", url: "/cp/client-portal", icon: Landmark, group: "Control Panel · Portals", desc: "Client-facing portal" },
  { title: "Career Portal", url: "/cp/career-portal", icon: GraduationCap, group: "Control Panel · Portals", desc: "Careers & applications" },

  // ===== Control Panel · Grade 8 (Core) =====
  { title: "CP Home", url: "/cp/home", icon: Home, group: "Control Panel · Core", desc: "Control panel home" },
  { title: "CP Security", url: "/cp/security", icon: Shield, group: "Control Panel · Core", desc: "Unified security center" },
  { title: "CP Settings", url: "/cp/settings", icon: Settings, group: "Control Panel · Core", desc: "System settings" },
  { title: "Performance Manager", url: "/cp/performance", icon: Gauge, group: "Control Panel · Core", desc: "Role performance tracking" },
  { title: "Internal Chat", url: "/cp/internal-chat", icon: MessageCircle, group: "Control Panel · Core", desc: "Masked internal chat" },
  { title: "Incident & Crisis", url: "/cp/incidents", icon: Truck, group: "Control Panel · Core", desc: "Incident command" },

  // ===== R&D Department =====
  { title: "R&D Dashboard", url: "/rnd", icon: Lightbulb, group: "R&D", desc: "Research & development HQ" },
  { title: "Innovation Pipeline", url: "/rnd/pipeline", icon: Layers, group: "R&D", desc: "Idea → prototype → launch" },
  { title: "AI Idea Scorer", url: "/rnd/idea-scorer", icon: Bot, group: "R&D", desc: "Score & rank ideas" },
  { title: "Prototype Builder", url: "/rnd/prototype", icon: Rocket, group: "R&D", desc: "Prototype workbench" },
  { title: "Technology Radar", url: "/rnd/radar", icon: Radar, group: "R&D", desc: "Adopt · trial · assess · hold" },
  { title: "Trend Scanner", url: "/rnd/trends", icon: LineChart, group: "R&D", desc: "Market & tech signals" },
  { title: "Future Lab", url: "/rnd/future-lab", icon: Beaker, group: "R&D", desc: "Long-horizon experiments" },
  { title: "Impact Analyzer", url: "/rnd/impact", icon: BarChart3, group: "R&D", desc: "ROI & impact modelling" },
  { title: "Decision Board", url: "/rnd/decisions", icon: ClipboardList, group: "R&D", desc: "Go / no-go decisions" },
  { title: "Feedback Portal", url: "/rnd/feedback", icon: MessageSquare, group: "R&D", desc: "Customer & internal input" },
  { title: "R&D Wallet", url: "/rnd/wallet", icon: Wallet, group: "R&D", desc: "Research budget & payouts" },
  { title: "R&D Assistant", url: "/rnd/assistant", icon: Sparkles, group: "R&D", desc: "AI research copilot" },
  { title: "R&D Demos", url: "/rnd/demos", icon: PlayCircle, group: "R&D", desc: "Prototype demo library" },
];

export const groups = Array.from(new Set(modules.map(m => m.group)));
