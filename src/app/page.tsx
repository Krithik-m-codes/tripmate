import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src="/tripmate-logo.png"
        alt="TripMate Logo"
        width={200}
        height={200}
      />
      <h1 className="text-4xl font-bold text-center mt-8">
        Welcome to TripMate
      </h1>
      <p className="text-lg text-center mt-4">
        A travel app that helps you plan your trips, save your favorite places
        and share them with your friends.
      </p>
    </div>
  );
}
