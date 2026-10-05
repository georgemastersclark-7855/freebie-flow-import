export interface ProfilePhoto {
  bitmap: ImageBitmap;
  previewUrl: string;
}

export async function readProfilePhoto(file: File): Promise<ProfilePhoto> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP photo.");
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error("Choose a photo smaller than 10 MB.");
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); } catch { throw new Error("This photo couldn't be opened. Try another JPG, PNG or WebP file."); }
  if (bitmap.width < 128 || bitmap.height < 128 || bitmap.width * bitmap.height > 40_000_000) {
    bitmap.close();
    throw new Error("Choose a photo at least 128 pixels wide and tall, and no larger than 40 megapixels.");
  }
  return { bitmap, previewUrl: URL.createObjectURL(file) };
}

export function photoCrop(photo: ProfilePhoto, zoom: number, x: number, y: number) {
  const side = Math.min(photo.bitmap.width, photo.bitmap.height) / zoom;
  return { side, left: (photo.bitmap.width - side) * x / 100, top: (photo.bitmap.height - side) * y / 100 };
}

export async function cropProfilePhoto(photo: ProfilePhoto, zoom: number, x: number, y: number): Promise<File> {
  const crop = photoCrop(photo, zoom, x, y);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to prepare your photo. Please try again.");
  context.drawImage(photo.bitmap, crop.left, crop.top, crop.side, crop.side, 0, 0, 512, 512);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.88));
  if (!blob) throw new Error("Unable to prepare your photo. Please try another image.");
  const extension = blob.type === "image/webp" ? "webp" : "png";
  return new File([blob], `profile.${extension}`, { type: blob.type });
}
