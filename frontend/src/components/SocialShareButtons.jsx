import React from "react";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaTelegramPlane,
  FaWhatsappSquare,
} from "react-icons/fa";

const SocialShareButtons = ({ url, title }) => {
  return (
    <div className="w-full flex justify-between">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/dialog/share?app_id=404968382166852&display=popup&href=${url}`}
      >
        <FaFacebookSquare className="text-[#3b5998] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet?url=${url}`}
      >
        <FaTwitterSquare className="text-[#00acee] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://t.me/share/url?url=${url}&text=${title}`}
      >
        <FaTelegramPlane className="text-[#0088cc] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://api.whatsapp.com/send/?text=${url}`}
      >
        <FaWhatsappSquare className="text-[#25D366] w-12 h-auto" />
      </a>
    </div>
  );
};

export default SocialShareButtons;
