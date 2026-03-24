import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleInfo, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Incorporation = () => {
  const [activeTab, setActiveTab] = useState('LLC');

  const packages = {
    LLC: {
      type: "LLC Formation",
      subtitle: "The Most Popular Choice for Global Founders and Digital Nomads.",
      price: "$197",
      stateFee: "+ State Fee ($100 - $300)",
      description: "Ideal for solo entrepreneurs and startups who want pass-through taxation and liability protection.",
      features: [
        "Company Name Search & Availability Verification",
        "Preparation & Filing of Articles of Organization",
        "Standard Operating Agreement Preparation",
        "Registered Agent Service (1st Year Included)",
        "Digital Company Formation Documents",
        "Employer Identification Number (EIN) Support"
      ]
    },
    Corp: {
      type: "C-Corp Formation",
      subtitle: "Built for Startups Ready for Fundraising and Scaling.",
      price: "$247",
      stateFee: "+ State Fee ($100 - $300)",
      description: "The gold standard for companies looking to raise venture capital or issue stock options.",
      features: [
        "Name Reservation & Filing Certificate of Incorporation",
        "Standard Corporate Bylaws & Initial Board Minutes",
        "Common Stock Issuance Documentation",
        "Registered Agent Service (1st Year Included)",
        "Employer Identification Number (EIN) Support",
        "Delaware or Wyoming State Setup Optimized"
      ]
    }
  };

  const currentPkg = packages[activeTab];

  return (
    <main className="incorporation-page">
      {/* Hero Section */}
      <section className="bg-[#d4eaf7] py-16 md:py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1d1c1c] leading-tight mb-6">
              Launch Your US Business <br />With Confidence
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-xl">
              From Delaware to Wyoming, we handle the complexities of US incorporation 
              so you can focus on building your empire. Seamless, fast, and 100% remote.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/order-wizard" className="bg-[#00668c] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004d6a] transition-all flex items-center gap-2">
                Start My LLC <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link to="/consultation" className="bg-white text-[#00668c] border-2 border-[#00668c] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                Talk to Expert
              </Link>
            </div>
          </div>
          <div className="flex-1 animate-slide-up">
            <img 
              src="/assets/images/pages/incorporation-hero.svg" 
              alt="US Incorporation" 
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
              onError={(e) => { e.target.src = 'https://incozi.vercel.app/assets/images/pages/incorporation-hero.svg'; }}
            />
          </div>
        </div>
      </section>

      {/* Package Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1d1c1c] mb-4">Choose Your Entity Type</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10">
              We offer specialized formation services for international founders looking to establish 
              a compliant and scalable presence in the United States.
            </p>

            {/* Entity Tabs */}
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl mb-12">
              <button 
                onClick={() => setActiveTab('LLC')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'LLC' ? 'bg-[#00668c] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Limited Liability Company (LLC)
              </button>
              <button 
                onClick={() => setActiveTab('Corp')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'Corp' ? 'bg-[#00668c] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
              >
                C-Corporation
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white border-2 border-[#d4eaf7] lg:flex items-stretch rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform scale-100">
            <div className="flex-[2] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#d4eaf7]">
              <div className="mb-8">
                <span className="bg-[#d4eaf7] text-[#00668c] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  {currentPkg.type}
                </span>
                <h3 className="text-2xl font-bold text-[#1d1c1c] mb-3">{currentPkg.subtitle}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {currentPkg.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#00668c] mt-1 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-gray-50 p-8 lg:p-12 flex flex-col justify-center items-center text-center">
              <span className="text-gray-400 text-sm font-semibold mb-2">Service Fee</span>
              <div className="mb-4">
                <span className="text-5xl font-extrabold text-[#1d1c1c]">{currentPkg.price}</span>
              </div>
              <p className="text-gray-500 text-xs mb-8 flex items-center gap-1">
                <FontAwesomeIcon icon={faCircleInfo} /> {currentPkg.stateFee}
              </p>
              <button className="w-full bg-[#00668c] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#004d6a] hover:scale-105 transition-all shadow-xl">
                Get Started Now
              </button>
              <p className="mt-4 text-[10px] text-gray-400 font-medium">100% Online • Support Included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4eaf7] text-[#00668c] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl font-bold">01</span>
              </div>
              <h4 className="text-xl font-bold text-[#1d1c1c] mb-3">Expert Review</h4>
              <p className="text-gray-500 leading-relaxed text-sm">Every application is manually reviewed by our compliance experts before submission to ensure success.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4eaf7] text-[#00668c] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl font-bold">02</span>
              </div>
              <h4 className="text-xl font-bold text-[#1d1c1c] mb-3">State-Level Filing</h4>
              <p className="text-gray-500 leading-relaxed text-sm">We handle all interactions with state agencies, ensuring fast processing times in any US jurisdiction.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4eaf7] text-[#00668c] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl font-bold">03</span>
              </div>
              <h4 className="text-xl font-bold text-[#1d1c1c] mb-3">Lifetime Support</h4>
              <p className="text-gray-500 leading-relaxed text-sm">Get ongoing support for your company's annual reports, compliance, and post-formation requirements.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Incorporation;
