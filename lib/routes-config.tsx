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
        title: "Claim Types",
        href: "#",
        icon: "ListCheck",
        items: [
          { title: "Disability Claims", href: "/dashboard/ecommerce" },
          { title: "Conditions List", href: "/dashboard/pages/products" },
          { title: "Condition Details", href: "/dashboard/pages/products/1" },
          { title: "Add Condition", href: "/dashboard/pages/products/create" },
          { title: "Claims List", href: "/dashboard/pages/orders" },
          { title: "Claim Detail", href: "/dashboard/pages/orders/detail" }
        ]
      },
      {
        title: "Claims Analytics",
        href: "/dashboard/website-analytics",
        icon: "BarChart"
      },
      {
        title: "Document Management",
        href: "/dashboard/project-management",
        icon: "FolderDot"
      },
      {
        title: "File Manager",
        href: "/dashboard/file-manager",
        icon: "Folder"
      },
      { title: "Compensation Rates", href: "/dashboard/crypto", icon: "DollarSign" },
      { title: "Treatment Tracker", href: "/dashboard/hospital-management", icon: "Activity" }
    ],
    routeType: "user"
  },
  {
    title: "Resources",
    items: [
      {
        title: "Claim Tracker",
        href: "/dashboard/apps/kanban",
        icon: "SquareKanban",
        isComing: true
      },
      { title: "Service Notes", href: "/dashboard/apps/notes", icon: "StickyNote" },
      { title: "Support Chat", href: "/dashboard/apps/chat", icon: "MessageSquare" },
      { title: "VA Notifications", href: "/dashboard/apps/mail", icon: "Mail", isComing: true },
      {
        title: "Tasks Checklist",
        href: "/dashboard/apps/todo-list-app",
        icon: "SquareCheck",
        isComing: true
      },
      {
        title: "Document Uploader",
        href: "/dashboard/apps/file-manager",
        icon: "ArchiveRestore",
        isComing: true
      },
      { title: "eBenefits Access", href: "/dashboard/apps/api-keys", icon: "Key", isComing: false }
    ],
    routeType: "user"
  },
  {
    title: "User Pages",
    items: [
      {
        title: "Veterans",
        href: "/dashboard/pages/users",
        icon: "Users",
        items: [
          { title: "Veterans List", href: "/dashboard/pages/users" },
          { title: "Veteran Profile", href: "/dashboard/pages/profile" }
        ]
      },
      {
        title: "Settings",
        href: "/dashboard/pages/settings",
        icon: "Settings",
        items: [
          { title: "Profile", href: "/dashboard/pages/settings" },
          { title: "Account", href: "/dashboard/pages/settings/account" },
          { title: "Appearance", href: "/dashboard/pages/settings/appearance" },
          { title: "Notifications", href: "/dashboard/pages/settings/notifications" },
          { title: "Display", href: "/dashboard/pages/settings/display" }
        ]
      },
      {
        title: "Benefits",
        href: "#",
        icon: "Shield",
        items: [
          { title: "Disability Benefits", href: "/dashboard/pages/pricing/column" },
          { title: "Compensation Table", href: "/dashboard/pages/pricing/table" },
          { title: "Appeals Process", href: "/dashboard/pages/pricing/single" }
        ]
      },
      {
        title: "Authentication",
        href: "/",
        icon: "Fingerprint",
        items: [
          { title: "Login v1", href: "/dashboard/login/v1" },
          { title: "Login v2", href: "/dashboard/login/v2" },
          { title: "Register v1", href: "/dashboard/register/v1" },
          { title: "Register v2", href: "/dashboard/register/v2" },
          { title: "Forgot Password", href: "/dashboard/forgot-password" }
        ]
      },
      {
        title: "Error Pages",
        href: "/",
        icon: "Fingerprint",
        items: [
          { title: "404", href: "/dashboard/pages/error/404" },
          { title: "500", href: "/dashboard/pages/error/500" },
          { title: "403", href: "/dashboard/pages/error/403" }
        ]
      },
      {
        title: "VA.gov",
        href: "https://www.va.gov",
        icon: "ExternalLink",
        newTab: true
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
        title: "Analytics",
        href: "/bdoc/analytics",
        icon: "BarChart"
      }
    ],
    routeType: "admin"
  }
];
