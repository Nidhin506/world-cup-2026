import React from 'react';

// Mapping of 3-letter FIFA codes to 2-letter ISO country codes for FlagCDN
const FIFA_TO_ISO: Record<string, string> = {
  USA: 'us',
  MEX: 'mx',
  ECU: 'ec',
  NZL: 'nz',
  ENG: 'gb-eng', // England flag specifically
  JPN: 'jp',
  NGA: 'ng',
  SUI: 'ch',
  ARG: 'ar',
  KOR: 'kr',
  CMR: 'cm',
  SWE: 'se',
  FRA: 'fr',
  AUS: 'au',
  EGY: 'eg',
  AUT: 'at',
  BRA: 'br',
  KSA: 'sa',
  SEN: 'sn',
  TUR: 'tr',
  BEL: 'be',
  IRN: 'ir',
  MAR: 'ma',
  PAN: 'pa',
  CRO: 'hr',
  COL: 'co',
  CIV: 'ci',
  UKR: 'ua',
  ESP: 'es',
  IRQ: 'iq',
  ALG: 'dz',
  POL: 'pl',
  GER: 'de',
  UZB: 'uz',
  TUN: 'tn',
  DEN: 'dk',
  POR: 'pt',
  UAE: 'ae',
  MLI: 'ml',
  CHI: 'cl',
  NED: 'nl',
  CAN: 'ca',
  RSA: 'za',
  NOR: 'no',
  ITA: 'it',
  QAT: 'qa',
  GHA: 'gh',
  URU: 'uy',
  CZE: 'cz',
  SCO: 'gb-sct',
  CPV: 'cv',
  COD: 'cd',
  PAR: 'py',
  CUW: 'cw',
  JOR: 'jo',
  HAI: 'ht',
  BIH: 'ba'
};

interface TeamFlagProps {
  code?: string;
  name?: string;
  className?: string;
  fallback?: string;
}

export default function TeamFlag({ code, name, className = "w-6 h-4", fallback }: TeamFlagProps) {
  if (!code) {
    return <span className="inline-block text-center">{fallback || '❓'}</span>;
  }
  
  const iso = FIFA_TO_ISO[code.toUpperCase()] || 'un';
  
  return (
    <img
      src={`https://flagcdn.com/w80/${iso}.png`}
      alt={name || code}
      title={name || code}
      className={`inline-block object-cover rounded-[2px] shadow-sm select-none border border-white/10 ${className}`}
      onError={(e) => {
        // Fallback to text or emoji if image load fails
        e.currentTarget.style.display = 'none';
        if (fallback) {
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const span = document.createElement('span');
            span.innerText = fallback;
            parent.appendChild(span);
          }
        }
      }}
    />
  );
}
