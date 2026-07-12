
import { Instagram, Facebook, Twitter } from "lucide-react";

const SocialLinks = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mt-12 mb-6 text-senvia-800">Siga-nos</h3>
      
      <div className="flex space-x-4">
        <a
          href="https://www.instagram.com/senvia_agency/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-3 rounded-full text-senvia-500 hover:bg-senvia-500 hover:text-white shadow-md transition-all duration-300"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a
          href="https://www.facebook.com/senvia.agency"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-3 rounded-full text-senvia-500 hover:bg-senvia-500 hover:text-white shadow-md transition-all duration-300"
          aria-label="Facebook"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href="https://x.com/Senvia_Agency"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-3 rounded-full text-senvia-500 hover:bg-senvia-500 hover:text-white shadow-md transition-all duration-300"
          aria-label="Twitter"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
