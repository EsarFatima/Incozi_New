import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faBuilding, 
  faChartLine, 
  faHandshake 
} from '@fortawesome/free-solid-svg-icons';

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "LLC vs C-Corp: Which is Right for Your Startup?",
      excerpt: "Understanding the sophisticated differences between these two entity types is crucial for tax planning and fundraising.",
      tag: "Formation",
      image: "/assets/images/blog/blog-001.jpg", // Ensure these paths match your assets
      link: "/blog/article-1"
    },
    {
      id: 2,
      title: "US Tax Deadlines for Foreign Founders 2026",
      excerpt: "Don't miss a date. A comprehensive calendar of all federal and state tax filing deadlines for international owners.",
      tag: "Taxes",
      image: "/assets/images/blog/blog-002.jpg",
      link: "/blog/article-2"
    },
    {
      id: 3,
      title: "Opening a US Business Bank Account Remotely",
      excerpt: "Yes, it is possible. Here is our step-by-step guide to navigating KYC requirements without flying to the US.",
      tag: "Banking",
      image: "/assets/images/blog/blog-003.jpg",
      link: "/blog/article-3"
    }
  ];

  return (
    <main className="blog-page">
      {/* Blog Header */}
      <section className="blog-header py-16 px-6 bg-gray-50 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="blog-header-text text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-[#00668c] mb-4">Latest Insights</h1>
            <p className="text-gray-600 text-lg max-w-xl mb-8">
              Expert advice on US company formation, taxes, and business growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#articles" className="btn-primary py-3 px-6 rounded-lg font-semibold bg-[#00668c] text-white hover:bg-[#004d6a] transition-colors">
                Browse Articles
              </a>
              <Link to="/" className="py-3 px-6 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
          <div className="blog-header-image flex-1">
            <img 
              src="/assets/images/blog/blog-hero.svg" 
              alt="Blog Insights Illustration" 
              className="w-full max-w-md mx-auto"
              onError={(e) => { e.target.src = 'https://incozi.vercel.app/assets/images/blog/blog-hero.svg'; }}
            />
          </div>
        </div>
      </section>

      {/* Categories / Knowledge Base */}
      <section className="knowledge-base py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#f3e8ff] p-12 rounded-2xl text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Our Knowledge Base</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover practical insights and expert guidance to help you navigate US business formation, compliance, and growth strategies.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl text-[#00668c] mb-4">
                   <FontAwesomeIcon icon={faBuilding} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Formation</h3>
                <p className="text-gray-500 text-sm">Learn about company structures and formation strategies</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl text-[#00668c] mb-4">
                   <FontAwesomeIcon icon={faChartLine} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Taxes</h3>
                <p className="text-gray-500 text-sm">Navigate tax deadlines and compliance requirements</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl text-[#00668c] mb-4">
                   <FontAwesomeIcon icon={faHandshake} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Growth</h3>
                <p className="text-gray-500 text-sm">Scale your business with proven strategies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section id="articles" className="py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Articles</h2>
          <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="blog-card bg-white border border-gray-200 rounded-2xl overflow-hidden hover:translate-y-[-5px] hover:shadow-xl transition-all flex flex-col">
                <Link to={article.link} className="flex flex-col h-full">
                  <div className="blog-img h-48 bg-[#d4eaf7] flex items-center justify-center overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Incozi+Blog'; }}
                    />
                  </div>
                  <div className="blog-content p-6 flex-1 flex flex-col">
                    <span className="blog-tag text-xs font-bold text-[#00668c] uppercase mb-2 tracking-wider">{article.tag}</span>
                    <h3 className="blog-title text-xl font-bold text-gray-900 mb-3 leading-tight">{article.title}</h3>
                    <p className="blog-excerpt text-gray-600 text-sm mb-6 flex-1 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="read-more inline-flex items-center gap-2 text-[#00668c] font-bold py-2 px-4 bg-[#f0f9ff] border border-[#d4eaf7] rounded-lg w-fit hover:bg-[#d4eaf7] transition-all">
                      Read Article <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
