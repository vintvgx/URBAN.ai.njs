import { Settings2, Frame, PieChart } from "lucide-react";

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  versions: [
    // {
    //   name: "Version 3",
    //   // logo: GalleryVerticalEnd,
    //   version: "v3",
    // },
    {
      name: "Version 2",
      // logo: GalleryVerticalEnd,
      version: "v2",
    },
    {
      name: "Version 1",
      // logo: GalleryVerticalEnd,
      version: "v1",
    },
  ],
  navMain: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
