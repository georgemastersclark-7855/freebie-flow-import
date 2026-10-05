/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/integrations/supabase/client";
import type { StudentProfile, StudentProfileInput } from "./types";

const db = supabase as any;
export const studentAvatarBucket = "mentorship-student-avatars";
const maxAvatarBytes = 2 * 1024 * 1024;

interface StudentProfileRow {
  enrollment_id: string;
  display_name: string;
  photo_path: string;
  artist_name: string | null;
  instagram: string | null;
  music_url: string | null;
  daw: string | null;
  completed_at: string;
}

const optionalText = (value?: string) => value?.trim() || undefined;

export function normalizeStudentProfileInput(input: StudentProfileInput): StudentProfileInput {
  const displayName = input.displayName.trim();
  if (!displayName || displayName.length > 80) throw new Error("Display name must be between 1 and 80 characters.");

  const artistName = optionalText(input.artistName);
  const daw = optionalText(input.daw);
  if (artistName && artistName.length > 80) throw new Error("Artist name must be 80 characters or fewer.");
  if (daw && daw.length > 80) throw new Error("DAW must be 80 characters or fewer.");

  const rawInstagram = optionalText(input.instagram)?.replace(/^@/, "").toLowerCase();
  if (rawInstagram && (rawInstagram.length > 30 || !/^[a-z0-9._]{1,30}$/.test(rawInstagram))) {
    throw new Error("Enter a valid Instagram handle.");
  }

  const rawMusicUrl = optionalText(input.musicUrl);
  let musicUrl: string | undefined;
  if (rawMusicUrl) {
    if (rawMusicUrl.length > 2048) throw new Error("Music link must be 2,048 characters or fewer.");
    let url: URL;
    try { url = new URL(rawMusicUrl); } catch { throw new Error("Enter a valid HTTPS music link."); }
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) {
      throw new Error("Music link must use HTTPS and must not contain login details.");
    }
    musicUrl = url.href;
  }

  return { displayName, artistName, instagram: rawInstagram, musicUrl, daw };
}

export function studentProfileFromRow(row: StudentProfileRow, photoUrl?: string): StudentProfile {
  return {
    displayName: row.display_name,
    photoPath: row.photo_path,
    photoUrl,
    artistName: row.artist_name ?? undefined,
    instagram: row.instagram ?? undefined,
    musicUrl: row.music_url ?? undefined,
    daw: row.daw ?? undefined,
    completedAt: row.completed_at,
  };
}

async function signedAvatarUrl(path: string) {
  const { data, error } = await db.storage.from(studentAvatarBucket).createSignedUrl(path, 60 * 60);
  return error ? undefined : data.signedUrl as string;
}

async function profileWithPhoto(row: StudentProfileRow): Promise<StudentProfile> {
  return studentProfileFromRow(row, await signedAvatarUrl(row.photo_path));
}

async function removeAvatar(path?: string) {
  if (!path) return;
  await db.storage.from(studentAvatarBucket).remove([path]);
}

export async function loadStudentProfile(enrollmentId: string): Promise<StudentProfile | undefined> {
  const { data, error } = await db.from("mentorship_student_profiles")
    .select("enrollment_id, display_name, photo_path, artist_name, instagram, music_url, daw, completed_at")
    .eq("enrollment_id", enrollmentId)
    .maybeSingle();
  if (error) throw error;
  return data ? profileWithPhoto(data as StudentProfileRow) : undefined;
}

export async function loadStudentProfilesForEnrollments(enrollmentIds: string[]) {
  const profiles = new Map<string, StudentProfile>();
  if (!enrollmentIds.length) return profiles;
  const { data, error } = await db.from("mentorship_student_profiles")
    .select("enrollment_id, display_name, photo_path, artist_name, instagram, music_url, daw, completed_at")
    .in("enrollment_id", enrollmentIds);
  if (error) throw error;
  await Promise.all((data ?? []).map(async (row: StudentProfileRow) => {
    profiles.set(row.enrollment_id, await profileWithPhoto(row));
  }));
  return profiles;
}

export async function saveLiveStudentProfile(
  enrollmentId: string,
  input: StudentProfileInput,
  photo?: File,
): Promise<StudentProfile> {
  if (!enrollmentId.trim()) throw new Error("An active enrollment is required to save your profile.");
  const normalized = normalizeStudentProfileInput(input);
  const { data: existingData, error: existingError } = await db.from("mentorship_student_profiles")
    .select("enrollment_id, display_name, photo_path, artist_name, instagram, music_url, daw, completed_at")
    .eq("enrollment_id", enrollmentId)
    .maybeSingle();
  if (existingError) throw existingError;
  const existing = existingData as StudentProfileRow | null;

  let uploadedPath: string | undefined;
  if (photo) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      throw new Error("Choose a JPEG, PNG or WebP profile photo.");
    }
    if (photo.size <= 0 || photo.size > maxAvatarBytes) throw new Error("Profile photo must be 2 MB or smaller.");
    const extension = photo.type === "image/jpeg" ? "jpg" : photo.type === "image/png" ? "png" : "webp";
    uploadedPath = `${enrollmentId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await db.storage.from(studentAvatarBucket).upload(uploadedPath, photo, {
      cacheControl: "3600",
      contentType: photo.type,
      upsert: false,
    });
    if (uploadError) throw uploadError;
  }

  const photoPath = uploadedPath ?? existing?.photo_path;
  if (!photoPath) {
    throw new Error("Add a profile photo to continue.");
  }

  const { data, error } = await db.rpc("save_mentorship_student_profile", {
    target_enrollment_id: enrollmentId,
    display_name_value: normalized.displayName,
    artist_name_value: normalized.artistName ?? null,
    instagram_value: normalized.instagram ?? null,
    music_url_value: normalized.musicUrl ?? null,
    daw_value: normalized.daw ?? null,
    photo_path_value: photoPath,
  });
  if (error) {
    if (uploadedPath) {
      // A lost RPC response can be ambiguous; do not remove an image the DB already adopted.
      const { data: current } = await db.from("mentorship_student_profiles")
        .select("photo_path")
        .eq("enrollment_id", enrollmentId)
        .maybeSingle();
      if (current?.photo_path === uploadedPath) {
        const committedProfile = await loadStudentProfile(enrollmentId);
        if (committedProfile) return committedProfile;
      }
      await removeAvatar(uploadedPath);
    }
    throw error;
  }

  const row = data as StudentProfileRow;
  if (existing?.photo_path && existing.photo_path !== row.photo_path) await removeAvatar(existing.photo_path);
  return profileWithPhoto(row);
}
