import Link from 'next/link';
import { SHOP_LINKS, SUPPORT_LINKS, COMPANY_LINKS, SOCIAL_LINKS, ROUTES } from '@/config/routes';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-pacifico), serif' }}>
              Abra
            </h3>
            <p className="text-gray-600 mb-4">
              Premium custom clothing with professional printing quality.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-[var(--color-sky-light)] rounded-full hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer group"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`${social.icon} text-lg transition-transform group-hover:scale-110`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#F5F5F5] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} Abra. All rights reserved.
          </p>
          <a
            href="https://readdy.ai/?origin=logo"
            className="text-gray-600 text-sm hover:text-gray-900 transition-colors cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by AliHaNi
          </a>
        </div>
      </div>
    </footer>
  );
}

