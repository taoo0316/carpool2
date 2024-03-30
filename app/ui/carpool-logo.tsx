import { lusitana } from '@/app/ui/fonts';
import React from 'react';

export default function CarpoolLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <img 
        src="/carpool-logo.png" 
        alt="Carpool Logo" 
        style={{ width: 'auto', height: '50px' }}  // This will set the width to 50px and scale the height proportionally
      />
      <p className="text-[44px]" style={{ paddingLeft: '20px' }}>Carpool</p>
    </div>
  );
}
