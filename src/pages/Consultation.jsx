import React from 'react';

function Consultation() {
  return (
    <div>
      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-lg text-dark-600">
            Schedule your personalized business consultation with our experts.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom max-w-2xl">
          <div className="card">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Service</label>
                <select className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Select a service...</option>
                  <option>Bookkeeping</option>
                  <option>Tax Compliance</option>
                  <option>Incorporation</option>
                  <option>Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Preferred Date</label>
                <input type="date" className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Preferred Time</label>
                <input type="time" className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Additional Notes</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your needs..."
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                Book Consultation
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Consultation;
