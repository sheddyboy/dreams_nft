import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";

type UserPageLayoutProps = {
  children: React.ReactNode;
};

const UserPageLayout = ({ children }: UserPageLayoutProps) => {
  return (
    <div className="flex flex-col gap-[25px] max-md:gap-0">
      <div className="bg-nav-gradient flex aspect-[1280/202] bg-cover bg-center max-md:aspect-[390/202]">
        <div className="container mx-auto flex flex-col px-[20px]">
          <nav className="mb-[52px] flex flex-wrap items-center justify-between pt-[26px] max-sm:mb-7 max-sm:justify-center max-sm:gap-2 max-sm:pt-5">
            <Link
              className="font-leckerliOne text-[26px] leading-[35px] text-white underline"
              href={"/"}
            >
              DREAM
            </Link>
            <AuthButton />
          </nav>
          <div className="grid flex-1 grid-cols-[204px,1fr] gap-[27px] max-md:grid-cols-1">
            <div className="max-md:hidden"></div>
            <div className="mb-[20px] flex flex-col justify-end max-md:items-center">
              <span className="block text-[34px] font-medium leading-[42px] text-white">
                Mskdeodp Lipron
              </span>
              <span className="block text-[18px] leading-[21px] text-[#A8A1A1] max-md:mb-[60px]">
                Fine Artist
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-[204px,1fr] gap-[27px] px-[20px] max-md:relative max-md:top-[-60px] max-md:grid-cols-1 max-md:gap-5">
        <div className="relative">
          <div className="absolute right-0 top-[-124px] flex w-[272px] flex-col gap-4 max-md:relative max-md:top-0 max-md:w-full">
            <Card className="border-none">
              <CardContent className="overflow-hidden rounded-[8px] p-0 pb-[10px]">
                <div className="mb-[15px] flex aspect-[272/257] items-end justify-center bg-[url('/dummy_images/nft_user.jpeg')] bg-cover bg-center max-md:aspect-[351/132]">
                  <Button className="mb-[28px] h-auto rounded-[30px] px-[27.5px] py-[10px]">
                    Collaborate
                  </Button>
                </div>
                <div className="flex flex-col gap-[15px] px-2">
                  <h3 className="text-center text-[14px] font-medium leading-[17px] text-[#0DA3B4]">
                    Open to Collaborations
                  </h3>
                  <p className="font-lato text-[14px] leading-[17px] text-black">
                    Let collaborate and i make the best out of your work.my name
                    is mandikis Let collaborate and i make the best out of your
                    work.my name is mandikis
                  </p>
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[17px] text-[#938E8E]">
                        Total NFT
                      </span>
                      <span className="font-lato text-[12px] leading-[14px] text-black">
                        54
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[17px] text-[#938E8E]">
                        No of collaborators
                      </span>
                      <span className="font-lato text-[12px] leading-[14px] text-black">
                        54
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold leading-[16px] text-[#606778]">
                Mskdeodp’s style
              </span>
              <div className="flex flex-wrap items-center gap-[10px]">
                <Badge className="rounded-[30px] bg-[#F1F1F1] text-[14px] font-semibold leading-[17px] text-[#7B7B7B] hover:bg-[#F1F1F1]">
                  Music
                </Badge>
                <Badge className="rounded-[30px] bg-[#F1F1F1] text-[14px] font-semibold leading-[17px] text-[#7B7B7B] hover:bg-[#F1F1F1]">
                  Adobe Illustrator
                </Badge>
                <Badge className="rounded-[30px] bg-[#F1F1F1] text-[14px] font-semibold leading-[17px] text-[#7B7B7B] hover:bg-[#F1F1F1]">
                  Mosaic
                </Badge>
                <Badge className="rounded-[30px] bg-[#F1F1F1] text-[14px] font-semibold leading-[17px] text-[#7B7B7B] hover:bg-[#F1F1F1]">
                  Mosaic
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default UserPageLayout;
