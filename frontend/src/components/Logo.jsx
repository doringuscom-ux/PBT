const Logo = ({ className = "h-16 w-auto" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/Logo.png" 
        alt="PB TADKA Logo" 
        className="h-full w-auto object-contain" 
        width="150" 
        height="50"
      />
    </div>
  );
};

export default Logo;
