import Image from "next/image";

export default function AboutPage() {
  const values = [
    "Integrity and transparency in all our dealings",
    "Commitment to quality and safety",
    "Continuous innovation and improvement",
    "Collaboration and respect for our partners and clients",
  ];

  return (
    <>
      <Image
        src={"/workers.jpeg"}
        className="max-h-[460px] w-full border-[1px] border-solid border-gray-200 object-cover"
        alt="About Argonaut"
        width={5559}
        height={3710}
      />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="h1 mb-6 font-medium text-gray-900">About Argonaut</h1>
        <p className="p mb-6 font-medium text-gray-700">
          Argonaut is a leading trading partner and engineering specialist,
          delivering full EPC solutions for MEP, HVAC, and fire safety. With a
          proven track record across oil and gas, defense, and infrastructure
          sectors, we are committed to redefining the future through innovation,
          expertise, and unwavering quality.
        </p>
        <h2 className="h3 mb-4 font-medium text-gray-900">Our Mission</h2>
        <p className="p mb-6 text-gray-700">
          To empower our clients with reliable, efficient, and sustainable
          engineering solutions, while fostering long-term partnerships built on
          trust and excellence.
        </p>
        <h2 className="h3 mb-4 font-medium text-gray-900">Our Values</h2>
        <ul className="p mb-6 list-disc pl-6 text-gray-700">
          {values.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
        <h2 className="h3 mb-4 font-medium text-gray-900">Our Legacy</h2>
        <p className="p mb-6 text-gray-700">
          With decades of experience, Argonaut has become synonymous with
          reliability and technical excellence. Our team of experts brings
          together deep industry knowledge and a passion for delivering results
          that exceed expectations.
        </p>
        <p className="p text-gray-700">
          Join us as we continue to shape a legacy of engineering excellence and
          redefine what&apos;s possible for our clients and communities.
        </p>
      </main>
    </>
  );
}
