import Link from "next/link";
import { Linkedin, Instagram, Inbox } from "lucide-react";

const services = [
  {
    name: "Engineering",
    slug: "/engineering",
  },
  {
    name: "Climate solutions",
    slug: "/climate-solutions",
  },
  {
    name: "Pumps and water services",
    slug: "/pumps-and-water-service",
  },
  {
    name: "Energy solutions",
    slug: "/energy-solutions",
  },
];

const becomeASuppelier = [
  {
    name: "Market reach",
    slug: "/market-reach",
  },
  {
    name: "Supplier testimonials",
    slug: "/supplier-testimonials",
  },
];

const company = [
  {
    name: "About",
    slug: "/about",
  },
  {
    name: "News",
    slug: "/news",
  },
  {
    name: "Careers",
    slug: "/careers",
  },
  {
    name: "Certifications",
    slug: "/certifications",
  },
];

const contact = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    url: "https://www.linkedin.com/",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    url: "https://www.instagram.com/",
  },
];

export function Footer() {
  return (
    <>
      <div className="relative z-1 flex min-h-[600px] flex-col justify-between bg-[#101828] px-4 py-14 md:px-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_1fr_1fr_1fr_1fr]">
          <div>
            <h3 className="font-bold text-white">Argonaut</h3>
            <p className="mb-4 max-w-[54ch] leading-6 font-medium tracking-[-0.02em] text-white">
              Your complete engineering partner for full, integrated EPC
              solutions for end-to-end project delivery.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">Services</h3>
            <div className="grid gap-1 text-white">
              {services.map((page) => (
                <Link
                  href={page.slug}
                  className="font-medium hover:underline"
                  key={page.slug}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">Become a Supplier</h3>
            <div className="grid gap-1 text-white">
              {becomeASuppelier.map((page) => (
                <Link
                  href={page.slug}
                  className="font-medium hover:underline"
                  key={page.slug}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">Company</h3>
            <div className="grid gap-1 text-white">
              {company.map((page) => (
                <Link
                  href={page.slug}
                  className="font-medium hover:underline"
                  key={page.slug}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">Contact</h3>
            <div className="grid gap-1 text-white">
              {contact.map((contact, index) => (
                <a
                  href={contact.url}
                  className="flex items-center gap-2 font-medium hover:underline hover:underline-offset-2"
                  target="_blank"
                  key={index}
                  rel="noopener noreferrer"
                >
                  {contact.icon}
                  {contact.name}
                </a>
              ))}
              <a
                href="mailto:dc@argonaut.com.eg"
                className="flex items-center gap-2 font-medium hover:underline hover:underline-offset-2"
              >
                <Inbox className="h-4 w-4" />
                Mail
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-white">
          <div className="my-6 h-px w-full bg-gray-300"></div>
          Copyright © {new Date().getFullYear()} Argonaut. All Rights Reserved.
        </div>
        <div
          className="absolute top-[220px] left-0 z-[-1] w-full overflow-hidden font-black tracking-[-0.03em] text-clip whitespace-nowrap text-[#c5c5c539] select-none"
          style={{ fontSize: "18.5vw", lineHeight: 1, userSelect: "none" }}
        >
          ARGONAUT
        </div>
      </div>
    </>
  );
}
