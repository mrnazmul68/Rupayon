import { FooterSkeleton } from "./Skeletons";

const NavbarSkeleton = () => (
  <nav className="w-full md:px-16 bg-navbg text-navtext border border-border shadow-md fixed top-0 left-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-3 h-14 flex items-center justify-between">
      <div className="h-12 w-12 border-2 border-navtext rounded-2xl bg-gray-200"></div>
      <div className="hidden md:flex gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded w-16"></div>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-4">
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-9 w-9 rounded-full bg-gray-200"></div>
      </div>
      <div className="md:hidden flex flex-col gap-1">
        <div className="w-6 h-0.5 bg-gray-200"></div>
        <div className="w-6 h-0.5 bg-gray-200"></div>
        <div className="w-6 h-0.5 bg-gray-200"></div>
      </div>
    </div>
  </nav>
);

const HeroSkeleton = () => (
  <section className="relative top-12 w-full h-screen overflow-hidden">
    <div className="h-screen w-full absolute inset-0 bg-gray-300"></div>
    <div className="absolute inset-0 bg-black/30"></div>
    <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6 md:px-16">
      <div className="max-w-xl md:pl-30 text-left text-white animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-10 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-12 bg-gray-800 rounded-md w-32"></div>
      </div>
    </div>
  </section>
);

const SkeletonLoader = () => {
  return (
    <div>
      <NavbarSkeleton />
      <div className="min-h-screen">
        <HeroSkeleton />
      </div>
      <FooterSkeleton />
    </div>
  );
};

export default SkeletonLoader;
