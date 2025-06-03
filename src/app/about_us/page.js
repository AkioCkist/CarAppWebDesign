'use client';
import Image from 'next/image';
import { BarChart, Users, Car, Star, Phone, Mail, MapPin } from 'lucide-react';
import Header from "../../../components/Header";

export default function AboutUs() {
  return (
    <div className="bg-white text-gray-800">
      <Header />

      <section className="max-w-5xl mx-auto py-12 px-6">
        <div className="md:flex md:gap-8">
          <div className="flex-1 flex flex-col justify-center mt-4 md:mt-10">
            <h2 className="text-green-600 font-bold text-5xl md:text-5xl mb-4">Whalecar</h2>
            <h1 className="text-black text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
              More than rentals<br />We deliver happiness
            </h1>
          </div>
          <div className="flex-1 flex flex-col justify-center mt-4 md:mt-10">
            <p className="mb-2 text-base text-gray-800">
              Every trip is a journey to explore life and the world around us, an opportunity for each individual to learn and conquer new things to become better. Therefore, customer experience quality is our top priority and also the inspiration for the Whalecar team.
            </p>
            <p className="text-base text-gray-800">
              Whalecar is a car sharing platform. Our mission is not only to connect car owners and customers quickly – safely – conveniently, but also to inspire the community to explore new things through journeys on our platform.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-1 mt-8">
          {/* Image 1: increase width to reduce gap */}
          <div className="overflow-hidden rounded-xl flex items-stretch h-[300px] w-[105%]">
            <Image
              src="/about_us/image 1.jpg"
              width={550}
              height={300}
              alt="Woman holding a map and smiling"
              className="rounded-xl object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}
            />
          </div>
          {/* Image 2: slightly shorter width */}
          <div className="overflow-hidden rounded-xl flex items-stretch h-[300px] w-[90%] md:ml-auto">
            <Image
              src="/about_us/image 2.jpg"
              width={450}
              height={300}
              alt="Inside a car dashboard view"
              className="rounded-xl object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto md:flex md:items-start md:gap-8">
          {/* Left: Text */}
          <div className="flex-1 px-6 md:px-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Drive. Explore. Inspire</h2>
            <p className="font-semibold text-base md:text-lg mb-2">
              <span className="font-bold">Drive your passion, explore new horizons, and inspire the world around you.</span>
            </p>
            <p className="text-base text-gray-700 mb-2">
              Whalecar aims to become the number one reputable and civilized car user community in Vietnam, bringing practical values to all members and towards a better life.
            </p>
            <p className="text-base text-gray-700">
              We believe every journey matters. Therefore, the Whalecar team and partners with extensive experience in car rental, technology, insurance, and tourism will bring you new, exciting, and safe experiences on your journey.
            </p>
          </div>
          {/* Right: Image */}
          <div className="flex-1 mt-8 md:mt-0 md:pl-8 flex items-center">
            <Image
            src="/about_us/image 3.jpg"
            width={500}
            height={300}
            alt="View from the driver's seat"
            className="rounded-xl object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />


          </div>
        </div>
      </section>

      <section className="py-12 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">Whalecar in Numbers</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center">
              <BarChart className="w-8 h-8 text-green-600" />
              <p className="font-semibold mt-2">200,000+</p>
              <p className="text-sm text-gray-600">Inspiring trips<br />Whalecar has accompanied</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-green-600" />
              <p className="font-semibold mt-2">100,000+</p>
              <p className="text-sm text-gray-600">Customers have<br />experienced our service</p>
            </div>
            <div className="flex flex-col items-center">
              <Car className="w-8 h-8 text-green-600" />
              <p className="font-semibold mt-2">10,000+</p>
              <p className="text-sm text-gray-600">Car owner partners in<br />the Whalecar community</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Car className="w-8 h-8 text-green-600" />
              <p className="font-semibold mt-2">100+</p>
              <p className="text-sm text-gray-600">Different car models for rent</p>
            </div>
            <div className="flex flex-col items-center">
              <BarChart className="w-8 h-8 text-green-600" />
              <p className="font-semibold mt-2">20+</p>
              <p className="text-sm text-gray-600">Cities<br />Whalecar is present in</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-green-600" />
              <p className="font-semibold mt-2">4.95/5*</p>
              <p className="text-sm text-gray-600">Average rating from over 1,000,000 customer reviews of our service</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-24 md:py-36 px-6">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Contact Us</h2>
            <p className="text-base md:text-lg mb-10 text-gray-200">Any question or remarks? Just write us a message!</p>
            <div className="grid md:grid-cols-3 gap-8 text-lg">
            <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-3 text-white" />
                <span className="text-gray-300">+987654321</span>
            </div>
            <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-3 text-white" />
                <span className="text-gray-300">whalexek@gmail.com</span>
            </div>
            <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-2 text-white" />
                <span className="text-gray-300 text-center">158A Le Loi, Hai Chau, Da Nang</span>
            </div>
            </div>
        </div>
        </section>

    </div>
  );
}
