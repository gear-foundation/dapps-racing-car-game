import { Car, Cars } from '@/types';

export interface RoadProps {
  newCars: Cars;
  carIds: string[];
}

export interface CarState extends Omit<Car, 'position'> {
  position: number;
  positionY: number;
}

export interface CarsState {
  [key: string]: CarState;
}
