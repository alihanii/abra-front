"use client";

import { useMemo } from "react";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { SUPPORT_LINKS, COMPANY_LINKS, SOCIAL_LINKS, ROUTES } from "@/config/routes";
import { useCategories } from "@/hooks/useApi";
import AbraLogo from "@/components/ui/AbraLogo";

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  // Fetch categories from API
  const { data: categoriesResponse } = useCategories({
    page: 1,
    page_size: 100,
  });

  // Transform categories to shop links format
  const shopLinks = useMemo(() => {
    const links = [];

    // Add categories from API
    if (categoriesResponse?.results) {
      categoriesResponse.results.slice(0, 5).forEach((category) => {
        links.push({
          id: category.slug || category.id,
          label: category.name,
          href: `${ROUTES.PRODUCTS}?category=${category.slug || category.id}`
        });
      });
    }

    // Add Custom Design link (static)
    links.push({
      id: "customDesign",
      label: t('shopLinks.customDesign'),
      href: ROUTES.DESIGN_STUDIO
    });

    return links;
  }, [categoriesResponse, t]);

  return (
    <footer className="bg-white border-t border-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <AbraLogo
              as="h3"
              className="text-2xl font-bold text-gray-900 mb-4"
            />
            <p className="text-gray-600 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-[var(--color-sky-light)] rounded-full text-black hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer group"
                  aria-label={t(`social.${social.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i
                    className={`${social.icon} text-lg transition-transform group-hover:scale-110`}
                  ></i>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">{t('footer.shop')}</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer inline-block hover:-translate-x-1"
                  >
                    {/* {t(`shopLinks.${link.id}`, { defaultValue: link.label })} */}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer inline-block hover:-translate-x-1"
                  >
                    {t(`supportLinks.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer inline-block hover:-translate-x-1"
                  >
                    {t(`companyLinks.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#F5F5F5] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">{t('footer.allRightsReserved', { year: currentYear })}</p>
          <a
            href="/"
            className="text-gray-600 text-sm hover:text-gray-900 transition-colors cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('footer.poweredBy')}
          </a>
        </div>
      </div>
    </footer>
  );
}
