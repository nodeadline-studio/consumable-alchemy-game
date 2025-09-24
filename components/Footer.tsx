'use client';

import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  Github, 
  Twitter, 
  Mail, 
  Heart,
  Shield,
  Star,
  Zap
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FlaskConical className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold gradient-text">Consumable Alchemy</h3>
            </div>
            <p className="text-white/70 text-sm">
              Discover the magical effects of mixing consumables in this gamified safety experience. 
              Learn about food safety, drug interactions, and chemical combinations.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Features</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Safety Analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Interactive Lab</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Gamification</span>
              </li>
              <li className="flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>Real-time Data</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Community</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Disclaimer</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-400" />
              </motion.div>
              <span>for Gen Z 2025</span>
            </div>
            
            <div className="text-white/60 text-sm">
              © 2025 Consumable Alchemy. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
