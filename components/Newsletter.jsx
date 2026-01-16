import React, { useState } from 'react'
import Title from './Title'
import toast from 'react-hot-toast'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    if (!email) {
      toast.error('Please enter your email!')
      return
    }

    // Replace this with your actual API call
    toast.success(`Subscribed with ${email}`)
    setEmail('') // clear input
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className='flex flex-col items-center mx-4 my-36'>
      <Title
        title="Join the ArewaCostume Community"
        description="Stay connected with Arewa culture! Subscribe to receive exclusive updates on new traditional designs, fashion tips, and upcoming collections from ArewaCostume."
        visibleButton={false}
      />

      <div className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200'>
        <input
          className='flex-1 pl-5 outline-none rounded-l-full'
          type="email"
          placeholder='Enter your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className='font-medium bg-green-500 text-white px-7 py-3 rounded-r-full hover:scale-105 active:scale-95 transition'
        >
          Get Updates
        </button>
      </div>
    </div>
  )
}

export default Newsletter
