export interface Traveler {
    userid:   string;
    name:     string;
    nickname?: string;
    home:     string;
    airports: string[];
    avatar?:  string;
    color?:   string;
  }