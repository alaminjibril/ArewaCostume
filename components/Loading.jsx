'use client';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-4 border-transparent border-b-emerald-300 rounded-full animate-spin [animation-duration:1.5s]"></div>
      </div>
    </div>
  );
};

export default Loading;
