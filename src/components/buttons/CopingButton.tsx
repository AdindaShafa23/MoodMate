'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CopingButtonProps {
  isActive: boolean;
}

export const CopingButton = ({ isActive }: CopingButtonProps) => {
  return (
    <Link href="/coping" className="flex flex-col items-center gap-2">
      <div className={`flex justify-center items-center w-14 h-14 rounded-full ${ 
          isActive ? 'bg-green-100' : 'bg-gray-100'} `}>
        <p className='text-3xl'>💆🏻</p>
      </div>

      <motion.span
        animate={{ 
          color: isActive ? '#16a34a' : '#4b5563',
          fontWeight: isActive ? 700 : 500
        }}
        className="text-sm font-medium"
      >
        Coping
      </motion.span>
    </Link>
  );
};