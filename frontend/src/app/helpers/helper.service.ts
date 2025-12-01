import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  private cache: any = null;                  // Full API result
  private lastFetchTime: number = 0;
  private CACHE_DURATION = 1000 * 60 * 5;     // 5 minutes

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------
  // Fetch API data (country, state, city) with cache
  // ---------------------------------------------------------
  getCountryStateCity(): Observable<any> {

    const now = Date.now();

    // Use cache if fresh
    if (this.cache && (now - this.lastFetchTime < this.CACHE_DURATION)) {
      return of(this.cache);
    }

    // Otherwise call API
    const url = `${environment.BASE_URL}/api/init`;

    return this.http.get(url).pipe(
      tap((res: any) => {
        this.cache = res;                     // full response stored
        this.lastFetchTime = Date.now();
      })
    );
  }

  // ---------------------------------------------------------
  // Return all countries
  // ---------------------------------------------------------
  getAllCountries(): string[] {
    if (!this.cache) return [];
    return this.cache.countries.map((c: any) => c);
  }

  // ---------------------------------------------------------
  // Return all states of a country
  // ---------------------------------------------------------
  getStates(countryName: string): string[] {
    if (!this.cache) return [];

    const states = this.cache?.statesByCountry[countryName] || [];

    return states.map((s: any) => s.name);
  }

  // ---------------------------------------------------------
  // Return all cities in a state
  // ---------------------------------------------------------
  getCities(countryName: string, stateName: string): string[] {
    if (!this.cache) return [];

    const states = this.cache.statesByCountry[countryName] || [];

    const state = states.find((s: any) => s.name === stateName);

    return state ? state.cities : [];
  }

  // ---------------------------------------------------------
  // Get the raw cached data
  // ---------------------------------------------------------
  getCached() {
    return this.cache;
  }

  // ---------------------------------------------------------
  // Force refresh API
  // ---------------------------------------------------------
  refresh(): Observable<any> {
    this.cache = null;
    return this.getCountryStateCity();
  }
}
