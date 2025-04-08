import React from 'react';
import { Link } from 'react-router-dom';

import { Brain, Mail, Phone, MapPin, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-accent-foreground transition-transform group-hover:scale-110">
              <img
                  src="https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png"
                  alt="Logo"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="flex flex-col">
              <span className="text-xl font-logo nuvibrainz-gradient">
  Nuvibrainz
</span>

                <span className="text-xs text-foreground/60 -mt-1">"Fueling Brainzees For Future"</span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-xs">
            Empowering JEE aspirants with smart tools and personalized prep.            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-foreground/70 hover:text-accent transition-colors p-2 rounded-full hover:bg-secondary/50">
                <Twitter size={18} />
                <span className="sr-only">x</span>
              </a>
              <a href="#" className="text-foreground/70 hover:text-accent transition-colors p-2 rounded-full hover:bg-secondary/50">
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-foreground/70 hover:text-accent transition-colors p-2 rounded-full hover:bg-secondary/50">
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <span className="border-b-2 border-accent pb-1">Quick Links</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent/70"></div>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent/70"></div>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent/70"></div>
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent/70"></div>
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <span className="border-b-2 border-accent pb-1">Resources</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent/70"></div>
                  11th
                </a>
              </li>
             
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent/70"></div>
                  12th
                </a>
              </li>
              
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <span className="border-b-2 border-accent pb-1">Contact</span>
            </h4>
            <ul className="space-y-3">
              <li className="text-foreground/70 flex items-center gap-2">
                <Mail size={15} className="text-accent/80" />
                <span>info@nuvibrainz.site</span>
              </li>
              <li className="text-foreground/70 flex items-center gap-2">
                <Phone size={15} className="text-accent/80" />
                <span>+91 7023466830</span>
              </li>
              <li className="text-foreground/70 flex items-center gap-2">
                <MapPin size={15} className="text-accent/80" />
                <span>Jaipur , Rajasthan</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Nuvibrainz. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-foreground/70 hover:text-accent transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-foreground/70 hover:text-accent transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-foreground/70 hover:text-accent transition-colors text-sm">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;