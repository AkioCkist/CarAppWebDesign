"use client";
import { useState } from "react";

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
  const [form, setForm] = useState({
    vehicleType: vehicleTypes[0],
    pickUp: "",
    dropOff: "",
    pickUpDate: "",
    pickUpTime: "",
    dropOffDate: "",
    dropOffTime: "",
  });

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
      <header className="fixed top-0 left-0 w-full z-30 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            {/* Logo SVG */}
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2563eb"/><text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff" fontFamily="sans-serif">W</text></svg>
            <span>Whale Xe</span>
          </div>
          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a href="#about" className="hover:text-blue-600 transition">About Us</a>
            <a href="#renting" className="hover:text-blue-600 transition">Renting Car</a>
          </nav>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">Login</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Register</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your Journey Starts Here</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">Find the perfect car for your next adventure with Whale Xe.</p>
          <form className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto" onSubmit={e => e.preventDefault()}>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleFormChange}
              className="w-full md:w-40 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              name="pickUp"
              placeholder="Pick Up Location"
              value={form.pickUp}
              onChange={handleFormChange}
              className="w-full md:w-48 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="dropOff"
              placeholder="Drop Off Location"
              value={form.dropOff}
              onChange={handleFormChange}
              className="w-full md:w-48 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={sameLocation}
            />
            <label className="flex items-center gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                name="sameLocation"
                checked={sameLocation}
                onChange={handleFormChange}
              />
              Same as Pick Up
            </label>
            <input
              type="date"
              name="pickUpDate"
              value={form.pickUpDate}
              onChange={handleFormChange}
              className="w-full md:w-36 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              name="pickUpTime"
              value={form.pickUpTime}
              onChange={handleFormChange}
              className="w-full md:w-28 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              name="dropOffDate"
              value={form.dropOffDate}
              onChange={handleFormChange}
              className="w-full md:w-36 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              name="dropOffTime"
              value={form.dropOffTime}
              onChange={handleFormChange}
              className="w-full md:w-28 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition mt-2 md:mt-0">Search</button>
          </form>
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
              <li>123 Ocean Drive, City, Country</li>
              <li>+1 234 567 890</li>
              <li>info@whalexe.com</li>
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
              <a href="#" className="hover:text-blue-300"><svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M17 8.5a2.5 2.5 0 0 1-2.5 2.5H14v2h1.5a2.5 2.5 0 0 1 0 5H14v2h-2v-2h-1.5a2.5 2.5 0 0 1 0-5H12v-2h-1.5A2.5 2.5 0 0 1 8 8.5V7h2v1.5A.5.5 0 0 0 10.5 9H12V7h2v2h1.5A.5.5 0 0 0 15 8.5V7h2v1.5z"/></svg></a>
              <a href="#" className="hover:text-blue-300"><svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M19 7.5a2.5 2.5 0 0 1-2.5 2.5H16v2h1.5a2.5 2.5 0 0 1 0 5H16v2h-2v-2h-1.5a2.5 2.5 0 0 1 0-5H14v-2h-1.5A2.5 2.5 0 0 1 10 7.5V6h2v1.5A.5.5 0 0 0 12.5 8H14V6h2v2h1.5A.5.5 0 0 0 17 7.5V6h2v1.5z"/></svg></a>
              <a href="#" className="hover:text-blue-300"><svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-2a6 6 0 1 1 0 12A6 6 0 0 1 12 6z"/></svg></a>
              <a href="#" className="hover:text-blue-300"><svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M16 8a4 4 0 1 0-8 0v8a4 4 0 1 0 8 0V8z"/></svg></a>
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

