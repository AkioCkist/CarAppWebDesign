'use client'

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, FileText, Car, CreditCard, MapPin, Calendar, Shield, Users, AlertCircle, Phone, Search, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

export default function ImprovedFaqAccordion({ faqData }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqContent, setFaqContent] = useState('');
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (faqData) {
      setFaqContent(faqData);
      return;
    }

    // Mock FAQ data for demonstration
    const mockFaqContent = `## What documents do I need to rent a car?

To legally rent a car in Vietnam, you must provide the following:

- A valid driver's license: Foreigners are required to present an International Driving Permit (IDP) along with their home country's driver's license. Only specific license categories are recognized under Vietnamese law.
- A major credit card in your name: Most reputable rental agencies require a credit card for security deposits. Cash deposits may be accepted by some local companies but are not common.
- Proof of insurance: You can either use your existing travel/rental insurance or purchase additional coverage from the rental company.
- Valid identification: A passport is mandatory for foreigners renting cars.

## Legal Requirements for Foreign Drivers in Vietnam

Understanding Vietnam's driving laws is crucial for a safe rental experience:

- International Driving Permit (IDP) is mandatory for tourists
- Minimum age requirement is typically 21 years
- Some categories require additional documentation
- Local traffic police may conduct random checks

Important: Always carry original documents while driving.

## Can I return the car to a different location?

Most major rental companies offer one-way rentals with the following conditions:

- Additional fees may apply for different drop-off locations
- Popular routes between major cities are usually available
- Remote locations may have limited availability
- Advance booking is recommended for one-way rentals

## Is there an age requirement?

Age requirements vary by rental company and vehicle type:

- Minimum age: 21 years old (some companies require 25+)
- Maximum age: Usually no upper limit with valid license
- Young driver surcharge may apply for drivers under 25
- Luxury vehicles may have higher age requirements

## Are there mileage limits?

Mileage policies depend on your rental agreement:

- Most rentals include unlimited mileage within Vietnam
- Long-term rentals may have daily/weekly limits
- Cross-border travel restrictions apply
- Additional charges for exceeding limits when applicable

## How do I modify or cancel my booking?

Booking changes are handled as follows:

- Free cancellation usually available 24-48 hours before pickup
- Modifications can be made online or by phone
- Some rates are non-refundable
- Peak season may have stricter policies

## What should I check before driving away with the rental car?

Before leaving the rental location, inspect:

- Exterior condition and document any existing damage
- Interior cleanliness and functionality
- Fuel level and type required
- Emergency equipment (spare tire, tools, first aid kit)
- Insurance documents and emergency contact numbers

## What happens if I get into an accident?

In case of an accident:

- Ensure everyone's safety first
- Contact local police (113) and emergency services if needed
- Document the scene with photos
- Contact the rental company immediately
- Do not admit fault or sign documents you don't understand

## Are there restrictions on where I can drive?

Driving restrictions include:

- Some vehicles may be restricted to certain provinces
- Mountain roads may require special permits
- Border crossings are typically not allowed
- Urban areas may have traffic restrictions during peak hours

## Can I add additional drivers to the rental agreement?

Additional drivers can be added:

- All drivers must meet the same requirements as primary renter
- Additional fees usually apply per extra driver
- Spouse may be included free with some companies
- All drivers must be present during car pickup

## What types of insurance coverage are available?

Insurance options typically include:

- Basic liability coverage (usually included)
- Collision Damage Waiver (CDW)
- Theft protection
- Personal accident insurance
- Extended coverage for peace of mind

## Traffic Rules and Regulations in Vietnam

Key traffic rules to remember:

- Drive on the right side of the road
- Speed limits: 60 km/h in cities, 90 km/h on highways
- Seat belts are mandatory for all passengers
- Mobile phone use while driving is prohibited
- Helmets required for motorcycle passengers

## Emergency Contacts and Useful Information

Important numbers to keep handy:

- Police: 113
- Fire Department: 114
- Medical Emergency: 115
- Tourist Hotline: 1800-1177
- Your rental company's 24/7 support line

## Payment and Pricing Information

Payment and pricing details:

- Major credit cards accepted
- Security deposits typically held on credit card
- Fuel policy: Full-to-full or full-to-empty options
- Additional fees may include GPS, child seats, insurance upgrades
- Prices vary by season and vehicle type`;

    setFaqContent(mockFaqContent);
  }, [faqData]);

  useEffect(() => {
    if (faqContent) {
      const parsedSections = parseMarkdown(faqContent);
      setSections(parsedSections);
      if (parsedSections.length > 0) {
        setActiveSection(parsedSections[0].title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      }
    }
  }, [faqContent]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSections(sections);
    } else {
      const filtered = sections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSections(filtered);
    }
  }, [searchTerm, sections]);

  const parseMarkdown = (content) => {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace('## ', ''),
          content: '',
          icon: getIconForSection(line.replace('## ', ''))
        };
        currentContent = [];
      } else if (!line.startsWith('# ')) {
        currentContent.push(line);
      }
    });

    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return sections;
  };

  const getIconForSection = (title) => {
    const iconMap = {
      'What documents do I need to rent a car?': <FileText className="w-5 h-5" />,
      'Legal Requirements for Foreign Drivers in Vietnam': <Shield className="w-5 h-5" />,
      'Can I return the car to a different location?': <MapPin className="w-5 h-5" />,
      'Is there an age requirement?': <Calendar className="w-5 h-5" />,
      'Are there mileage limits?': <Car className="w-5 h-5" />,
      'How do I modify or cancel my booking?': <CreditCard className="w-5 h-5" />,
      'What should I check before driving away with the rental car?': <Car className="w-5 h-5" />,
      'What happens if I get into an accident?': <AlertCircle className="w-5 h-5" />,
      'Are there restrictions on where I can drive?': <MapPin className="w-5 h-5" />,
      'Can I add additional drivers to the rental agreement?': <Users className="w-5 h-5" />,
      'What types of insurance coverage are available?': <Shield className="w-5 h-5" />,
      'Traffic Rules and Regulations in Vietnam': <AlertCircle className="w-5 h-5" />,
      'Emergency Contacts and Useful Information': <Phone className="w-5 h-5" />,
      'Payment and Pricing Information': <CreditCard className="w-5 h-5" />
    };

    return iconMap[title] || <FileText className="w-5 h-5" />;
  };

  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      if (line.startsWith('- ')) {
        return (
          <div key={index} className="flex items-start mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">{line.replace('- ', '')}</span>
          </div>
        );
      }
      
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className="text-lg font-semibold text-green-800 mt-6 mb-3">
            {line.replace('### ', '')}
          </h4>
        );
      }
      
      if (line.includes('Note:') || line.includes('Important:') || line.includes('Legal')) {
        return (
          <div key={index} className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 rounded-r-lg">
            <p className="text-amber-800 text-sm font-medium">{line}</p>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-3 text-gray-700 leading-relaxed">
          {line}
        </div>
      );
    });
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollToQuestion = (index) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      setOpenIndex(index);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (!faqContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-0"> 
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white pt-24"> {/* Added pt-24 for header spacing */}
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-green-100 text-xl mb-8">Find answers to common questions about car rental in Vietnam</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl text-gray-900 placeholder-gray-500 border border-white focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 shadow-xl bg-white"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-green-600" />
                    Quick Navigation
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">Jump to any section</p>
                </div>
                
                <div className="p-6 max-h-96 overflow-y-auto">
                  <nav className="space-y-2">
                    {filteredSections.map((section, index) => {
                      const originalIndex = sections.findIndex(s => s.title === section.title);
                      const isActive = openIndex === originalIndex;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => scrollToQuestion(originalIndex)}
                          className={`w-full text-left p-4 rounded-xl text-sm transition-all duration-300 group ${
                            isActive
                              ? 'bg-green-100 text-green-800 shadow-md transform scale-105'
                              : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                              isActive 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-700'
                            }`}>
                              {section.icon}
                            </div>
                            <span className="font-medium leading-tight">{section.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
              <div ref={contentRef} className="space-y-6">
                {filteredSections.length === 0 && searchTerm ? (
                  <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or browse all questions above.</p>
                    <button
                      onClick={clearSearch}
                      className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  filteredSections.map((section, index) => {
                    const originalIndex = sections.findIndex(s => s.title === section.title);
                    const isOpen = openIndex === originalIndex;
                    
                    return (
                      <div
                        key={originalIndex}
                        id={`question-${originalIndex}`}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl"
                      >
                        <button
                          className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => toggleAccordion(originalIndex)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-green-100 text-green-600 flex-shrink-0">
                              {section.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {section.title}
                              </h3>
                            </div>
                          </div>
                          <div className={`transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}>
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                          </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="px-8 pb-8 border-t border-gray-100">
                            <div className="pt-6 text-gray-700 leading-relaxed">
                              {renderContent(section.content)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-0"> {/* Added mb-0 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">500+</h4>
                <p className="text-gray-600">Vehicles Available</p>
                <p className="text-sm text-gray-500 mt-1">Across Vietnam</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Full</h4>
                <p className="text-gray-600">Insurance Coverage</p>
                <p className="text-sm text-gray-500 mt-1">Comprehensive protection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Easy</h4>
                <p className="text-gray-600">Online Booking</p>
                <p className="text-sm text-gray-500 mt-1">Simple reservation process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}