import { PDF } from './storage';

export const SEEDED_PDFS: PDF[] = [
  {
    id: 'ncert-physics-xi-1',
    title: 'NCERT Class XI Physics - Part 1',
    filePath: 'https://ncert.nic.in/textbook/pdf/keph101.pdf',
    pageCount: 320,
    isSeeded: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'ncert-physics-xi-2',
    title: 'NCERT Class XI Physics - Part 2',
    filePath: 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
    pageCount: 280,
    isSeeded: true,
    uploadedAt: new Date().toISOString(),
  },
];

export const SAMPLE_TOPICS = [
  'Physical World',
  'Units and Measurements',
  'Motion in a Straight Line',
  'Motion in a Plane',
  'Laws of Motion',
  'Work, Energy and Power',
  'System of Particles and Rotational Motion',
  'Gravitation',
  'Mechanical Properties of Solids',
  'Mechanical Properties of Fluids',
  'Thermal Properties of Matter',
  'Thermodynamics',
  'Kinetic Theory',
  'Oscillations',
  'Waves',
];
