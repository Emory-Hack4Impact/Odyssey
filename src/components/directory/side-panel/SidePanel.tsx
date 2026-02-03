import SearchTile from "./SearchTile";
import ProfileTile from "./ProfileTile";

export default function SidePanel() {
  return (
    <div className="flex flex-col gap-4">
      <SearchTile />
      <ProfileTile />
    </div>
  );
}
