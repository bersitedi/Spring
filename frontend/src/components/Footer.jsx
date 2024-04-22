import React from "react";
import { AiOutlineTwitter, AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <svg
        className="w-full h-auto max-h-40 translate-y-[1px]"
        preserveAspectRatio="none"
        viewBox="0 0 2160 263"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Wave"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2160 262.5H0V0C360 80 720 120 1080 120C1440 120 1800 80 2160 0V262.5Z"
          fill="#0D2436"
        />
      </svg>
      <section className="bg-cta py-12">
        <footer className="container mx-auto grid grid-cols-10 px-5 gap-y-10 gap-x-8 md:grid-cols-12 lg:grid-cols-10 lg:gap-x-12">
          <div className="col-span-5 md:col-span-4 lg:col-span-2">
            <h3 className="text-white font-semibold md:text-lg">Services</h3>
            <ul className="text-gray-300 text-sm mt-4 space-y-3 md:text-base">
              <li>
                <a href="/">Architectural Design</a>
              </li>
              <li>
                <a href="/">Interior Design</a>
              </li>
              <li>
                <a href="/">Project Management</a>
              </li>
              <li>
                <a href="/">Renovation & Remodeling</a>
              </li>
            </ul>
          </div>
          <div className="col-span-5 md:col-span-4 lg:col-span-2">
            <h3 className="text-white font-semibold md:text-lg">About Us</h3>
            <ul className="text-gray-300 text-sm mt-4 space-y-3 md:text-base">
              <li>
                <a href="/">Our Story</a>
              </li>
              <li>
                <a href="/">Meet the Team</a>
              </li>
              <li>
                <a href="/">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="col-span-5 md:col-span-4 md:col-start-5 lg:col-start-auto lg:col-span-2">
            <h3 className="text-white font-semibold md:text-lg">Connect</h3>
            <ul className="text-gray-300 text-sm mt-4 space-y-3 md:text-base">
              <li>
                <a href="/">Twitter</a>
              </li>
              <li>
                <a href="/">Instagram</a>
              </li>
              <li>
                <a href="/">Facebook</a>
              </li>
              <li>
                <a href="/">YouTube</a>
              </li>
            </ul>
          </div>
          <div className="col-span-5 md:col-span-4 md:col-start-5 lg:col-span-2">
            <h3 className="text-white font-semibold md:text-lg">More</h3>
            <ul className="text-gray-300 text-sm mt-4 space-y-3 md:text-base">
              <li>
                <a href="/">Privacy Policy</a>
              </li>
              <li>
                <a href="/">Terms of Service</a>
              </li>
              <li>
                <a href="/">FAQ</a>
              </li>
              <li>
                <a href="/">Sitemap</a>
              </li>
            </ul>
          </div>
          <div className="col-span-10 md:order-first md:col-span-4 lg:col-span-2 flex flex-col items-center justify-center">
            <p className="text-gray-300 text-sm text-center md:text-left md:text-base lg:text-sm">
              Transforming your dreams into reality with innovative designs and
              expert construction solutions.
            </p>
            <ul className="flex justify-center items-center mt-4 space-x-6 text-gray-300">
              <li>
                <a href="/">
                  <AiOutlineTwitter className="w-8 h-auto" />
                </a>
              </li>
              <li>
                <a href="/">
                  <AiFillInstagram className="w-8 h-auto" />
                </a>
              </li>
              <li>
                <a href="/">
                  <FaFacebook className="w-8 h-auto" />
                </a>
              </li>
              <li>
                <a href="/">
                  <BsTelegram className="w-8 h-auto" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-10 md:col-span-12 lg:col-span-10 flex flex-col items-center justify-center">
            <p className="font-bold text-sm text-gray-300">
              © 2024 Spring Consultancy and architect. All rights reserved.
            </p>
          </div>
        </footer>
      </section>
    </>
  );
};

export default Footer;
