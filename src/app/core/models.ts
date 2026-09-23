export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface Project {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  client: string;
  image: string;
  year: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface Lead {
  name: string;
  email: string;
  message: string;
}

export interface LeadResult {
  id: string;
  demo: boolean;
}

export interface WeatherCurrent {
  temperature: number | null;
  description: string;
  city: string;
}

export interface Testimonial {
  id: number;
  name: string;
  body: string;
}
