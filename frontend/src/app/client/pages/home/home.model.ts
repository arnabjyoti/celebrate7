export interface FeaturedItem {
  id: string;
  title: string;
  tagline?: string;
  bg?: string;
}

export interface Event {
  id: string;
  title: string;
  genre: string;
  rating?: string;
  runtime?: string;
  city?: string;
  organizer?: string;
  poster?: string;
}
