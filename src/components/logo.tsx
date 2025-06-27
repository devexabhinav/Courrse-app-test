import logo from "@/assets/logos/logo.webp";
import darktheme from "@/assets/logos/darktheme.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-50 w-[10.847rem]">
      <Image
        src={logo}
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        width={100} // 10.847rem = 173.55px (1rem = 16px)
        height={10}    // h-8 = 2rem = 32px
        quality={50}
      />

      <Image
        src={darktheme}
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        width={100}
        height={10}
        quality={50}
      />
    </div>
  );
}
