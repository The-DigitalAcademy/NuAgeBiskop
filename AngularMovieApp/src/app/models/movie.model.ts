// Original API response structure
export interface ApiMovie {
  _id: string;
  id: string;
  primaryImage?: {
    url: string;
    caption?: {
      plainText: string;
    };
  } | null;
  titleType: {
    text: string;
    id: string;
  };
  titleText: {
    text: string;
  };
  originalTitleText: {
    text: string;
  };
  releaseYear: {
    year: number;
    endYear: number | null;
  };
  releaseDate?: {
    day: number | null;
    month: number | null;
    year: number;
  } | null;
}

// Simplified Movie model for the app
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating?: number;
  genre?: string;
  imageUrl?: string;
  type: string;
}

export interface ApiResponse {
  results?: ApiMovie[];
  page?: number;
  // Add other API response fields as needed
}
