import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserSupport = ({ showSuccess, showError }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('help');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'order',
    priority: 'medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Support ticket submitted successfully! We\'ll get back to you within 24 hours. 🎫');
      setTicketForm({
        subject: '',
        category: 'order',
        priority: 'medium',
        description: ''
      });
    } catch (error) {
      showError('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqData = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "Browse our menu, add items to your cart, and proceed to checkout. You can pay online or choose cash on delivery.",
      category: "ordering"
    },
    {
      id: 2,
      question: "What are your delivery hours?",
      answer: "We deliver from 11:00 AM to 10:00 PM, Monday through Sunday. Orders placed after 9:30 PM will be delivered the next day.",
      category: "delivery"
    },
    {
      id: 3,
      question: "Can I modify or cancel my order?",
      answer: "You can modify or cancel your order within 30 minutes of placing it. After that, the order goes into preparation and cannot be changed.",
      category: "ordering"
    },
    {
      id: 4,
      question: "Do you offer vegetarian options?",
      answer: "Yes! We have a wide variety of vegetarian dishes. Look for the 🥗 icon on our menu items.",
      category: "menu"
    },
    {
      id: 5,
      question: "How can I track my order?",
      answer: "Go to 'My Orders' section to track your order status in real-time. You'll receive updates as your order progresses.",
      category: "delivery"
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery.",
      category: "payment"
    },
    {
      id: 7,
      question: "Is there a minimum order amount?",
      answer: "Yes, the minimum order amount is ₹100 for delivery. There's no minimum for pickup orders.",
      category: "ordering"
    },
    {
      id: 8,
      question: "How do I update my delivery address?",
      answer: "Go to your profile settings and update your address. You can also add multiple addresses for different locations.",
      category: "account"
    }
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contactInfo = [
    {
      type: "Phone",
      value: "+91 98765 43210",
      icon: "📞",
      description: "Call us for immediate assistance"
    },
    {
      type: "Email",
      value: "support@tiffincrm.com",
      icon: "📧",
      description: "Send us an email for detailed queries"
    },
    {
      type: "WhatsApp",
      value: "+91 98765 43210",
      icon: "💬",
      description: "Chat with us on WhatsApp"
    },
    {
      type: "Address",
      value: "123 Food Street, Flavor City, FC 12345",
      icon: "📍",
      description: "Visit our main kitchen"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-2">Help & Support 🆘</h1>
        <p className="text-blue-100 text-lg">We're here to help you have the best experience</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'help', name: 'Help Center', icon: '❓' },
              { id: 'contact', name: 'Contact Us', icon: '📞' },
              { id: 'ticket', name: 'Submit Ticket', icon: '🎫' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Help Center Tab */}
          {activeTab === 'help' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              
              {/* Search FAQs */}
              <div className="mb-6">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <div key={faq.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                    </span>
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">Try different keywords or browse all questions</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Us Tab */}
          {activeTab === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="text-3xl mr-4">{contact.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{contact.type}</h3>
                        <p className="text-blue-600 font-medium mb-2">{contact.value}</p>
                        <p className="text-gray-600 text-sm">{contact.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🕒 Support Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Phone Support</h4>
                    <p className="text-gray-600">Monday - Sunday: 9:00 AM - 11:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Email Support</h4>
                    <p className="text-gray-600">24/7 - We respond within 4 hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Ticket Tab */}
          {activeTab === 'ticket' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Support Ticket</h2>
              
              <form onSubmit={handleSubmitTicket} className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="order">Order Issues</option>
                      <option value="delivery">Delivery Problems</option>
                      <option value="payment">Payment Issues</option>
                      <option value="account">Account Problems</option>
                      <option value="food">Food Quality</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 font-medium flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>

              {/* Ticket Guidelines */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">📝 Ticket Guidelines</h3>
                <ul className="text-yellow-700 space-y-2 text-sm">
                  <li>• Be as specific as possible about your issue</li>
                  <li>• Include order numbers for order-related issues</li>
                  <li>• Mention your delivery address for delivery problems</li>
                  <li>• We typically respond within 4-24 hours depending on priority</li>
                  <li>• For urgent issues, please call our support line</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Support</h3>
          <p className="text-gray-600 text-sm mb-4">Speak directly with our support team</p>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Call Now
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Chat</h3>
          <p className="text-gray-600 text-sm mb-4">Chat with us in real-time</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">User Guide</h3>
          <p className="text-gray-600 text-sm mb-4">Learn how to use our platform</p>
          <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
            View Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSupport;