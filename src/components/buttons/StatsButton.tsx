'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface StatsButtonProps {
  isActive: boolean;  
}

export const StatsButton = ({ isActive }: StatsButtonProps) => {
  return (
    <Link href="/stats" className="flex-1 flex flex-col items-center gap-1">
      <div className={`flex justify-center items-center w-14 h-14 rounded-full ${ 
          isActive ? 'bg-purple-100' : 'bg-gray-100'} `}>
        <p className='text-3xl'>📊</p>
      </div>

      <motion.span
        animate={{ 
          color: isActive ? '#7c3aed' : '#4b5563',
          fontWeight: isActive ? 700 : 500
        }}
        className="text-sm font-medium"
      >
        Statistik
      </motion.span>
    </Link>
  );
};