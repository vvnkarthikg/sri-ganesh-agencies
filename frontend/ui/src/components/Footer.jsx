import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-footer-conic-gradient text-white py-4 flex flex-row justify-center text-sm/7 tracking-wider text-center '>
      <div>
        <p>&copy; 2024 Sri Gansesh Agencies. All rights reserved.</p>
        <p>
          Contact us at: 
          <a href="mailto:info@yourcompany.com" className='text-yellow-300'> info@yourcompany.com</a> | 
          Phone: +91-1234567890
        </p>
        <p>
          Address: 21-22-35, Main Road, Palakollu, West Godavari, Andhra Pradesh, India
        </p>
      </div>
    </footer>
  )
}

export default Footer
