import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>
        <button>
          Hello
        </button>
      </div>
      <Image src={'/argonaut-gradient.png'} width={2160} height={1080} alt="Argonaut" />
      

    </div>
  );
}
