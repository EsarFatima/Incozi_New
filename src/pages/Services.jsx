import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Services() {
  const [activeTab, setActiveTab] = useState('incorporation');

  const services = {
    consultation: {
      title: 'CONSULTATION',
      subtitle: 'Meet with an expert',
      description: 'Get personalized advice about the specific needs of your company so that you can move forward with confidence.',
      price: '39',
      features: [
        'Consultation with an incorporation specialist',
        'Guidance on formation of any entity type (incorporation process, not tax planning)',
        'Guidance on US tax & compliance for foreign-owned Single-Member LLCs'
      ],
      link: '/consultation'
    },
    incorporation: {
      title: 'INCORPORATION',
      subtitle: 'Start your US-based business',
      description: 'Get your US Single-Member LLC up and running with zero tax and paperwork worries.',
      price: '899',
      features: [
        'Company registration in Wyoming',
        'Consultation with an incorporation specialist',
        'Employer Identification Number (EIN) registration',
        'Articles of Organization',
        'Operating Agreement',
        '1st year registered agent service (Wyoming)',
        'Support with bank account opening (subject to bank approval)',
        'All fees included',
        'Electronic delivery',
        'Year-round email support'
      ],
      link: '/checkout?item=incorporation'
    },
    tax: {
      title: 'TAX & COMPLIANCE',
      subtitle: 'All-in-one US business tax and compliance solution',
      description: 'Need personal tax returns? They’re available as a separate service.',
      price: '799',
      period: '/year',
      features: [
        'Consultation with a tax accountant',
        'Business tax forms: 5472, 1120 pro forma',
        'FBAR (FinCEN Form 114)',
        'Registered agent renewal (Wyoming)',
        'Compliance reminder / calendar',
        'Year-round email support: on related tax and compliance issues',
        'Annual report (Wyoming)'
      ],
      link: '/checkout?item=tax'
    },
    bookkeeping: {
      title: 'BOOKKEEPING',
      subtitle: 'Keep your books organized and clear',
      description: 'CA/CPA-reviewed annual financial statements, QuickBooks fees included.',
      price: '1,969',
      period: '/year',
      features: [
        'Accounting: Cash basis',
        'Accounts: Up to 2',
        'Transactions: 600 per quarter',
        'Reports: Quarterly',
        'CA/CPA-reviewed annual financial statements',
        'No costly extras',
        'QuickBooks: fees included'
      ],
      link: '/checkout?item=bookkeeping'
    }
  };

  const renderServiceCard = (id) => {
    const service = services[id];
    return (
      <div className="service-detail-card bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-bg-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-accent-200 font-bold tracking-widest text-sm uppercase">{service.title}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-6">{service.subtitle}</h2>
            
            <h4 className="font-bold text-lg mb-4">Key Features</h4>
            <ul className="space-y-4 mb-8">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-accent-200 mt-1" />
                  <span className="text-text-200">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col justify-center bg-bg-200 rounded-2xl p-8 lg:p-10">
            <p className="text-text-200 mb-8 text-lg">{service.description}</p>
            <div className="mb-8">
              <span className="text-4xl lg:text-5xl font-bold text-text-100">${service.price}</span>
              {service.period && <span className="text-text-200 text-xl">{service.period}</span>}
              <p className="text-text-200 mt-2">(one-time fee)</p>
            </div>
            <Link to={service.link} className="btn btn-primary text-center py-4 text-lg">
              {id === 'consultation' ? 'Book Now' : 'Buy Now'} <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-bg-100 min-h-screen">
      {/* Header */}
      <section className="py-20 bg-primary-100 text-center">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">All Services</h1>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Comprehensive solutions for every stage of your journey. Browse our packages below.
          </p>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-12 border-b border-bg-200 sticky top-[73px] bg-bg-100 z-40">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {Object.keys(services).map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeTab === id 
                    ? 'bg-accent-200 text-white shadow-md' 
                    : 'text-text-200 hover:text-accent-200'
                }`}
              >
                {services[id].title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Service Content */}
      <section className="py-20">
        <div className="container">
          {renderServiceCard(activeTab)}
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-text-100 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">Incozi Add-ons</h2>
              <p className="text-lg text-gray-300 mb-8">Everything extra you need, from ITIN application to entity changes, and more.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Entities name / address change',
                  'Entities existing member contact info change',
                  'Entities adding / removing member / manager',
                  'Entities reinstate',
                  'Entities dissolving',
                  'Certificate of Good Standing',
                  'Mail forwarding service',
                  'Mail scanning',
                  'ITIN application'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-200"></div>
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Link to="/consultation" className="btn bg-white text-text-100 hover:bg-bg-200 px-10 py-4 text-xl font-bold rounded-xl">
                Get a custom quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
