
import React from 'react';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-6 bg-black text-white relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute -bottom-20 -left-20 text-[20vw] font-bold text-white/5 select-none pointer-events-none tracking-tighter">
        AUDIO
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 relative z-10">
        <div>
          <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-gray-500 mb-8">Neem Contact Op</h2>
          <h3 className="text-5xl md:text-7xl font-light tracking-tighter mb-12">Laten we samenwerken aan uw geluid.</h3>
          
          <div className="space-y-8 mt-12">
            <a href="mailto:audio@rikdewit.nl" className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <span className="text-xl font-light text-gray-300 group-hover:text-white transition-colors">audio@rikdewit.nl</span>
            </a>
            
            <a href="tel:+31637231247" className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <Phone size={20} strokeWidth={1.5} />
              </div>
              <span className="text-xl font-light text-gray-300 group-hover:text-white transition-colors">+31 6 372 312 47</span>
            </a>

            <div className="flex items-center gap-6 group cursor-default">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                <MapPin size={20} strokeWidth={1.5} />
              </div>
              <span className="text-xl font-light text-gray-300">Eindhoven / Utrecht</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="p-12 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm">
            <h4 className="text-2xl font-light mb-8 mono uppercase">Volg Mij</h4>
            <div className="flex gap-8">
              <a href="https://www.instagram.com/rikdewit.audio" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-2 group">
                <Instagram size={32} strokeWidth={1} />
                <span className="text-sm font-light tracking-wide text-gray-400 group-hover:text-white">@rikdewit.audio</span>
              </a>
            </div>
            <div className="mt-16 text-gray-500 text-sm leading-relaxed">
              Beschikbaar voor freelance projecten, tournee-ondersteuning en eenmalige evenementen door heel Nederland en daarbuiten.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
