type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
  routeType?: "user" | "admin";
};

type PageRoutesItemType = {
  title: string;
  href: string;
  icon?: string;
  isComing?: boolean;
  isNew?: boolean;
  newTab?: boolean;
  items?: PageRoutesItemType;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "VA Claims",
    items: [
      {
        title: "Claims Dashboard",
        href: "/dashboard",
        icon: "FileCheck"
      },
      {
        title: "File Manager",
        href: "/dashboard/file-manager",
        icon: "Folder"
      },
      {
        title: "VA Disability Calculator",
        href: "/dashboard/va-disability-calculator",
        icon: "Calculator"
      }
    ],
    routeType: "user"
  },
  {
    title: "Resources",
    items: [
      { title: "Service Notes", href: "/dashboard/apps/notes", icon: "StickyNote" },
      { title: "Support Chat", href: "/dashboard/apps/chat", icon: "MessageSquare" },
      {
        title: "Tasks Checklist",
        href: "/dashboard/apps/todo-list-app",
        icon: "SquareCheck",
        isComing: true
      }
    ],
    routeType: "user"
  },
  {
    title: "Resources",
    items: [
      {
        title: "VA Forms",
        href: "/components",
        icon: "FileText",
        newTab: true
      },
      {
        title: "Evidence Guides",
        href: "/blocks",
        icon: "BookOpen",
        newTab: true
      },
      {
        title: "Claim Templates",
        href: "/templates",
        icon: "FileTemplate",
        newTab: true
      },
      {
        title: "Documentation",
        href: "#",
        icon: "ClipboardMinus",
        isComing: true
      }
    ],
    routeType: "user"
  }
];

export const admin_routes: PageRoutesType[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Admin Overview",
        href: "/bdoc/overview",
        icon: "LayoutDashboard"
      },
      {
        title: "User Management",
        href: "/bdoc/users",
        icon: "Users"
      },
      {
        title: "Claims Administration",
        href: "/bdoc/claims",
        icon: "FileCheck"
      },
      {
        title: "API Keys",
        href: "/bdoc/api-keys",
        icon: "Key"
      },
      {
        title: "Analytics",
        href: "/bdoc/analytics",
        icon: "BarChart"
      },
      {
        title: "System Prompt Manager",
        href: "/bdoc/system-prompt-manager",
        icon: "MessageSquare"
      },
      {
        title: "Fine Tuning",
        href: "/bdoc/fine-tuning",
        icon: "Zap"
      }
    ],
    routeType: "admin"
  }
];
