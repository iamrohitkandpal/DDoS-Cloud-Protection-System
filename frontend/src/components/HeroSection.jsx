import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import document from "../assets/PBL-1 Report.pdf";
import details from "../assets/PBL PPT.pdf";

const handleVideoError = (e) => {
  console.warn('Video could not be loaded:', e);
  e.target.style.display = 'none';
  e.target.parentNode.querySelector('.fallback-message').style.display = 'block';
};

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        DDoS Protection
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          for Gov Websites
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        The goal of this project is to develop a scalable, cloud-based DDoS
        protection system specifically designed for Indian government websites.
        The system will offer: Less Downtime, Automated responses, and
        Cloud-based Scaling.
      </p>
      <div className="flex justify-center my-10 ">
        <a
          href={details}
          target="_blank"
          className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 before:ease relative overflow-hidden border border-orange-500 bg-orange-800 text-white transition-all duration-100 before:absolute before:right-0 before:top-[50] before:h-32 before:w-5 rounded-md before:translate-x-12 before:rotate-45 before:bg-white before:opacity-25 before:duration-700 hover:before:-translate-x-40"
        >
          Details
        </a>
        <a
          href={document}
          target="_blank"
          className="py-3 px-4 mx-3 flex items-center before:ease relative overflow-hidden justify-center border transition-all duration-100 before:absolute before:right-0 before:top-[50] before:h-32 before:w-5 rounded-md before:translate-x-12 before:rotate-[50deg] before:bg-white before:opacity-15 before:duration-700 hover:before:-translate-x-48"
        >
          Documentation
        </a>
      </div>
      <div className="flex mt-10 justify-center">
        {typeof video1 !== "undefined" ? (
          <div className="relative rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4">
            <video
              autoPlay
              loop
              muted
              className="rounded-lg w-full"
              onError={handleVideoError}
            >
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="fallback-message absolute inset-0 flex items-center justify-center text-neutral-400 hidden">
              Demo Video 1
            </p>
          </div>
        ) : (
          <div className="rounded-lg w-1/2 border border-orange-700 flex items-center justify-center bg-neutral-800 mx-2 my-4 h-64">
            <p className="text-neutral-400">Demo Video 1</p>
          </div>
        )}

        {typeof video2 !== "undefined" ? (
          <div className="relative rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4">
            <video
              autoPlay
              loop
              muted
              className="rounded-lg w-full"
              onError={handleVideoError}
            >
              <source src={video2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="fallback-message absolute inset-0 flex items-center justify-center text-neutral-400 hidden">
              Demo Video 2
            </p>
          </div>
        ) : (
          <div className="rounded-lg w-1/2 border border-orange-700 flex items-center justify-center bg-neutral-800 mx-2 my-4 h-64">
            <p className="text-neutral-400">Demo Video 2</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
