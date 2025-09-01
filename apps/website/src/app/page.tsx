import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>
        <button>
          <Image src={'/github.svg'} width={24} height={24} alt="GitHub" />
        </button>
      </div>
      <Image src={'/argonaut-gradient.png'} width={2160} height={1080} alt="Argonaut" />
      

    </div>
  );
}
