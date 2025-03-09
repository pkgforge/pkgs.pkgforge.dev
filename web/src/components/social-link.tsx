import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const links = [
  {
    text: "GitHub",
    href: "https://github.com/pkgforge/soarpkgs",
    target: "_blank",
    icon: 1,
  },
  {
    text: "Discord",
    href: "https://discord.gg/wc3eseffpB",
    target: "_blank",
    icon: 2,
  },
];

function SocialLink() {
  return (
    <div className="flex flex-row items-center space-x-2">
      {links.map((s) => (
        <TooltipProvider key={s.text}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className:
                      "px-3 py-2 rounded-lg hover:scale-105 focus:scale-95 items-center hover:bg-muted/70",
                  }),
                )}
                href={s.href}
                target={s.target}
              >
                {s.icon == 1 ? (
                  <img
                    src="/github.svg"
                    alt="GitHub"
                    className="h-4 w-4 dark:invert"
                  />
                ) : (
                  <img
                    src="/discord.svg"
                    alt="Discord Server"
                    className="h-4 w-4 dark:invert"
                  />
                )}
                <span className="hidden">{s.text}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{s.text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export { SocialLink };
