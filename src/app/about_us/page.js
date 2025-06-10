'use client';
import Image from 'next/image';
import { BarChart, Users, Car, Star, Phone, Mail, MapPin } from 'lucide-react';
import Header from "../../../components/Header";
import { useEffect, useRef, useState } from 'react';

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef();
  const sectionsRef = useRef([]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observerRef.current.observe(section);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="bg-white text-gray-800 overflow-hidden">
      <Header />
      <div className="h-15 bg-gray/100"></div>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={addToRefs}
        className={`max-w-6xl mx-auto py-16 px-6 transition-all duration-1000 transform ${
          isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="md:flex md:gap-12 items-center">
          <div className="flex-1 flex flex-col justify-center mt-4 md:mt-10">
            <div className="overflow-hidden">
              <h2 className={`text-green-600 font-bold text-5xl md:text-6xl mb-4 transition-all duration-1000 delay-200 transform ${
                isVisible.hero ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}>
                Whale Xe
              </h2>
            </div>
            <div className="overflow-hidden">
              <h1 className={`text-black text-3xl md:text-4xl font-extrabold mb-6 leading-tight transition-all duration-1000 delay-400 transform ${
                isVisible.hero ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}>
                More than rentals<br />
                <span className="text-green-600 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  We deliver happiness
                </span>
              </h1>
            </div>
          </div>
          <div className={`flex-1 flex flex-col justify-center mt-8 md:mt-10 space-y-4 transition-all duration-1000 delay-600 transform ${
            isVisible.hero ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-2xl border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <p className="mb-4 text-base text-gray-800 leading-relaxed">
                Every trip is a journey to explore life and the world around us, an opportunity for each individual to learn and conquer new things to become better. Therefore, customer experience quality is our top priority and also the inspiration for the Whale Xe team.
              </p>
              <p className="text-base text-gray-800 leading-relaxed">
                Whale Xe is a car sharing platform. Our mission is not only to connect car owners and customers quickly – safely – conveniently, but also to inspire the community to explore new things through journeys on our platform.
              </p>
            </div>
          </div>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 mt-12 transition-all duration-1000 delay-800 transform ${
          isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Image 1 */}
          <div className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[350px] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src="/about_us/image 1.jpg"
              width={550}
              height={350}
              alt="Woman holding a map and smiling"
              className="rounded-2xl object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          </div>
          {/* Image 2 */}
          <div className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[350px] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src="/about_us/image 2.jpg"
              width={550}
              height={350}
              alt="Inside a car dashboard view"
              className="rounded-2xl object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:-rotate-1"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section 
        id="mission"
        ref={addToRefs}
        className={`bg-gradient-to-br from-gray-50 via-white to-green-50 py-16 px-6 transition-all duration-1000 transform ${
          isVisible.mission ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto md:flex md:items-center md:gap-12">
          {/* Left: Text */}
          <div className={`flex-1 px-6 md:px-0 transition-all duration-1000 delay-200 transform ${
            isVisible.mission ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
                Drive. Explore. Inspire
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-base md:text-lg text-green-700">
                    Drive your passion, explore new horizons, and inspire the world around you.
                  </p>
                </div>
                <p className="text-base text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                  Whale Xe aims to become the number one reputable and civilized car user community in Vietnam, bringing practical values to all members and towards a better life.
                </p>
                <p className="text-base text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                  We believe every journey matters. Therefore, the Whale Xe team and partners with extensive experience in car rental, technology, insurance, and tourism will bring you new, exciting, and safe experiences on your journey.
                </p>
              </div>
            </div>
          </div>
          {/* Right: Image */}
          <div className={`flex-1 mt-8 md:mt-0 md:pl-8 transition-all duration-1000 delay-400 transform ${
            isVisible.mission ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src="/about_us/image 3.jpg"
                width={500}
                height={400}
                alt="View from the driver's seat"
                className="rounded-2xl object-cover w-full h-[400px] transition-all duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section 
        id="stats"
        ref={addToRefs}
        className={`py-16 bg-white px-6 transition-all duration-1000 transform ${
          isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="overflow-hidden">
            <h2 className={`text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 transition-all duration-1000 delay-200 transform ${
              isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent`}>
              Whale Xe in Numbers
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: BarChart, number: "200,000+", text: "Inspiring trips\nWhale Xe has accompanied", delay: "delay-300" },
              { icon: Users, number: "100,000+", text: "Customers have\nexperienced our service", delay: "delay-400" },
              { icon: Car, number: "10,000+", text: "Car owner partners in\nthe Whale Xe community", delay: "delay-500" }
            ].map((stat, index) => (
              <div key={index} className={`group transition-all duration-1000 ${stat.delay} transform ${
                isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200 group-hover:scale-105">
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors duration-300">
                      <stat.icon className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="font-bold text-2xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">{stat.number}</p>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{stat.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Car, number: "100+", text: "Different car models for rent", delay: "delay-600" },
              { icon: BarChart, number: "20+", text: "Cities\nWhale Xe is present in", delay: "delay-700" },
              { icon: Star, number: "4.95/5*", text: "Average rating from over 1,000,000 customer reviews of our service", delay: "delay-800" }
            ].map((stat, index) => (
              <div key={index} className={`group transition-all duration-1000 ${stat.delay} transform ${
                isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200 group-hover:scale-105">
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors duration-300">
                      <stat.icon className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="font-bold text-2xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">{stat.number}</p>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{stat.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact"
        ref={addToRefs}
        className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-24 md:py-36 px-6 relative overflow-hidden transition-all duration-1000 transform ${
          isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="overflow-hidden">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 transition-all duration-1000 delay-200 transform ${
              isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent`}>
              Contact Us
            </h2>
          </div>
          <p className={`text-base md:text-lg mb-12 text-gray-300 transition-all duration-1000 delay-400 transform ${
            isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Any question or remarks? Just write us a message!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-lg">
            {[
              { icon: Phone, text: "+84 0236 3738 399", delay: "delay-500" },
              { icon: Mail, text: "contact@whalexe.com", delay: "delay-600" },
              { icon: MapPin, text: "158A Le Loi, Hai Chau, Da Nang", delay: "delay-700" }
            ].map((contact, index) => (
              <div key={index} className={`group transition-all duration-1000 ${contact.delay} transform ${
                isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-green-400/30 hover:bg-white/10 transition-all duration-500 group-hover:scale-105 min-h-[200px] flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-green-600/20 p-4 rounded-full mb-4 group-hover:bg-green-600/30 transition-colors duration-300">
                      <contact.icon className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-gray-300 text-center group-hover:text-white transition-colors duration-300 leading-relaxed">
                      {contact.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}