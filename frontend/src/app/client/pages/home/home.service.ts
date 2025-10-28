import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  getChannels(): Observable<any[]> {
  // Replace with HttpClient.get(...) to your backend
  const mock = [
  { id: 'colors-hd', name: 'Colors HD', category: 'Entertainment', logo: 'assets/image/login_page.png', isLive: true },
  { id: 'set-hd', name: 'SET HD', category: 'Entertainment', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak1', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak2', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak3', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak4', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak5', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak6', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak7', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak8', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak9', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak10', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak11', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak12', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak13', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak14', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak15', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak16', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak17', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak18', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak19', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'aaj-tak20', name: 'Aaj Tak', category: 'News', logo: 'assets/image/login_page.png' },
  { id: 'sports18-1', name: 'Sports18 1', category: 'Sports', logo: 'assets/image/login_page.png' },
  // ...more mock channels
  ];
  return of(mock);
  }
}
