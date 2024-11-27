import Image from 'next/image';

export default function Loading() {
  return (
    <div className="h-full center-all flex-col">
      <Image
        src={'/transparent.png'}
        className="dark:invert animate-pulse"
        alt="icon"
        width={120}
        height={120}
        quality={50}
      />
      <h1 className="text-stone-400 animate-pulse text-sm">Loading</h1>
    </div>
  );
}
