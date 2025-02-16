import React from 'react'

function About() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4"
      style={{ backgroundImage: "url('home-background.jpg')" }}
      
    >
      <div className="text-center text-white bg-red mb-8">
        <h1 className="text-5xl font-bold mb-4">About <span className='cinzel-decorative-bold'>LumiqSure</span></h1>
        <p className="text-xl max-w-3xl mx-auto">
          LumiqSure is committed to providing reliable, transparent, and tailored insurance solutions to help you secure your future with peace of mind. Whether you're looking to protect your home, car, or business, our innovative policies are designed to meet your specific needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 text-white w-full justify-center ">
  <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
    <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
    <p className="text-lg">
      At LumiqSure, our mission is to make insurance simple, accessible, and customer-centric. We aim to provide our clients with exceptional service, prompt claims processing, and the peace of mind that comes with knowing they’re covered.
    </p>
  </div>

  <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
    <h2 className="text-3xl font-semibold mb-4">Why Choose Us?</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Transparent and flexible policies</li>
      <li>Fast and efficient claims processing</li>
      <li>Personalized customer service</li>
      <li>Competitive premiums for all types of coverage</li>
      <li>Innovative solutions for modern needs</li>
    </ul>
  </div>
</div>



      <div className="mt-12 text-center text-white">
        <h2 className="text-4xl font-semibold mb-6">Our Values</h2>
        <p className="text-xl max-w-3xl mx-auto">
          At LumiqSure, we believe in integrity, transparency, and putting our customers first. We are driven by a passion to protect what matters most to you, offering comprehensive coverage and support every step of the way.
        </p>
      </div>
    </div>
  )
}

export default About