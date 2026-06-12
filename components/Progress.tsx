import React from 'react'

const Progress = ({percentage}: {percentage: number}) => {
  const clamped = Math.min(percentage, 100);
  return (
    <div className='w-full mt-3'>
      <div className='w-full h-2 bg-white/30 rounded-full'>
        <div 
          className='h-2 bg-white rounded-full transition-all duration-300' 
          style={{width: `${clamped}%`}}
        />
      </div>
      {/* ← di luar bar, bukan di dalam */}
      <span className='font-semibold text-sm text-white mt-3 block'>
        {clamped.toFixed(0)}% used
      </span>
    </div>
  )
}

export default Progress