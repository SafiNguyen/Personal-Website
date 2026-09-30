export type GalleryItem = {
  src: string;
  name: string;
  description: string;
  medium: string;
  createdAt: string;
};

export const galleryItems: GalleryItem[] = [
  {
    src: "/gallery/first-light.jpg",
    name: "First Light",
    description: "A study in beginning again, where a small mark becomes a direction.",
    medium: "Digital study",
    createdAt: "2025-09-18",
  },
  {
    src: "/gallery/notes-in-motion.jpg",
    name: "Notes in Motion",
    description: "Fragments of a working day, collected before they settle into a plan.",
    medium: "Photographic study",
    createdAt: "2025-07-04",
  },
  {
    src: "/gallery/blueprint.jpg",
    name: "Blueprint",
    description: "Structure before polish: the quiet geometry underneath a finished idea.",
    medium: "Interface study",
    createdAt: "2024-11-22",
  },
  {
    src: "/gallery/open-air.jpg",
    name: "Open Air",
    description: "A reminder to leave room for the accidental and the unplanned.",
    medium: "Landscape study",
    createdAt: "2024-08-15",
  },
  {
    src: "/gallery/quiet-focus.jpg",
    name: "Quiet Focus",
    description: "The part of the process where the noise falls away and the work gets precise.",
    medium: "Process study",
    createdAt: "2023-12-03",
  },
  {
    src: "/gallery/afterimage.jpg",
    name: "Afterimage",
    description: "What remains after looking twice: a detail, a color, a different reading.",
    medium: "Collaborative study",
    createdAt: "2023-05-27",
  },
];
