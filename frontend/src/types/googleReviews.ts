export interface PublicGoogleReview {
  id: string;
  authorName: string;
  authorPhoto: string | null;
  authorUri: string | null;
  rating: number;
  text: string;
  relativePublishTime: string;
  publishTime: string | null;
  googleMapsUri: string | null;
}

export interface GoogleReviewsData {
  placeId?: string;
  name?: string;
  rating: number;
  userRatingCount: number;
  reviewsUri: string;
  reviews: PublicGoogleReview[];
  error?: string;
}
