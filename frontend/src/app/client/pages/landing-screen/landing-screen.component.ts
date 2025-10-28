import { Component } from '@angular/core';
import { LandingScreenService } from './landing-screen.service';
interface Channel {
id: string;
name: string;
category: string;
logo: string;
isLive?: boolean;
}
@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.css']
})
export class LandingScreenComponent {
channels: Channel[] = [];
categories: string[] = [];
groupedChannels: Record<string, Channel[]> = {};
constructor(private service: LandingScreenService) {}


ngOnInit(): void {
this.service.getChannels().subscribe(data => {
this.channels = data;
this.categories = Array.from(new Set(data.map(c => c.category)));
this.groupByCategory();
});
}


groupByCategory() {
this.groupedChannels = this.categories.reduce((acc, cat) => {
acc[cat] = this.channels.filter(c => c.category === cat);
return acc;
}, {} as Record<string, Channel[]>);
}


scrollLeft(cat: string) {
const container = document.querySelector(`#slider-${cat}`) as HTMLElement;
if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
}


scrollRight(cat: string) {
const container = document.querySelector(`#slider-${cat}`) as HTMLElement;
if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
}


openChannel(ch: Channel) {
alert(`Play channel: ${ch.name}`);
}
}
