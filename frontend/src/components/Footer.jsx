import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    alert(`Thank you for subscribing with email: ${email}`);
    e.target.reset();
  };

  return (
    <footer className="bg-dark-bg text-white pt-12 pb-5">
      <div className="w-[96%] max-w-[1800px] mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="footer-column">
            <Logo className="h-20 w-auto items-start mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your premier destination for Punjabi cinema news, reviews, trailers, and celebrity interviews. Stay updated with everything happening in Pollywood.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon="fab fa-facebook-f" />
              <SocialIcon icon="fab fa-twitter" />
              <SocialIcon icon="fab fa-instagram" />
              <SocialIcon icon="fab fa-youtube" />
              <SocialIcon icon="fab fa-whatsapp" />
            </div>
          </div>
          
          <div className="footer-column">
            <h3 className="text-xl font-bold mb-5 text-accent-gold">Quick Links</h3>
            <ul className="list-none">
              <FooterLink text="Home" path="/" />
              <FooterLink text="Movies" path="/movies" />
              <FooterLink text="Celebrities" path="/celebs" />
              <FooterLink text="News" path="/news" />
              <FooterLink text="Videos" path="/videos" />
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="text-xl font-bold mb-5 text-accent-gold">Categories</h3>
            <ul className="list-none">
              <FooterLink text="Pollywood" path="/news" />
              <FooterLink text="Bollywood" path="/news" />
              <FooterLink text="Hollywood" path="/news" />
              <FooterLink text="Reviews" path="/news" />
              <FooterLink text="Trailers" path="/videos" />
              <FooterLink text="Box Office" path="/movies" />
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="text-xl font-bold mb-5 text-accent-gold">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-5">Subscribe to our newsletter to get daily updates about Punjabi cinema.</p>
            <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="py-3 px-4 border-none rounded text-text-dark text-sm outline-none"
                required 
              />
              <button 
                type="submit" 
                className="bg-primary-red text-white border-none py-3 px-5 rounded font-bold cursor-pointer hover:bg-secondary-red transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="text-center pt-5 border-t border-white/10 text-gray-500 text-sm flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>&copy; 2026 PB TADKA. All Rights Reserved. | Designed for Punjabi Cinema Lovers</span>
          <Link to="/admin/login" className="text-gray-600 hover:text-primary-red transition-colors font-bold ml-2 underline">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="inline-flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white text-lg hover:bg-primary-red hover:-translate-y-1 transition-all">
    <i className={icon}></i>
  </a>
);

const FooterLink = ({ text, path }) => (
  <li className="mb-3">
    <Link to={path || "#"} className="text-gray-400 no-underline text-sm hover:text-primary-red hover:pl-1 transition-all">
      {text}
    </Link>
  </li>
);

export default Footer;
