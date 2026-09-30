import GalleryBrowser from "./GalleryBrowser";
import { galleryItems } from "./galleryItems";

export default function GalleryPage() {
  return <GalleryBrowser items={galleryItems} />;
}
