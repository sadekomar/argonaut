import Image from "next/image";

export const clientIcons = [
  "agility-global-integrated-logistics.jpg",
  "ahli-united-bank.jpg",
  "al-futtaim.jpg",
  "amana.jpg",
  "amec.jpg",
  "apache.jpg",
  "arabtec.jpg",
  "archirodon.jpg",
  "asgc.jpg",
  "ayoubco.jpg",
  "beltone.jpg",
  "bonar-yarns.jpg",
  "booz-allen-hamilton.jpg",
  "borouge.jpg",
  "brookfield-multiplex.jpg",
  "bsbg.jpg",
  "cbi.jpg",
  "ccc.jpg",
  "contrack.jpg",
  "damac.jpg",
  "detac.jpg",
  "enppi.jpg",
  "evolvence.jpg",
  "fawaz-alhokair.jpg",
  "gilbane.jpg",
  "h&m.jpg",
  "hassan-allam.jpg",
  "hlo.jpg",
  "ikea.jpg",
  "kbr.jpg",
  "kele.jpg",
  "khalda.jpg",
  "military.jpg",
  "mnk.jpg",
  "national-food-products-company.jpg",
  "navfac.jpg",
  "orascom.jpg",
  "palm-hills.jpg",
  "petrojet.jpg",
  "snc.jpg",
  "sonatrach.jpg",
  "total.jpg",
];

export function TrustedByEgyptsTopCompanies() {
  return (
    <>
      <h3 className="h3 mx-20 mt-20 font-bold">
        {"Trusted by Egypt's top companies"}
      </h3>

      {/* Client Icons Marquee */}
      <div className="relative mb-10 overflow-hidden py-8">
        <div className="animate-marquee flex space-x-8">
          {/* First set of icons */}
          {clientIcons.map((icon, index) => (
            <div key={`first-${index}`} className="flex-shrink-0">
              <Image
                src={`/clients/${icon}`}
                alt={`Client ${icon.replace(".jpg", "")}`}
                width={100}
                height={100}
                className="h-16 w-auto object-contain mix-blend-luminosity grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clientIcons.map((icon, index) => (
            <div key={`second-${index}`} className="flex-shrink-0">
              <Image
                src={`/clients/${icon}`}
                alt={`Client ${icon.replace(".jpg", "")}`}
                width={100}
                height={100}
                className="h-16 w-auto object-contain mix-blend-luminosity grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
