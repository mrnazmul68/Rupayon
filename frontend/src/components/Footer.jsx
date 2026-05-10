import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  
} from 'react-icons/fa';
import { FooterSkeleton } from './Skeletons';

const Footer = ({ loading = false }) => {
  if (loading) {
    return <FooterSkeleton />;
  }
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif tracking-widest font-semibold">RUPAYON</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Premium modest wear crafted with elegance. Specializing in high-quality 
            Borkas and Abayas for the modern woman.
          </p>
          <div className="flex space-x-5">
            <a href="#" className="hover:text-black transition-all transform hover:scale-110"><FaFacebookF size={18} /></a>
            <a href="#" className="hover:text-pink-600 transition-all transform hover:scale-110"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-red-600 transition-all transform hover:scale-110"><FaYoutube size={20} /></a>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-widest text-xs border-b border-gray-200 pb-2">Our Locations</h3>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-gray-400" />
              <span>
                <strong className="text-gray-800 block">Showroom</strong>
                Sunmeya Tower, Laksam, Cumilla
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-gray-400" />
              <span>
                <strong className="text-gray-800 block">Karkhana (Factory)</strong>
                Shonir Akhra, Dhaka
              </span>
            </li>
          </ul>
        </div>

        {/* Contact & Services */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase tracking-widest text-xs border-b border-gray-200 pb-2">Support</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-3 font-medium text-gray-900">
              <FaPhoneAlt size={14} />
              <span>+880 1XXX-XXXXXX</span>
            </li>
            <li><a href="#" className="hover:text-black transition-colors">Order Tracking</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Shipping Policy</a></li>
          </ul>
        </div>

        {/* Review Section */}
        {/* Subscribe Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
  
  <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-800">
    Subscribe
  </h3>

  <p className="text-sm text-gray-600 leading-relaxed mb-4">
    Get updates on new borka collections, exclusive offers & restocks.
  </p>

  <div className="flex flex-col gap-3">
    <input
      type="email"
      placeholder="Enter your email"
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400"
    />

    <button className="bg-black text-white py-2 text-sm rounded hover:bg-gray-800 transition">
      Subscribe
    </button>
  </div>

  <p className="mt-3 text-xs text-gray-400">
    We respect your privacy. No spam ever.
  </p>

</div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <p>© {new Date().getFullYear()} RUPAYON CLOTHING. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>bKash</span>
          <span>Nagad</span>
          <span>Cards</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;