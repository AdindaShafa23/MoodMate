'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HelpButtonProps {
  isActive: boolean;
}

export const HelpButton = ({ isActive }: HelpButtonProps) => {
  return (
    <Link href="/help" className="flex-1 flex flex-col items-center gap-1">
      <div className={`flex justify-center items-center w-14 h-14 rounded-full ${ 
          isActive ? 'bg-red-100' : 'bg-gray-100'} `}>
        <p className='text-3xl'>🆘</p>
      </div>

      <motion.span
        animate={{ 
          color: isActive ? '#dc2626' : '#4b5563',
          fontWeight: isActive ? 700 : 500
        }}
        className="text-sm font-medium"
      >
        Bantuan
      </motion.span>
    </Link>
  );
};