/**
 * Mock Products Data
 * Product data structure with colors and sizes variants
 */

export const MOCK_PRODUCTS = [
  {
    id: 'mug-hoodie-combo',
    slug: 'mug-hoodie-combo',
    name: 'Mug & Hoodie Combo',
    description: 'Coordinated mug and hoodie with matching artwork. Perfect gift set for coffee lovers. The ceramic mug features the same design as the hoodie for a cohesive look.',
    price: 54.99,
    originalPrice: 60,
    discount: 5.01,
    category: 'matching-sets',
    categoryLabel: 'Matching Sets',
    images: [
      {
        id: 'img-1',
        url: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20front%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=800&height=1000&seq=detail1&orientation=portrait',
        alt: 'Classic Cotton Hoodie',
      },
      {
        id: 'img-2',
        url: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20back%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=800&height=1000&seq=detail2&orientation=portrait',
        alt: 'View 2',
      },
      {
        id: 'img-3',
        url: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20side%20view%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=800&height=1000&seq=detail3&orientation=portrait',
        alt: 'View 3',
      },
      {
        id: 'img-4',
        url: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20detail%20close-up%20fabric%20texture%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=800&height=1000&seq=detail4&orientation=portrait',
        alt: 'View 4',
      },
    ],
    colors: {
      navy: {
        name: 'Navy',
        value: 'rgb(30, 58, 138)',
        available: true,
        price: 54.99,
        originalPrice: 60,
      },
      black: {
        name: 'Black',
        value: 'rgb(0, 0, 0)',
        available: true,
        price: 59.99,
        originalPrice: null, // No discount for black
      },
      gray: {
        name: 'Gray',
        value: 'rgb(107, 114, 128)',
        available: true,
        price: 49.99,
        originalPrice: 55, // Discount for gray
      },
    },
    sizes: {
      s: {
        name: 'S',
        available: true,
        priceModifier: 0, // No price change for S
      },
      m: {
        name: 'M',
        available: true,
        priceModifier: 0, // No price change for M
      },
      l: {
        name: 'L',
        available: true,
        priceModifier: 5, // +$5 for L
      },
      xl: {
        name: 'XL',
        available: true,
        priceModifier: 8, // +$8 for XL
      },
      xxl: {
        name: 'XXL',
        available: true,
        priceModifier: 10, // +$10 for XXL
      },
    },
    // Stock quantity for each color-size combination
    stock: {
      'navy-s': 15,
      'navy-m': 20,
      'navy-l': 10,
      'navy-xl': 5,
      'navy-xxl': 3,
      'black-s': 0, // Out of stock
      'black-m': 8,
      'black-l': 12,
      'black-xl': 4,
      'black-xxl': 2,
      'gray-s': 10,
      'gray-m': 15,
      'gray-l': 7,
      'gray-xl': 3,
      'gray-xxl': 1,
    },
    features: [
      'Premium cotton hoodie',
      'Ceramic mug (11oz capacity)',
      'Matching coordinated artwork',
      'Dishwasher safe mug',
      'Perfect gift combination',
    ],
  },
  {
    id: 'classic-black-hoodie',
    slug: 'classic-black-hoodie',
    name: 'Classic Black Hoodie',
    description: 'Premium quality black hoodie made from soft cotton blend. Perfect for everyday wear with a comfortable fit and durable construction.',
    price: 34.99,
    originalPrice: null,
    discount: null,
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    images: [
      {
        id: 'img-1',
        url: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20mockup%20on%20clean%20white%20background%2C%20minimalist%20product%20photography%2C%20soft%20natural%20lighting%2C%20professional%20e-commerce%20style%2C%20centered%20composition%2C%20high%20resolution%2C%20modern%20casual%20wear%2C%20cotton%20fabric%20texture%20visible%2C%20front%20view%2C%20no%20wrinkles%2C%20studio%20shot%2C%20commercial%20photography&width=800&height=1000&seq=prod1&orientation=portrait',
        alt: 'Classic Black Hoodie',
      },
      {
        id: 'img-2',
        url: 'https://readdy.ai/api/search-image?query=Premium%20black%20hoodie%20back%20view%20mockup%20on%20clean%20white%20background&width=800&height=1000&seq=prod1b&orientation=portrait',
        alt: 'Back View',
      },
    ],
    colors: {
      black: {
        name: 'Black',
        value: 'rgb(0, 0, 0)',
        available: true,
        price: 34.99,
        originalPrice: null,
      },
      navy: {
        name: 'Navy',
        value: 'rgb(30, 58, 138)',
        available: true,
        price: 32.99,
        originalPrice: 38.99, // Discount for navy
      },
      gray: {
        name: 'Gray',
        value: 'rgb(107, 114, 128)',
        available: true,
        price: 36.99,
        originalPrice: null,
      },
    },
    sizes: {
      s: {
        name: 'S',
        available: true,
        priceModifier: -2, // -$2 for S
      },
      m: {
        name: 'M',
        available: true,
        priceModifier: 0, // No price change for M
      },
      l: {
        name: 'L',
        available: true,
        priceModifier: 3, // +$3 for L
      },
      xl: {
        name: 'XL',
        available: true,
        priceModifier: 5, // +$5 for XL
      },
    },
    // Stock quantity for each color-size combination
    stock: {
      'black-s': 5,
      'black-m': 12,
      'black-l': 8,
      'black-xl': 4,
      'navy-s': 0, // Out of stock
      'navy-m': 10,
      'navy-l': 6,
      'navy-xl': 2,
      'gray-s': 7,
      'gray-m': 15,
      'gray-l': 9,
      'gray-xl': 5,
    },
    features: [
      'Premium cotton blend',
      'Comfortable fit',
      'Durable construction',
      'Machine washable',
      'Available in multiple sizes',
    ],
  },
];

/**
 * Get product by slug
 * @param {string} slug - Product slug
 * @returns {Object|null} Product object or null
 */
export function getProductBySlug(slug) {
  return MOCK_PRODUCTS.find((product) => product.slug === slug) || null;
}

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Object|null} Product object or null
 */
export function getProductById(id) {
  return MOCK_PRODUCTS.find((product) => product.id === id) || null;
}

