import SearchTile from "./SearchTile";
import ProfileTile from "./ProfileTile";

export default function SidePanel({
  activeCard,
  setSearch,
}: {
  activeCard: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SearchTile setSearch={setSearch} />
      <ProfileTile activeCard={activeCard} />
    </div>
  );
}
