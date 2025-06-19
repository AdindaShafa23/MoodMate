'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MoodButtonProps {
  isActive: boolean;
}

export const MoodButton = ({ isActive }: MoodButtonProps) => {
  return (
    <Link href="/mood" className="flex-1 flex flex-col items-center gap-1">
      <div className={`flex justify-center items-center w-14 h-14 rounded-full ${ 
          isActive ? 'bg-blue-100' : 'bg-gray-100'} `}>
        <p className='text-3xl'>😊</p>
      </div>
      
      <motion.span
        animate={{ 
          color: isActive ? '#2563eb' : '#4b5563',
          fontWeight: isActive ? 700 : 500
        }}
        className="text-sm font-medium"
      >
        Mood
      </motion.span>
    </Link>
  );
};