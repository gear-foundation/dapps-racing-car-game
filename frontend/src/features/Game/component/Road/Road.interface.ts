import { Car, Cars } from '@/types';

export type CarEffect = 'shooted' | 'accelerated' | null;
export interface RoadProps {
  newCars: Cars;
  carIds: string[];
}

export interface CarState extends Omit<Car, 'position' | 'speed'> {
  position: number;
  positionY: number;
  speed: number;
  effect: CarEffect;
}

export interface CarsState {
  [key: string]: CarState;
}
