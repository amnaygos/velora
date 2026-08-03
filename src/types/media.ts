export type MediaAssetType = "image" | "video";

/** "archive" = studio photography supplied by the client, not generated. */
export type MediaModel = "gpt-2" | "seedance-2" | "archive";

export type MediaAssetStatus = "planned" | "generating" | "ready" | "failed";

export type MediaAsset = {
  id: string;
  page: string;
  section: string;
  type: MediaAssetType;
  model: MediaModel;
  prompt: string;
  aspectRatio: string;
  duration?: number;
  src?: string;
  mobileSrc?: string;
  webmSrc?: string;
  mobileWebmSrc?: string;
  poster?: string;
  alt: string;
  status: MediaAssetStatus;
};

export type MediaBrief = {
  id: string;
  page: string;
  section: string;
  type: MediaAssetType;
  model: MediaModel;
  prompt: string;
  aspectRatio: string;
  duration?: number;
  notes?: string;
};
