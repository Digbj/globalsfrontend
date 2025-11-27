import { FaHeart } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="w-full bg-gray-800 text-white py-4 text-center mt-8">
      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      <p className="text-sm mt-2 inline-flex items-center justify-center">
        Created with{" "}
        <FaHeart size={14} className="mx-1 text-red-500 fill-current" /> in
        India
      </p>
    </div>
  );
};

export default Footer;
