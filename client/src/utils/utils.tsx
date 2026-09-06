import { useState } from "react";

type UserAvatarProps = {
  image?: string | null;
  name?: string | null;
};

export function UserAvatar({
  image,
  name,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const fallback =
    name?.charAt(0).toUpperCase() ?? "U";

  const showImage = image && !imageError;

  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
      {showImage ? (
        <img
          src={image}
          alt={name ?? "User"}
          referrerPolicy="no-referrer"
          className="block h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-600">
          {fallback}
        </div>
      )}
    </div>
  );
}