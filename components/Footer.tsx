"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center p-4 bg-gray-800 text-white text-sm">
      &copy; {new Date().getFullYear()} Code-resolve. All rights reserved.
    </footer>
  );
};

export default Footer;
