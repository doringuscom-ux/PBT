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
    <footer className="bg-slate-950 text-white pt-16 pb-8 relative overflow-hidden border-t-4 border-primary-red">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-red/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="page-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="mb-6 inline-block no-underline shrink-0">
                <Logo className="h-20 w-auto" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium italic pr-4">
              Your premier destination for cinema news, reviews, trailers, and celebrity interviews. Experience the magic of the cinematic universe in premium quality.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon="fab fa-facebook-f" label="Follow us on Facebook" />
              <SocialIcon icon="fab fa-twitter" label="Follow us on Twitter" />
              <SocialIcon icon="fab fa-instagram" label="Follow us on Instagram" />
              <SocialIcon icon="fab fa-youtube" label="Subscribe to our YouTube channel" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-black mb-6 text-white uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary-red rounded-sm"></span> Explore
            </h3>
            <ul className="list-none space-y-4 m-0 p-0">
              <FooterLink text="Home" path="/" />
              <FooterLink text="News" path="/news" />
              <FooterLink text="Trailers" path="/videos" />
              <FooterLink text="Celebrities" path="/celebs" />
              <FooterLink text="Movies Vault" path="/movies" />
            </ul>
          </div>
          
          {/* Additional Pages */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-black mb-6 text-white uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-sm"></span> Portals
            </h3>
            <ul className="list-none space-y-4 m-0 p-0">
              <FooterLink text="Search Area" path="/search" />
              <FooterLink text="Today's News" path="/today-news" />
              <FooterLink text="Sports Actions" path="/sports" />
              <FooterLink text="Upcoming Movies" path="/upcoming" />
              <FooterLink text="Contact Us" path="/contact-us" />
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-4 bg-slate-900/50 p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-lg font-black mb-4 text-white uppercase tracking-widest">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Join our inner circle. Get the latest exclusive trailers, breaking news, and reviews directly to your inbox.</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full py-3.5 pl-11 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-primary-red focus:bg-slate-900 transition-all font-medium placeholder:text-slate-600"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary-red text-white border-none py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-red/20 flex items-center justify-center gap-2"
              >
                Subscribe Now <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-xs font-bold tracking-wider uppercase">
            &copy; {new Date().getFullYear()} PB TADKA. All Rights Reserved.
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em]">
             <span className="text-slate-500">Designed by</span>
             <a href="#" className="text-yellow-400 hover:text-white transition-colors no-underline">digital orra</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, label }) => (
  <a href="#" className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 border border-white/5 rounded-full text-slate-400 hover:text-slate-950 hover:bg-yellow-400 hover:border-yellow-400 hover:-translate-y-1 transition-all duration-300" aria-label={label}>
    <i className={icon}></i>
  </a>
);

const FooterLink = ({ text, path }) => (
  <li>
    <Link to={path || "#"} className="text-slate-400 font-medium no-underline text-sm hover:text-yellow-400 hover:pl-2 transition-all flex items-center gap-2 group">
      <i className="fas fa-chevron-right text-[8px] text-slate-600 group-hover:text-yellow-400 transition-colors"></i> {text}
    </Link>
  </li>
);

export default Footer;
