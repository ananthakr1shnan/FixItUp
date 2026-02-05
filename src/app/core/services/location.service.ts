import { Injectable } from '@angular/core';
import citiesData from '../../files/cities.json';

export interface City {
  id: string;
  name: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private cities: City[] = citiesData as City[];

  constructor() { }

  getStates(): string[] {
    const states = [...new Set(this.cities.map(city => city.state))];
    return states.sort();
  }

  getCities(stateName: string): string[] {
    const citiesInState = this.cities
      .filter(city => city.state === stateName)
      .map(city => city.name);
    return citiesInState.sort();
  }

  getAllCities(): City[] {
    return this.cities;
  }

  // Format location for display
  formatLocation(state: string, city: string): string {
    return `${city}, ${state}`;
  }

  // Parse location string back to components
  parseLocation(location: string): { state: string, city: string } | null {
    const parts = location.split(',').map(p => p.trim());
    if (parts.length === 2) {
      return {
        city: parts[0],
        state: parts[1]
      };
    }
    return null;
  }
}
