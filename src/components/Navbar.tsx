import { useState, useEffect } from 'preact/hooks';
import { Menu, X } from 'lucide-preact';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Tentang', href: '#about' },
    { name: 'Simulasi', href: '#simulator' },
    { name: 'Hasil', href: '#results' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 w-full font-['VT323',_monospace] transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1a1b26]' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className="block group"
            >
              <img 
                className="h-14 w-14 pixelated group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all duration-200" 
                src="/quest.svg" 
                alt="Quest Logo" 
                style={{ imageRendering: 'pixelated' }} 
              />
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-6 py-2 text-2xl text-gray-300 hover:text-[#4ade80] hover:bg-white/5 border-transparent transition-all duration-150 uppercase tracking-widest"
                  style={{ textShadow: '2px 2px 0 #000' }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none border-2 border-transparent focus:border-white/50"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <Menu className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t-2 border-white/10 bg-[#1a1b26]" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-4 text-xl font-medium text-gray-300 hover:text-[#4ade80] hover:bg-white/5 border-l-4 border-transparent hover:border-[#4ade80] transition-colors uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
