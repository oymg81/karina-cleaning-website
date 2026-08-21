export interface PublicReview {
  id: string;
  reviewer_name: string;
  rating: number;
  message: string;
  service_type?: string | null;
  created_at: string;
  is_featured?: boolean;
}

export interface ReviewSubmissionPayload {
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_phone?: string;
  rating: number;
  message: string;
  service_type?: string;
  website_url?: string; // Honeypot
}

export interface LeadSubmissionPayload {
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  locale?: 'en' | 'es';
  landing_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  submission_id: string;
  website_url?: string; // Honeypot
}

export interface ReviewsResponse {
  reviews: PublicReview[];
}

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}
