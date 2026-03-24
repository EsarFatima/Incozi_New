import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faFileShield, faLightbulb, faChartLine, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Global Ambition,<br />American Foundation</h1>
          <p>Your complete partner for US incorporation, tax strategy, and ongoing compliance.</p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary">See All Services</Link>
          </div>
        </div>
      </section>

      {/* Feature Rows Section */}
      <section className="py-20 bg-white">
        <div className="container">
          {/* Row 1: US Company Formation */}
          <div className="feature-row">
            <div className="feature-text">
              <h3>US Company Formation Made Simple for Global Founders</h3>
              <p>Launch your US business from anywhere in the globe with a seamless setup process designed specifically for international entrepreneurs. We provide expert guidance on choosing the perfect entity structure for your goals, handle the preparation and filing of all necessary state documents, and even assist with your business banking needs to get you operational without the headache.</p>
            </div>
            <div className="feature-image">
              <img src="/assets/formation.png" alt="Company Formation Graphic" />
            </div>
          </div>

          {/* Row 2: Comprehensive Tax Preparation - Reverse */}
          <div className="feature-row reverse">
            <div className="feature-text">
              <h3>Comprehensive Tax Preparation & Filing</h3>
              <p>Navigate the complex US tax system with confidence. Our team offers personalized tax strategy and expert advice on cross-border treaties to optimize your position. We handle your full-service tax preparation and filing while providing year-round support, ensuring your obligations are met accurately and on time so you can focus on revenue.</p>
            </div>
            <div className="feature-image">
              <img src="/assets/taxes.png" alt="Tax Services Graphic" />
            </div>
          </div>

          {/* Row 3: Total Compliance Assurance */}
          <div className="feature-row">
            <div className="feature-text">
              <h3>Total Compliance Assurance, All Year Round</h3>
              <p>Stay ahead of regulatory changes with our proactive compliance monitoring. We assist with all mandatory annual state filings, provide essential guidance on maintaining accurate books and records, and send automated alerts for every important deadline. Rest easy knowing your company's good standing is protected 100% of the time.</p>
            </div>
            <div className="feature-image">
              <img src="/assets/compliance.png" alt="Compliance Graphic" />
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center py-16 border-t border-bg-200 mt-12">
            <h2 className="text-3xl font-bold text-accent-200">We handle the paperwork, you build the future.</h2>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 bg-bg-200">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* US Incorporation */}
            <div className="quick-card">
              <div className="quick-icon">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <h3>US Incorporation</h3>
              <p>Start your US business easily — EIN, bank account, registered agent, and everything else you need.</p>
              <Link to="/services#incorporation" className="learn-more-link">
                Start your US business <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: '5px'}} />
              </Link>
            </div>

            {/* Tax & Compliance */}
            <div className="quick-card">
              <div className="quick-icon">
                <FontAwesomeIcon icon={faFileShield} />
              </div>
              <h3>Tax & Compliance</h3>
              <p>Ensure your US entity stays fully compliant and tax-efficient — no missed deadlines or overpaid taxes.</p>
              <Link to="/services#tax" className="learn-more-link">
                See tax packages <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: '5px'}} />
              </Link>
            </div>

            {/* Consultation */}
            <div className="quick-card">
              <div className="quick-icon">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3>Consultation</h3>
              <p>Not sure yet which package is right for you? Book a consultation to get personalized advice.</p>
              <Link to="/consultation" className="learn-more-link">
                Book a consultation <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: '5px'}} />
              </Link>
            </div>

            {/* Bookkeeping */}
            <div className="quick-card">
              <div className="quick-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3>Bookkeeping</h3>
              <p>Messy books slowing you down? We clean them up, keep them tax-ready, and deliver everything on time.</p>
              <Link to="/services#bookkeeping" className="learn-more-link">
                See bookkeeping packages <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: '5px'}} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <h2 className="section-title">Simple Steps to Follow</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Pick your package</h3>
              <p>Choose the service that suits your stage—incorporation, tax, or bookkeeping.</p>
            </div>
            <div className="process-arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>We handle the details</h3>
              <p>Our experts prepare and file everything, ensuring complete accuracy and compliance.</p>
            </div>
            <div className="process-arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>You focus on growth</h3>
              <p>Launch your business with confidence, knowing your back-office is in safe hands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-accent-200 text-white text-center">
        <div className="container max-width-3xl">
          <p className="text-xl mb-6">Still confused about what to follow? <Link to="/consultation" className="underline font-bold decoration-white underline-offset-4">book a consulting session</Link> with our experts to guide you.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
