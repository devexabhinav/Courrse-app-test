"use client";

import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import page from "./user-access/page";

const testimonials = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet ex labore id beatae molestiae, libero quis eum nam voluptates quidem.",
    name: "Jane Doe",
    role: "Land Broker",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet ex labore id beatae molestiae, libero quis eum nam voluptates quidem.",
    name: "John Smith",
    role: "Real Estate Agent",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet ex labore id beatae molestiae, libero quis eum nam voluptates quidem.",
    name: "Alice Johnson",
    role: "Property Consultant",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet ex labore id beatae molestiae, libero quis eum nam voluptates quidem.",
    name: "Bob Brown",
    role: "Investor",
  },
];

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const trendingCourses = [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "John Smith",
      rating: "4.8",
      image: " /images/react.jpg",
    },
    {
      id: 2,
      title: "Master Tailwind CSS in 2025",
      instructor: "Jane Doe",
      rating: "4.9",
      image: "/images/tailwend.jpg",
    },
    {
      id: 3,
      title: "JavaScript for Beginners",
      instructor: "Chris Lee",
      rating: "4.7",
      image: "/images/javascript.jpg",
    },
    {
      id: 4,
      title: "Full Stack Web Developer",
      instructor: "Emma Brown",
      rating: "4.6",
      image: "/images/Full-Stack.png",
    },

    {
      id: 5,
      title: "Modern Web Design with HTML & CSS",
      instructor: "Emma Brown",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=80",
    },

    {
      id: 6,
      title: "Modern Web Design with HTML & CSS",
      instructor: "Emma Brown",
      rating: "4.6",
      image: "/images/react.jpg",
    },

    {
      id: 7,
      title: "Modern Web Design with HTML & CSS",
      instructor: "Emma Brown",
      rating: "4.6",
      image: "/images/tailwend.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight text-blue-600">
            <img src="/images/logo.png" className="w-[50px]"></img>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
            <a href="#" className="transition hover:text-blue-600">
              Home
            </a>
            <a href="#" className="transition hover:text-blue-600">
              Courses
            </a>
            <a href="#" className="transition hover:text-blue-600">
              About
            </a>
          </nav>

          {/* Login / Sign Up */}
          <div className="hidden items-center gap-4 md:flex">
            <button className="font-medium text-gray-700 hover:text-blue-600">
              Login
            </button>
            <button className="hover:bg-#d3cece rounded-full bg-[#02517b] px-5 py-2 text-white transition hover:bg-[#d3cece] hover:text-black">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 focus:outline-none md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t bg-white shadow-inner md:hidden">
            <nav className="flex flex-col space-y-3 px-6 py-4">
              <a href="#" className="transition hover:text-blue-600">
                Home
              </a>
              <a href="#" className="transition hover:text-blue-600">
                Courses
              </a>
              <a href="#" className="transition hover:text-blue-600">
                About
              </a>
              <a href="#" className="transition hover:text-blue-600">
                Contact
              </a>
              <div className="mt-3 flex gap-3">
                <button className="flex-1 rounded-full border border-blue-600 px-5 py-2 font-semibold text-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white hover:shadow-lg">
                  Login
                </button>

                {/* Sign Up Button */}
                <button className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Banner-section */}
      <div
        className="banner relative h-[500px] overflow-hidden bg-cover bg-center bg-no-repeat md:h-[600px]"
        style={{ backgroundImage: "url('/images/img1.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 z-10 bg-black/50"></div>

        {/* Banner content */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center md:px-20">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            Kickstart Your IT Journey
          </h1>
          <p className="mb-6 max-w-2xl text-base text-white md:text-lg">
            Learn the newest IT technologies and gain hands-on experience with
            courses designed to turn knowledge into real-world skills.
          </p>
          <a href="#courses" className="btn-corners">
            Explore Courses
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>

        {/* Floating circles with content */}
        <div className="absolute left-10 top-10 z-20 flex h-28 w-28 items-center justify-center rounded-full bg-orange-400/70 blur-2xl">
          <span className="text-lg font-bold text-white">Web</span>
        </div>
        <div className="absolute bottom-20 right-20 z-20 flex h-32 w-32 items-center justify-center rounded-full bg-blue-400/60 blur-2xl">
          <span className="text-lg font-bold text-white">AI</span>
        </div>
        <div className="absolute left-3/4 top-1/2 z-20 flex h-24 w-24 items-center justify-center rounded-full bg-pink-400/60 blur-2xl">
          <span className="text-lg font-bold text-white">UX</span>
        </div>
        <div className="absolute bottom-10 left-1/4 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-green-400/60 blur-2xl">
          <span className="text-lg font-bold text-white">SEO</span>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* --- Existing Header & Banner Here --- */}
        {/* --- about us --- */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:flex-row md:px-12">
            {/* Left Image Section */}
            <div className="relative flex w-full justify-center md:w-1/2">
              <img
                src="/images/img2.png"
                alt="Learning"
                className="w-full rounded-2xl object-cover shadow-lg md:w-[90%]"
              />

              {/* Badge */}
              <div className="float absolute bottom-4 left-4 flex items-center space-x-2 rounded-xl bg-white p-4 shadow-md">
                <div className="rounded-full bg-teal-100 p-2 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8.25v7.5m0 0l3.75-3.75M12 15.75l-3.75-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">29+</p>
                  <p className="text-xs text-gray-500">Wonderful Awards</p>
                </div>
              </div>
            </div>

            {/* Right Content Section */}
            <div className="w-full md:w-1/2">
              <h2 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
                Learn & Grow Your Skills <br />
                From{" "}
                <span className="font-extrabold text-[#02517b]">Anywhere</span>
              </h2>
              <p className="mb-6 text-gray-500">
                DevexHub helps you learn the most in-demand skills quickly and
                effectively. With our practical courses and expert guidance, you
                can gain the knowledge and experience you need to grow in your
                career.Whether you want to start a new job, improve your current
                role, or explore new opportunities, DevexHub provides the tools
                and support to help you succeed.
              </p>

              <ul className="space-y-3">
                <li className="flex items-center font-medium text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#fbbf24"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Expert Trainers
                </li>
                <li className="flex items-center font-medium text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#fbbf24"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Online Remote Learning
                </li>
                <li className="flex items-center font-medium text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#fbbf24"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Lifetime Access
                </li>
                <li className="flex items-center font-medium text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#fbbf24"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Career Support & Guidance
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Courses Slider Section --- */}
        <section id="courses" className="my-20 px-6 md:px-20">
          <div className="container">
            <h2 className="trending-text mb-2 text-center text-3xl font-extrabold md:text-4xl">
              Explore My Courses
            </h2>
            <p className="mb-10">
              DevexHub empowers you to build in-demand skills quickly and take
              <br></br>
              your career to the next level in today’s evolving job market.
            </p>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {trendingCourses.map((course) => (
                <SwiperSlide key={course.id}>
                  <div className="rounded-xl bg-white shadow-lg transition hover:scale-105 hover:shadow-2xl">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-48 w-full rounded-t-xl object-cover"
                    />
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        {course.title}
                      </h3>
                      <p className="mb-1 text-sm text-gray-500">
                        Instructor: {course.instructor}
                      </p>
                      <p className="text-sm font-medium text-yellow-500">
                        Rating: {course.rating} ★
                      </p>
                      <button className="relative mt-4 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#012d48] via-[#02517b] to-[#0388c7] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(2,81,123,0.6)]">
                        <span className="relative z-10">Enroll Now</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#0388c7] to-[#02517b] opacity-0 transition-opacity duration-500 hover:opacity-100"></span>
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </div>

      {/* --- Courses Slider end --- */}
      <section
        className="relative overflow-hidden bg-[#02527c05] bg-center bg-no-repeat py-20"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
        {/* Moving dotted circle left */}
        <div className="absolute left-0 top-1/4 h-24 w-24">
          <div className="relative h-full w-full">
            {/* Spinning background circle */}
            <div className="spin-circle absolute left-7 h-24 w-24 rounded-full border-2 bg-[#02517b]"></div>

            {/* Moving top-to-bottom circle */}
            <div className="move-circle absolute left-4 top-0 h-16 w-16 rounded-full bg-white opacity-50"></div>
          </div>
        </div>

        {/* Moving dotted grid right */}
        <div className="absolute right-0 top-1/4 h-24 w-24">
          <div className="mobile grid grid-cols-4 gap-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-75"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-150"></div>
            <div className="bg-[#02517b]delay-200 h-2 w-2 animate-pulse rounded-full"></div>
            <div className="delay-50 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
            <div className="bg-[#02517b]delay-100 h-2 w-2 animate-pulse rounded-full"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-150"></div>
            <div className="bg-[#02517b]delay-200 h-2 w-2 animate-pulse rounded-full"></div>
            <div className="bg-[#02517b]delay-75 h-2 w-2 animate-pulse rounded-full"></div>
            <div className="delay-125 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
            <div className="delay-175 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
            <div className="delay-225 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
            <div className="delay-50 h-2 w-2 animate-pulse rounded-full bg-[#02517b]"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-100"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-150"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#02517b] delay-200"></div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h1 className="l mb-6 text-3xl font-extrabold leading-[1.2] text-gray-900">
            Earn a Professional{" "}
            <span className="text-[#02517b]">Certificate</span> and Advance Your
            Skills"
          </h1>
          <a
            href="#"
            className="inline-block rounded-lg bg-[#02517b] px-6 py-3 font-medium text-white transition hover:bg-[#5687a1bf]"
          >
            Get started now →
          </a>
        </div>
      </section>

      <Testimonial />

      <footer className="bg-[#00537e] pb-8 pt-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Logo & Description */}
            <div>
              <div className="mt-6 flex space-x-4">
                <a
                  href="#"
                  className="text-white transition hover:text-orange-500"
                >
                  <FaFacebookF />
                </a>
                <a href="#" className="transition hover:text-orange-500">
                  <FaTwitter />
                </a>
                <a href="#" className="transition hover:text-orange-500">
                  <FaInstagram />
                </a>
                <a href="#" className="transition hover:text-orange-500">
                  <FaLinkedinIn />
                </a>
              </div>
              <p className="mt-4 text-white">
                Learn in-demand skills and advance your career with our
                expert-led courses.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white transition">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white transition">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-white">
                Contact Us
              </h3>
              <p className="text-white">123 Main Street, Mohali, Punjab</p>
              <p className="mt-2 text-white">Email: info@devexhub.com</p>
              <p className="mt-2 text-white">Phone: +91 98765 43210</p>
            </div>

            {/* Newsletter / Search */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Subscribe / Search</h3>
              <p className="mb-3 text-white">
                Enter your email to get latest updates:
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-l-md bg-white px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
                <button className="rounded-r-md bg-[#dcdcdc] px-4 py-2 text-[#000] transition">
                  Subscribe
                </button>
              </div>

              <p className="mb-2 mt-4 text-white">Or search our site:</p>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-l-md bg-white px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
                <button className="rounded-r-md bg-[#dcdcdc] px-4 py-2 text-[#000] transition">
                  Go
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-500"></div>

          {/* Bottom Section */}
          <div className="mt-6 flex flex-col items-center justify-between text-sm text-white md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} DevexHub. All rights reserved.
            </p>
            <div className="mt-2 flex space-x-4 md:mt-0">
              <a href="#" className="hover:[#02517b] transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:[#02517b] transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Testimonial() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            Our{" "}
            <span className="font-extrabold text-[#02517b]">Satisfied </span>{" "}
            Clients
          </h2>
          <div className="mt-4 flex items-center justify-center space-x-2"></div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="relative rounded-lg bg-gray-50 p-8 pl-20 italic shadow-md">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-green-600">
                  <i className="fas fa-quote-left"></i>
                </span>
                <p className="mb-4">{t.text}</p>
                <h3 className="text-lg font-bold text-[#02517b]">
                  {t.name}{" "}
                  <span className="block text-sm font-normal">{t.role}</span>
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Page;
