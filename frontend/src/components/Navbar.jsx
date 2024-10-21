import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
// import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-5 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">Rakshak</span>
          </div>
          {/* <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul> */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=iamrohitkandpal@gmail.com"
              target="_blank"
              className="py-2 px-3 mx-3 flex items-center before:ease relative overflow-hidden justify-center border transition-all duration-100 before:absolute before:right-0 before:top-[50] before:h-32 before:w-5 rounded-md before:translate-x-12 before:rotate-[50deg] before:bg-white before:opacity-15 before:duration-700 hover:before:-translate-x-48"
            >
              Contact
            </a>
            <a
              href="https://github.com/iamrohitkandpal/DDoS-Cloud-Protection-System.git"
              target="_blank"
              className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 mx-3 before:ease relative overflow-hidden border border-orange-500 bg-orange-800 text-white transition-all duration-100 before:absolute before:right-0 before:top-[50] before:h-32 before:w-5 rounded-md before:translate-x-12 before:rotate-45 before:bg-white before:opacity-25 before:duration-700 hover:before:-translate-x-40"
            >
              Get Architecture
            </a>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            {/* <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul> */}
            <div className="flex space-x-6">
              <a
                href="mailto: iamrohitkandpal@gmail.com"
                target="_blank"
                className="py-2 px-3 border rounded-md"
              >
                Contact
              </a>
              <a
                href="https://github.com/iamrohitkandpal/DDoS-Cloud-Protection-System.git"
                target="_blank"
                className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
              >
                Get Architecture
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
