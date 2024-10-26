"use client";

import { spaceFont } from "@/lib/fonts";
import { useState } from "react";
import { Button } from "../ui/button";

function Nav() {
  const [activeSection, setActiveSection] = useState("home");

  function handleSectionChange(section: string) {
    setActiveSection(section);
    handleScroll(section);
  }

  const handleScroll = (section: string) => {
    const sectionView = document.getElementById(section);
    if (sectionView) {
      sectionView.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className='sticky top-2 w-full z-20'>
      <div
        className={`relative flex justify-evenly md:justify-center mx-auto md:gap-5 md:w-fit py-2 backdrop-blur-md px-1 md:px-5 border border-[#27bc5934] ${spaceFont.className} after:absolute after:bottom-0 after:right-0 after:size-4 after:border-r after:border-b after:border-white after:content[""] before:absolute before:top-0 before:left-0 before:size-4 before:border-l before:border-t before:border-white`}
      >
        {links.map((link) => (
          <Button
            variant={"link"}
            className={`text-white ${
              link.href === activeSection ? "underline" : "no-underline"
            } px-1 md:px-4`}
            onClick={() => handleSectionChange(link.href)}
            key={link.href}
          >
            {link.title}
          </Button>
        ))}
      </div>
    </nav>
  );
}

const links = [
  {
    href: "home",
    title: "Home",
  },
  {
    href: "features",
    title: "Features",
  },
  {
    href: "benefits",
    title: "Benefits",
  },
  {
    href: "faqs",
    title: "FAQs",
  },
  {
    href: "contact",
    title: "Contact",
  },
];

export default Nav;
