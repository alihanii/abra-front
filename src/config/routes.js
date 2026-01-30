/**
 * Application Routes Configuration
 * Centralized route management for better maintainability
 */

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  MATCHING_SETS: '/matching-sets',
  DESIGN_STUDIO: '/design-studio',
  CONTACT: '/contact',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  SIZE_GUIDE: '/size-guide',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faq',
  CHECKOUT: '/checkout',
};

/**
 * Navigation items for header
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: ROUTES.HOME,
    icon: 'ri-home-line',
  },
  {
    id: 'products',
    label: 'Products',
    href: ROUTES.PRODUCTS,
    icon: 'ri-shopping-bag-line',
  },
  {
    id: 'matching-sets',
    label: 'Matching Sets',
    href: ROUTES.MATCHING_SETS,
    icon: 'ri-t-shirt-line',
  },
  {
    id: 'design-studio',
    label: 'Design Studio',
    href: ROUTES.DESIGN_STUDIO,
    icon: 'ri-palette-line',
  },
];

/**
 * Shop links for footer
 */
export const SHOP_LINKS = [
  {
    label: 'Hoodies',
    href: `${ROUTES.PRODUCTS}?category=hoodies`,
  },
  {
    label: 'T-Shirts',
    href: `${ROUTES.PRODUCTS}?category=tshirts`,
  },
  {
    label: 'Sweatshirts',
    href: `${ROUTES.PRODUCTS}?category=sweatshirts`,
  },
  {
    label: 'Custom Design',
    href: ROUTES.DESIGN_STUDIO,
  },
];

/**
 * Support links for footer
 */
export const SUPPORT_LINKS = [
  {
    label: 'Contact Us',
    href: ROUTES.CONTACT,
  },
  {
    label: 'Shipping Info',
    href: ROUTES.SHIPPING,
  },
  {
    label: 'Returns',
    href: ROUTES.RETURNS,
  },
  {
    label: 'Size Guide',
    href: ROUTES.SIZE_GUIDE,
  },
];

/**
 * Company links for footer
 */
export const COMPANY_LINKS = [
  {
    label: 'About Us',
    href: ROUTES.ABOUT,
  },
  {
    label: 'Privacy Policy',
    href: ROUTES.PRIVACY,
  },
  {
    label: 'Terms of Service',
    href: ROUTES.TERMS,
  },
  {
    label: 'FAQ',
    href: ROUTES.FAQ,
  },
];

/**
 * Social media links
 */
export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    icon: 'ri-facebook-fill',
    href: '#',
    label: 'Facebook',
  },
  {
    id: 'instagram',
    icon: 'ri-instagram-line',
    href: '#',
    label: 'Instagram',
  },
  {
    id: 'twitter',
    icon: 'ri-twitter-x-line',
    href: '#',
    label: 'Twitter',
  },
];

/**
 * Check if a route is active
 * @param {string} currentPath - Current pathname
 * @param {string} routePath - Route path to check
 * @returns {boolean}
 */
export const isActiveRoute = (currentPath, routePath) => {
  if (routePath === ROUTES.HOME) {
    return currentPath === ROUTES.HOME;
  }
  return currentPath.startsWith(routePath);
};

