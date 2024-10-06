import NFTCard from "@/components/NFTCard";

type UserPageProps = {};

const UserPage = ({}: UserPageProps) => {
  return (
    <div className="flex flex-col gap-[26px] max-md:gap-3.5">
      <span className="text-[18px] font-medium leading-[22px] text-[#212020]">
        My Collaborations
      </span>
      <div className="grid grid-cols-3 gap-x-[13px] gap-y-[28px] max-md:grid-cols-2 max-sm:grid-cols-1">
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
      </div>
    </div>
  );
};

export default UserPage;
