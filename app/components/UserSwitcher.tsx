"use client";

import { DEMO_USERS } from "@/app/lib/types";

type Props = {
  currentUserId: string;
  onChange: (userId: string) => void;
};

export function UserSwitcher({ currentUserId, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Viewing as</span>
      <select
        value={currentUserId}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        {DEMO_USERS.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}