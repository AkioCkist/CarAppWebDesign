import { useState, useEffect } from 'react'; // Added useEffect
import { ChevronDown, ChevronUp, FileText, Car, CreditCard, MapPin, Calendar, Shield } from 'lucide-react';
import Link from 'next/link'; // Add this import
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

export default function ModernFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null); // Initialize with null, so all are closed by default

  // useEffect(() => {
  //   // Set the first question to be open by default when component mounts
  //   // setOpenIndex(0); // Commented out to keep all closed by default
  // }, []);

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
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-0">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Find quick answers to common questions about our car rental services. If you can't find what you're looking for, feel free to <Link href="#contact-us" className="text-green-600 hover:text-green-700 font-medium underline">contact us</Link>.
        </p>
      </div>
      <div className="space-y-3 md:space-y-4">
        {faqData.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none transition-colors duration-200 hover:bg-gray-50 rounded-t-xl"
            >
              <div className="flex items-center">
                <div className="mr-3 md:mr-4 text-green-600 bg-green-100 p-2 rounded-lg">
                  {item.icon}
                </div>
                <span className="font-medium text-sm md:text-base text-gray-800">{item.question}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-4 md:p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl overflow-hidden"
                >
                  <div className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}