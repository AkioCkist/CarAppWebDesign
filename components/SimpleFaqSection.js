import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Car, CreditCard, MapPin, Calendar, Shield } from 'lucide-react';
import Link from 'next/link'; // Add this import

export default function ModernFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0); // First question open by default

  const faqData = [
    {
      id: 1,
      question: "What documents do I need to rent a car?",
      icon: <FileText className="w-5 h-5" />,
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            To legally rent a car in Vietnam, you must provide the following:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">A valid driver's license:</strong> Foreigners are required to present an International Driving Permit (IDP) along with their home country's driver's license. Only specific license categories are recognized under Vietnamese law.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">A major credit card in your name:</strong> Most reputable rental agencies require a credit card for security deposits. Cash deposits may be accepted by some local companies but are not common.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Proof of insurance:</strong> You can either use your existing travel/rental insurance or purchase additional coverage from the rental company.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Valid identification:</strong> A passport is mandatory for foreigners renting vehicles in Vietnam.
              </div>
            </li>
          </ul>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4 rounded-r">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> According to Vietnamese law, driving without an IDP as a foreigner may result in fines or penalties.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      question: "Is there an age requirement?",
      icon: <Calendar className="w-5 h-5" />,
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Vietnam has specific age requirements for renting cars:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Minimum age:</strong> Most rental companies require drivers to be at least 21 years old.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Young driver surcharge:</strong> Drivers aged 21–24 may incur additional fees.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Maximum age limits:</strong> Often set at 70–75 years for premium or luxury vehicles.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Experience Requirement:</strong> A minimum of 2 years of driving experience is required by Vietnamese law.
              </div>
            </li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 rounded-r">
            <h4 className="font-semibold text-blue-800 mb-2">Special Case: Motorbike Rentals</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Minimum age: Generally 18+</li>
              <li>• License: Valid motorcycle endorsement or appropriate IDP required</li>
              <li>• Engine Size Restrictions: License categories differ for under 175cc and over 175cc</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      question: "Can I return the car to a different location?",
      icon: <MapPin className="w-5 h-5" />,
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Yes, many rental companies in Vietnam offer one-way rentals, but there are important considerations:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Additional fees:</strong> These vary based on the distance between pickup and drop-off locations.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Availability:</strong> One-way rentals may not be available during peak tourist seasons unless booked well in advance.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Fuel policy:</strong> Ensure the fuel tank is returned at the agreed level.
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Documentation Transfer:</strong> The rental company must update vehicle registration with local authorities at the drop-off location.
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      question: "What types of insurance coverage are available?",
      icon: <Shield className="w-5 h-5" />,
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Several insurance options are available to protect you during your rental:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Basic Liability Insurance:</strong> Mandatory by law
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Collision Damage Waiver (CDW):</strong> Covers damage to the rental vehicle
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Theft Protection:</strong> Covers vehicle theft
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Personal Accident Insurance (PAI):</strong> Covers medical expenses
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Supplemental Liability Insurance (SLI):</strong> Additional liability coverage
              </div>
            </li>
          </ul>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4 rounded-r">
            <p className="text-green-800 text-sm">
              <strong>Advice:</strong> Check for overlapping coverage in your personal/travel insurance to avoid duplicate coverage.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      question: "What should I check before driving away with the rental car?",
      icon: <Car className="w-5 h-5" />,
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Before leaving the rental lot, make sure to check:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Vehicle condition:</strong> Document any pre-existing damage with photos
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Tire condition:</strong> Check for proper inflation and wear
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Fuel level:</strong> Note the starting fuel level
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">Safety equipment:</strong> Ensure fire extinguisher, first aid kit, and warning triangle are present
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-800">GPS/Navigation:</strong> Ensure it's working and up to date
              </div>
            </li>
          </ul>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 rounded-r">
            <p className="text-red-800 text-sm">
              <strong>Legal Reminder:</strong> Always carry proper documents while driving to avoid fines.
            </p>
          </div>
        </div>
      )
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our car rental service in Vietnam
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {faqData.map((faq, index) => (
            <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
              <button
                className={`w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-500 ${
                  openIndex === index ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg transition-colors duration-500 ${
                    openIndex === index 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {faq.icon}
                  </div>
                  <h3 className={`text-lg font-semibold transition-colors duration-500 ${
                    openIndex === index ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </h3>
                </div>
                <div className={`transition-transform duration-500 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <ChevronDown className={`w-5 h-5 ${
                    openIndex === index ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6 pl-20">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All FAQs Button - Updated with Link */}
        <div className="text-center mt-8">
          <Link href="/faq" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <FileText className="w-5 h-5 mr-2" />
            View All FAQs & Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}