import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Home",
        url: "/",
        icon: Icons.User,
        items: [],
        type: "user", // Show to both admin and user
      },
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
        type: "admin", // Show to both admin and user
      },
      {
        title: "COURSES",
        url: "/courses",
        icon: Icons.Calendar,
        items: [],
        type: "admin", // Only show to admin
      },
      {
        title: "CHAPTERS",
        url: "/chapters",
        icon: Icons.Calendar,
        items: [],
        type: "admin", // Only show to admin
      },
      {
        title: "MCQ",
        url: "/mcq",
        icon: Icons.Calendar,
        items: [],
        type: "admin", // Only show to admin
      },
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
        type: "admin", // Only show to admin
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
        type: "both", // Show to both admin and user
      },
      {
        title: "Course",
        url: "/user-panel/courses",
        icon: Icons.User,
        items: [],
        type: "user", // Show to both admin and user
      },

       {
        title: "Progress",
        url: "/user-panel/Progress",
        icon: Icons.User,
        items: [],
        type: "user", // Show to both admin and user
      },
       
    ],
  },
];