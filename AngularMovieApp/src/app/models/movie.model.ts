// API Reponse
export interface ApiResponse {
  page: number,
  results: Movie[]
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string;
  // poster?: string; 
  primaryImage : {
      url: string;
  },
  titleText: {
      text: string,
    },
    originalTitleText: {
      text: string,
    },
    releaseYear: {
      year: number,
      endYear: number,
    }
}
