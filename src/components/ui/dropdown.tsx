import { useState, useRef, useEffect } from 'preact/hooks';
import { ChevronDown } from 'lucide-preact';

interface PixelDropdownProps {
  value: number;
  options: { label: string; value: number }[];
  onChange: (value: number) => void;
  className?: string;
}

export function PixelDropdown({ value, options, onChange, className = '' }: PixelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div class={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        class={`
          flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg 
          bg-[#4361ee] hover:bg-[#3a52d1] 
          text-white font-bold pixel-text 
          border-b-4 border-[#2b3a8c] active:border-b-0 active:translate-y-1
          transition-all duration-100 min-w-[100px]
          ${isOpen ? 'border-b-0 translate-y-1' : ''}
        `}
      >
        <span>{selectedOption?.label || value}</span>
        <ChevronDown class={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div class="absolute top-full right-0 mt-2 w-full min-w-[120px] bg-[#4361ee] rounded-lg border-2 border-[#2b3a8c] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-top">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              class={`
                w-full text-left px-4 py-2.5 text-white font-bold pixel-text
                hover:bg-[#3a52d1] transition-colors flex items-center justify-between
                ${value === option.value ? 'bg-[#2b3a8c]' : ''}
              `}
            >
              {option.label}
              {value === option.value && <div class="w-2 h-2 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
