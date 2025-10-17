import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      // User-specific items
      {
        title: "Home",
        url: "/",
        icon: Icons.User,
        items: [],
        type: "user",
      },
      {
        title: "Course",
        url: "/user-panel/courses",
        icon: Icons.User,
        items: [],
        type: "user",
      },

      // Admin-specific items
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
        type: "admin",
      },
      {
        title: "COURSES",
        url: "/courses",
        icon: Icons.Calendar,
        items: [],
        type: "admin",
      },
      // {
      //   title: "CHAPTERS",
      //   url: "/add-chapter",
      //   icon: Icons.Calendar,
      //   items: [],
      //   type: "admin",
      // },
      // {
      //   title: "LESSONS",
      //   url: "/lessons",
      //   icon: Icons.Calendar,
      //   items: [],
      //   type: "admin",
      // },
      // {
      //   title: "MCQ",
      //   url: "/add-mcq",
      //   icon: Icons.Calendar,
      //   items: [],
      //   type: "admin",
      // },
      {
        title: "USER DETAILS",
        icon: Icons.Alphabet,
        items: [
          {
            title: "User List",
            url: "/users",
          },
          {
            title: "User Details",
            url: "/users/user-details",
          },
        ],
        type: "admin",
      },

      // Super Admin-specific items
      {
        title: "Super Admin Dashboard",
        url: "/super-admin/dashboard",
        icon: Icons.HomeIcon,
        items: [],
        type: "Super-Admin",
      },
      {
        title: "Manage Admins",
        url: "/super-admin/request-admins",
        icon: Icons.User,
        items: [],
        type: "Super-Admin",
      },
      {
        title: "System Settings",
        url: "/super-admin/settings",
        icon: Icons.Calendar,
        items: [],
        type: "Super-Admin",
      },
      {
        title: "All Users",
        url: "/super-admin/all-users",
        icon: Icons.Alphabet,
        items: [],
        type: "Super-Admin",
      },

      // Common items for all roles
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
        type: "both",
      },

      {
        title: "Modules",
        url: "/admin-panel/Modules",
        icon: Icons.User,
        items: [],
        type: "admin",
      },
    ],
  },
];