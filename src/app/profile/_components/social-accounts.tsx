import Link from "next/link";
import {
  DribbleIcon,
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from "./icons";

const ACCOUNTS = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/devexhub/",
    Icon: FacebookIcon,
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/devexhub/",
    Icon: XIcon,
  },
  {
    platform: "LinkedIn",
    url: "#",
    Icon: LinkedInIcon,
  },
  {
    platform: "Youtube",
    url: "https://www.youtube.com/@DevexHub",
    Icon: DribbleIcon,
  },
  {
    platform: "Website",
    url: "https://www.devexhub.in/",
    Icon: GitHubIcon,
  },
];

export function SocialAccounts() {
  return (
    <div className="mt-4.5">
      <h4 className="mb-3.5 font-medium text-dark dark:text-white">
        Follow Devexhub
      </h4>
      <div className="flex items-center justify-center gap-3.5">
        {ACCOUNTS.map(({ Icon, ...item }) => (
          <Link
            key={item.platform}
            href={item.url}
            className="hover:text-primary"
          >
            <span className="sr-only">View {item.platform} Account</span>

            <Icon />
          </Link>
        ))}
      </div>
    </div>
  );
}
