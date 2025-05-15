import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Uniform Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-white opacity-70 -z-10" />
      
      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Text Content (Left Side) */}
          <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              Predict Football Wins with <span className="text-primary-500">NFE</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-xl mx-auto lg:mx-0">
              AI-powered insights and real-time analytics to help you make smarter football predictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/predictions"
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/how-it-works"
                className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-medium rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Image Content (Right Side) */}
          <div className="lg:w-1/2 relative px-4 flex justify-center">
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
              <Image
                src="/football.png"
                alt="Football"
                fill
                className="object-contain"
                priority
              />
              
              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-md">
                <div className="text-primary-500 font-bold text-sm md:text-base lg:text-lg">95%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-black/90 backdrop-blur-sm p-3 rounded-lg border border-gray-800 shadow-md">
                <div className="text-primary-400 font-bold text-sm md:text-base lg:text-lg">24/7</div>
                <div className="text-xs text-gray-300">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrolling indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border-2 border-gray-400 rounded-full">
          <div className="w-1 h-2 bg-gray-400 mx-auto mt-1 rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
