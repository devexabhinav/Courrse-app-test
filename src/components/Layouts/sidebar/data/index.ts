import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "COURSES",
        url: "/courses",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "CHAPTERS",
        url: "/chapters",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "MCQ",
        url: "/mcq",
        icon: Icons.Calendar,
        items: [],
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
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
