const Offer = () => {
  return (
    <section className="relative w-full bg-[rgb(255,224,136)] py-20 px-10 md:px-16 overflow-hidden">

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/85"></div>

      {/* CONTENT */}
      <div className="relative max-w-4xl mx-auto text-center text-white">

        {/* Small Title */}
        <p className="uppercase tracking-widest text-sm md:text-base opacity-90">
          Exclusive Offer
        </p>

        {/* Main Title */}
        <h2 className="text-3xl md:text-5xl font-serif mt-4">
          The Heritage Collection Pre-Sale
        </h2>

        {/* Quote */}
        <p className="mt-6 text-sm md:text-lg opacity-90 leading-relaxed max-w-2xl mx-auto">
          "Simplicity is the ultimate sophistication. Join the inner circle for early access."
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">

          {/* Button 1 */}
          <button className="px-6 py-3 w-full md:w-50 border bg-navtext border-white text-white uppercase tracking-wide text-sm transition duration-300 hover:bg-white hover:text-black">
            Get Access
          </button>

          {/* Button 2 */}
          <button className="px-6 py-3 w-full md:w-50 border border-white text-white uppercase tracking-wide text-sm transition duration-300 hover:bg-white hover:text-black">
            View Lookbook
          </button>

        </div>

      </div>
    </section>
  );
};

export default Offer;
