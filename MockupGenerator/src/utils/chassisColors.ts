import { ChassisColor } from '../types';

export const CHASSIS_COLORS: ChassisColor[] = [
  {
    name: 'Space Black',
    color: '#1E1E22',
    borderColor: '#38383C',
    gleamColor: 'rgba(255,255,255,0.16)',
  },
  {
    name: 'Natural Titanium',
    color: '#A8A8A0',
    borderColor: '#C8C8C0',
    gleamColor: 'rgba(255,255,255,0.35)',
  },
  {
    name: 'White Titanium',
    color: '#E8E8E4',
    borderColor: '#F0F0EC',
    gleamColor: 'rgba(255,255,255,0.6)',
  },
  {
    name: 'Desert Titanium',
    color: '#C8B89A',
    borderColor: '#D8C8AA',
    gleamColor: 'rgba(255,255,255,0.3)',
  },
  {
    name: 'Deep Blue',
    color: '#1A2848',
    borderColor: '#2A3858',
    gleamColor: 'rgba(100,140,255,0.2)',
  },
  {
    name: 'Midnight Green',
    color: '#1A2E28',
    borderColor: '#2A3E38',
    gleamColor: 'rgba(80,200,120,0.18)',
  },
  {
    name: 'Rose Gold',
    color: '#C8907A',
    borderColor: '#D8A08A',
    gleamColor: 'rgba(255,200,180,0.3)',
  },
  {
    name: 'Silver',
    color: '#C8C8CC',
    borderColor: '#DCDCE0',
    gleamColor: 'rgba(255,255,255,0.55)',
  },
];

export const DEFAULT_CHASSIS_COLOR = CHASSIS_COLORS[0];
