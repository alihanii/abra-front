import { HeroSlider, CategoryGrid, HeroSection, ShopByCategory, FeaturesSection, WhyChooseSection, CTASection } from '@/components/home';
import { FeaturedProducts } from '@/components/products';

/**
 * Home Page
 * Main landing page with hero slider and other sections
 */
export default function Home() {
  return (
    <main>
      {/* Hero Slider Section */}
      <HeroSlider />
      
      {/* Category Grid Section */}
      <CategoryGrid />
      
      {/* Featured Products Section */}
      <FeaturedProducts />
      
      {/* Hero Section with CTA */}
      <HeroSection />

      {/* Shop by Category Section */}
      <ShopByCategory />

    
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Why Choose Section */}
      <WhyChooseSection />
      
      {/* CTA Section */}
      <CTASection />
      
    </main>
  );
}
