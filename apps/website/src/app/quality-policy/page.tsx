import Image from "next/image";

export default function QualityPolicyPage() {
  return (
    <>
      <Image
        src={"/platform.webp"}
        className="max-h-[460px] w-full border-[1px] border-solid border-gray-200 object-cover"
        alt="About Argonaut"
        width={5559}
        height={3710}
      />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="h1 mb-6 font-medium text-gray-900">Quality Policy</h1>
        <p className="p mb-6 font-medium text-gray-700">
          At Argonaut, our commitment to quality is the cornerstone of our
          business. We strive to consistently deliver products and services that
          meet or exceed our clients&apos; expectations, while adhering to the
          highest standards of safety, reliability, and efficiency.
        </p>
        <h2 className="h3 mb-4 font-medium text-gray-900">
          Our Quality Principles
        </h2>
        <ul className="p mb-6 list-disc pl-6 text-gray-700">
          <li>
            Compliance with all applicable legal, regulatory, and contractual
            requirements
          </li>
          <li>
            Continuous improvement of our processes, products, and services
          </li>
          <li>
            Empowering our team through training, engagement, and accountability
          </li>
          <li>Fostering a culture of safety, integrity, and transparency</li>
          <li>
            Building long-term partnerships based on trust and mutual respect
          </li>
        </ul>
        <h2 className="h3 mb-4 font-medium text-gray-900">Our Commitment</h2>
        <p className="p mb-6 text-gray-700">
          We are dedicated to maintaining and continually improving our Quality
          Management System in accordance with international standards. Every
          member of the Argonaut team is responsible for upholding our quality
          objectives and ensuring client satisfaction at every stage of our
          projects.
        </p>
        <p className="p text-gray-700">
          Through innovation, expertise, and a relentless focus on quality,
          Argonaut aims to set new benchmarks in engineering excellence and
          deliver lasting value to our clients and communities.
        </p>
      </main>
    </>
  );
}
