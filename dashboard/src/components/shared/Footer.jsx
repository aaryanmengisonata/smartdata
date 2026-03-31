import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoUrl = "https://www.sonata-software.com/sites/default/files/sonata-logo.png";

  return (
    <footer className="app-header-footer fixed bottom-0 left-0 right-0 z-40 w-full h-10 border-t bg-white border-slate-200 transition-colors duration-500">
      <div className="flex items-center justify-between px-4 h-full text-[11px] font-bold uppercase tracking-widest">
        {/* Left */}
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Sonata Logo"
            className="h-5 object-contain"
          />
          <span className="text-slate-500">
            Powered by Sonata Software Limited
          </span>
        </div>

        {/* Right */}
        <div className="text-slate-500">
          © Sonata Software. All rights reserved {currentYear}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
