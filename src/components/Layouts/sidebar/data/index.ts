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
        url: "/admin/dashboard",
        items: [],
        type: "admin",
      },
      {
  title: "COURSES",
  url: "/admin/courses",
  icon: Icons.Calendar,
  items: [],
  type: "both", // Change from "admin" to "both"
},
      {
        title: "USER DETAILS",
        icon: Icons.Alphabet,
        items: [
          {
            title: "User List",
            url: "/users",
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
        title: "Admins",
        url: "/super-admin/admins-requests",
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
        title: "Admin Log details",
        url: "/super-admin/log-details",
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
        title: "User",
        url: "/super-admin/all-user",
        icon: Icons.User,
        items: [],
        type: "Super-Admin",
      }


    ],
  },
];