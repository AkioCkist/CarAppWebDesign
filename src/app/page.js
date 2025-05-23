"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

const vehicleTypes = [
  "Sedan",
  "SUV",
  "Electric",
  "Luxury",
];

const cars = [
  {
    name: "Toyota Camry",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$50/day",
    details: "Seats: 5 | Transmission: Auto",
  },
  {
    name: "Tesla Model 3",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$90/day",
    details: "Seats: 5 | Transmission: Auto",
  },
  {
    name: "BMW X5",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$120/day",
    details: "Seats: 5 | Transmission: Auto",
  },
  {
    name: "Honda CR-V",
    image: "https://placehold.co/400x250/cccccc/333333?text=Car",
    price: "$60/day",
    details: "Seats: 5 | Transmission: Auto",
  },
];

const features = [
  {
    icon: "🚗",
    title: "Easy Booking",
    desc: "Book your car in just a few clicks with our seamless online process.",
  },
  {
    icon: "🛡️",
    title: "Wide Selection",
    desc: "Choose from a variety of vehicles to suit every journey and style.",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "Our team is here to help you anytime, anywhere.",
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Enjoy competitive rates and exclusive deals every day.",
  },
];

const news = [
  {
    image: "https://placehold.co/300x200/cccccc/333333?text=News",
    title: "How to Choose the Right Rental Car for Your Trip",
    snippet: "Discover tips and tricks for selecting the perfect vehicle for your next adventure.",
    link: "#",
  },
  {
    image: "https://placehold.co/300x200/cccccc/333333?text=News",
    title: "Electric Cars: The Future of Car Rentals",
    snippet: "Explore the benefits of renting electric vehicles and how they’re changing the industry.",
    link: "#",
  },
  {
    image: "https://placehold.co/300x200/cccccc/333333?text=News",
    title: "Travel Safe: Our COVID-19 Measures",
    snippet: "Learn about our enhanced cleaning protocols and safety measures for your peace of mind.",
    link: "#",
  },
];

const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer:
      "You’ll need a valid driver’s license, a credit card, and proof of insurance. International renters may need a passport.",
  },
  {
    question: "Can I return the car to a different location?",
    answer:
      "Yes, we offer one-way rentals between select locations. Additional fees may apply.",
  },
  {
    question: "Is there an age requirement?",
    answer:
      "Renters must be at least 21 years old. Drivers under 25 may incur a young driver surcharge.",
  },
  {
    question: "Are there mileage limits?",
    answer:
      "Most rentals include unlimited mileage, but some vehicles may have restrictions. Check your rental agreement for details.",
  },
  {
    question: "How do I modify or cancel my booking?",
    answer:
      "You can manage your booking online or contact our support team 24/7 for assistance.",
  },
];

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState(Array(faqs.length).fill(false));
  const [sameLocation, setSameLocation] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [form, setForm] = useState({
    vehicleType: vehicleTypes[0],
    pickUp: "",
    dropOff: "",
    pickUpDate: "",
    pickUpTime: "",
    dropOffDate: "",
    dropOffTime: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleFaqToggle = (idx) => {
    setFaqOpen((prev) =>
      prev.map((open, i) => (i === idx ? !open : open))
    );
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "sameLocation") {
      setSameLocation(checked);
      setForm((f) => ({ ...f, dropOff: checked ? f.pickUp : f.dropOff }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      if (name === "pickUp" && sameLocation) {
        setForm((f) => ({ ...f, dropOff: value }));
      }
    }
  };

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Header */}
      <header 
        className="fixed top-0 left-0 w-full z-30 text-white transition-opacity duration-300"
        style={{ 
          opacity: scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
          backgroundColor: scrollY > 50 ? 'rgba(17, 24, 39, 0.9)' : 'transparent',
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}
      >
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar with contact info and social links */}
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <img src="/logo/logo.png" alt="Whale Xe" className="h-8" />
              <span className="text-2xl font-bold text-white ml-2">Whale Xe</span>
            </a>
          </div>

          <nav className="flex items-center gap-6 text-base font-medium">
            <a href="#" className="text-white hover:text-green-400 transition">Home</a>
            <a href="#" className="text-white hover:text-green-400 transition">Cars</a>
            <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
              Booking <i className="fas fa-chevron-down text-xs"></i>
            </a>
            <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
              My Account <i className="fas fa-chevron-down text-xs"></i>
            </a>
            <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
              Pages <i className="fas fa-chevron-down text-xs"></i>
            </a>
            <a href="#" className="text-white hover:text-green-400 transition">Gallery</a>
            <a href="#" className="text-white hover:text-green-400 transition flex items-center gap-1">
              News <i className="fas fa-chevron-down text-xs"></i>
            </a>
          </nav>
          
          <div>
            <Link href="/signin_registration">
              <button className="px-6 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>

    {/* Hero Section */}
    <section className="relative pt-24"> {/* Increased pt-20 to pt-24 */}
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero/hero.png')",
          filter: "brightness(0.7)"
        }}
      ></div>

      <div className="relative pt-30 pb-16 px-4"> {/* Reduced pt-20 to pt-16 to maintain spacing */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Whale Xe - More than rentals<br />
            We deliver happiness
          </h1> 
            
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-left font-bold text-base text-gray-700">Pick Up Location</label>
                    <select className="w-full py-2 font-medium text-black focus:outline-none text-left">
                      <option>Select location</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-left font-bold text-base text-gray-700">Drop Off Location</label>
                    <select className="w-full py-2 font-medium text-black focus:outline-none text-left">
                      <option>Same as Pick Up</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date/Time Section */}
              <div className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-left font-bold text-base text-gray-700">Pick Up Date & Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="date" 
                        className="py-2 font-medium text-black focus:outline-none text-left"
                        name="pickUpDate"
                        value={form.pickUpDate}
                        onChange={handleFormChange}
                      />
                      <input 
                        type="time" 
                        className="py-2 font-medium text-black focus:outline-none text-left"
                        name="pickUpTime"
                        value={form.pickUpTime}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-left font-bold text-base text-gray-700">Return Date & Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="date" 
                        className="py-2 font-medium text-black focus:outline-none text-left"
                        name="dropOffDate"
                        value={form.dropOffDate}
                        onChange={handleFormChange}
                      />
                      <input 
                        type="time" 
                        className="py-2 font-medium text-black focus:outline-none text-left"
                        name="dropOffTime"
                        value={form.dropOffTime}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button - Centered below the form */}
            <div className="mt-6 text-center">
              <button className="bg-green-500 text-white font-medium py-3 w-full max-w-md mx-auto rounded-lg hover:bg-green-600 transition duration-200">
                Search Your Cars
              </button>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Fleet Section */}
      <section id="renting" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Our Fleet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition">
                <img src={car.image} alt={car.name} className="h-auto max-w-full rounded mb-4" />
                <h3 className="font-semibold text-lg mb-1">{car.name}</h3>
                <div className="text-blue-600 font-bold mb-1">{car.price}</div>
                <div className="text-gray-500 text-sm mb-3">{car.details}</div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">Book Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((n, i) => (
              <div key={i} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col hover:shadow-lg transition">
                <img src={n.image} alt={n.title} className="h-auto max-w-full rounded mb-4" />
                <h3 className="font-semibold text-lg mb-2">{n.title}</h3>
                <p className="text-gray-600 mb-3">{n.snippet}</p>
                <a href={n.link} className="text-blue-600 font-semibold hover:underline mt-auto">Read More</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4">
                <button
                  className="w-full flex justify-between items-center text-left font-semibold text-lg focus:outline-none"
                  onClick={() => handleFaqToggle(i)}
                  aria-expanded={faqOpen[i]}
                  aria-controls={`faq-content-${i}`}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`w-5 h-5 ml-2 transform transition-transform ${faqOpen[i] ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faqOpen[i] && (
                  <div id={`faq-content-${i}`} className="mt-3 text-gray-600 border-t pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">About Us</h3>
            <p className="text-gray-200 text-sm">Whale Xe is dedicated to making your car rental experience smooth, affordable, and enjoyable. Travel with confidence and comfort.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Contact Info</h3>
            <ul className="text-gray-200 text-sm space-y-1">
              <li>158a Lê Lợi, Hải Châu 1, Hải Châu, Đà Nẵng</li>
              <li>+84 0236 3738 399</li>
              <li>contact@whalexe.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
            <ul className="text-gray-200 text-sm space-y-1">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#renting" className="hover:underline">Rentals</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Social Network</h3>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff"/>
                  <path d="M17 8.5a2.5 2.5 0 0 1-2.5 2.5H14v2h1.5a2.5 2.5 0 0 1 0 5H14v2h-2v-2h-1.5a2.5 2.5 0 0 1 0-5H12v-2h-1.5A2.5 2.5 0 0 1 8 8.5V7h2v1.5A.5.5 0 0 0 10.5 9H12V7h2v2h1.5A.5.5 0 0 0 15 8.5V7h2v1.5z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff"/>
                  <path d="M19 7.5a2.5 2.5 0 0 1-2.5 2.5H16v2h1.5a2.5 2.5 0 0 1 0 5H16v2h-2v-2h-1.5a2.5 2.5 0 0 1 0-5H14v-2h-1.5A2.5 2.5 0 0 1 10 7.5V6h2v1.5A.5.5 0 0 0 12.5 8H14V6h2v2h1.5A.5.5 0 0 0 17 7.5V6h2v1.5z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff"/>
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-2a6 6 0 1 1 0 12A6 6 0 0 1 12 6z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300">
                <svg width="24" height="24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" fill="#fff"/>
                  <path d="M16 8a4 4 0 1 0-8 0v8a4 4 0 1 0 8 0V8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-gray-300 text-sm">
          <div className="mb-2">Copyright 2025 - Whale Xe</div>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Terms &amp; Conditions</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

