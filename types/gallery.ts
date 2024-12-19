export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  image: string;
  order?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
