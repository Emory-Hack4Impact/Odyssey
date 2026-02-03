import SearchTile from "./SearchTile";
import ProfileTile from "./ProfileTile";

export default function SidePanel({
  setSearch,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SearchTile setSearch={setSearch} />
      <ProfileTile />
    </div>
  );
}
