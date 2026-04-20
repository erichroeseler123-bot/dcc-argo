export type ViatorImageVariant = {
  url: string;
  width: number | null;
  height: number | null;
};

export type ViatorImage = {
  url: string;
  variants: ViatorImageVariant[];
};

export type TourSummary = {
  productCode: string;
  title: string;
  description: string;
  durationMinutes: number | null;
  durationLabel: string;
  priceFrom: number | null;
  currency: string;
  rating: number | null;
  reviewCount: number | null;
  imageUrl: string | null;
  imageVariants: ViatorImageVariant[];
  maxImageWidth: number | null;
  hasLowQualityImage: boolean;
  bookingUrl: string;
  supplierName: string | null;
  tags: string[];
  highlights: string[];
  bestFor: string;
};

export type TourDetail = TourSummary & {
  overview: string;
  meetingPoint: string;
  cancellationText: string;
  cancellationHeadline: string;
  additionalInfo: string[];
  inclusions: string[];
  exclusions: string[];
  departureNotes: string[];
  returnNotes: string[];
  languages: string[];
  images: ViatorImage[];
};

export type ReviewSnippet = {
  quote: string;
  label: string;
};

export type ComparisonRow = {
  label: string;
  smallBoat: string;
  airboat: string;
  largeGroup: string;
};

export type DetailPoint = {
  title: string;
  text: string;
};
