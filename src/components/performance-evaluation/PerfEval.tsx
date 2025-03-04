import React from "react";
import Image from "next/image";
import { NavButton } from "src/components/NavButton";
import { TextField } from "src/components/TextField";
import { Tile } from "src/components/Tile";
import image1 from "./Page/image-1.png";
import search from "./Page/search.svg";
import vector1 from "./Page/vector-1.svg";

export const RegularEmployee = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1512px] h-[982px] relative">
        <div className="flex w-[1512px] items-center justify-between px-[50px] py-[25px] absolute top-0 left-0 bg-[#f4f4f4]">
          <div className="inline-flex items-center gap-[50px] relative flex-[0_0_auto]">
            <Image
              className="relative w-[100px] h-[67.62px] object-cover"
              alt="Image"
              src={image1}
            />

            <div className="items-center justify-center gap-5 inline-flex relative flex-[0_0_auto]">
              <NavButton property1="main" text="Dashboard" />
              <NavButton property1="main" text="HR Services" />
              <NavButton property1="main" text="Events & Announcements" />
              <NavButton property1="main" text="Employee Directory" />
              <NavButton property1="main" text="Feedback" />
            </div>
          </div>

          <div className="inline-flex items-center justify-end gap-[25px] relative flex-[0_0_auto]">
            <img className="relative w-10 h-10" alt="Search" src={search} />

            <div className="relative w-[50px] h-[50px] bg-[#d9d9d9] rounded-[25px]" />
          </div>
        </div>

        <header className="flex flex-col w-[1512px] items-center pt-[50px] pb-[25px] px-[50px] absolute top-[118px] left-0 bg-transparent">
          <div className="flex w-[1417px] items-center justify-between relative flex-[0_0_auto] ml-[-2.50px] mr-[-2.50px]">
            <div className="relative w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[32px] text-center tracking-[0] leading-[normal]">
              HR Services for Jane
            </div>

            <div className="items-start inline-flex relative flex-[0_0_auto]">
              <NavButton property1="sub" text="Time-Off" />
              <NavButton property1="sub" text="Career Development" />
              <NavButton
                property1="sub-selected"
                text="Performance Evaluations"
              />
              <NavButton property1="sub" text="Benefits" />
              <NavButton property1="sub" text="Documents" />
            </div>
          </div>

          <img
            className="relative w-[1412px] h-0.5 mb-[-1.00px]"
            alt="Vector"
            src={vector1}
          />
        </header>

        <div className="flex flex-col w-[1512px] items-center gap-7 pt-0 pb-[35px] px-[100px] absolute top-[244px] left-0">
          <div className="relative self-stretch w-full h-[75px]">
            <TextField property1="dropdown" text="Year" text1="2023" />
            <div className="absolute -top-px left-[525px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
              Performance Evaluations
            </div>
          </div>
        </div>

        <div className="absolute w-[707px] h-[572px] top-[354px] left-0">
          <div className="inline-flex flex-col items-start gap-[15px] pl-[100px] pr-[50px] pt-0 pb-[35px] absolute top-[156px] left-0">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
              Job Performance Ratings
            </div>

            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                Communication
              </div>

              <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                <div className="relative w-[500px] h-5 bg-[#d9d9d9] rounded-[50px]">
                  <div className="h-5 bg-[#939393] rounded-[50px]" />
                </div>

                <div className="relative w-fit mt-[-0.50px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  100%
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                Leadership
              </div>

              <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                <div className="relative w-[500px] h-5 bg-[#d9d9d9] rounded-[50px]">
                  <div className="w-[391px] h-5 bg-[#939393] rounded-[50px]" />
                </div>

                <div className="relative w-fit mt-[-0.50px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  75%
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                Timeliness
              </div>

              <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                <div className="relative w-[500px] h-5 bg-[#d9d9d9] rounded-[50px]">
                  <div className="w-[457px] h-5 bg-[#939393] rounded-[50px]" />
                </div>

                <div className="relative w-fit mt-[-0.50px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  90%
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                Skill
              </div>

              <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                <div className="relative w-[500px] h-5 bg-[#d9d9d9] rounded-[50px]">
                  <div className="w-[250px] h-5 bg-[#939393] rounded-[50px]" />
                </div>

                <div className="relative w-fit mt-[-0.50px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  50%
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                Skill
              </div>

              <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                <div className="relative w-[500px] h-5 bg-[#d9d9d9] rounded-[50px]">
                  <div className="w-[250px] h-5 bg-[#939393] rounded-[50px]" />
                </div>

                <div className="relative w-fit mt-[-0.50px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  50%
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-start gap-[5px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                Skill
              </div>

              <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                <div className="relative w-[500px] h-5 bg-[#d9d9d9] rounded-[50px]">
                  <div className="w-[250px] h-5 bg-[#939393] rounded-[50px]" />
                </div>

                <div className="relative w-fit mt-[-0.50px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  50%
                </div>
              </div>
            </div>
          </div>

          <div className="inline-flex items-start gap-[25px] pl-[100px] pr-[50px] pt-0 pb-[35px] absolute top-0 left-0">
            <Tile property1="stat" text="80%" text1="Overall Rating" />
            <Tile property1="Profiles" text1="Reviewers" />
          </div>
        </div>

        <div className="flex flex-col w-[805px] items-start gap-[15px] pl-[50px] pr-[100px] pt-0 pb-[35px] absolute top-[354px] left-[707px]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
            Strengths
          </div>

          <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
            <br />
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
            <br />
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
          </p>
        </div>

        <div className="flex flex-col w-[805px] items-start gap-[15px] pl-[50px] pr-[100px] pt-0 pb-[35px] absolute top-[545px] left-[707px]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
            Weaknesses
          </div>

          <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
            <br />
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
          </p>
        </div>

        <div className="flex flex-col w-[805px] items-start gap-[15px] pl-[50px] pr-[100px] pt-0 pb-[35px] absolute top-[698px] left-[707px]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
            Improvements
          </div>

          <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
            <br />
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
          </p>
        </div>

        <div className="flex flex-col w-[805px] items-start gap-[15px] pl-[50px] pr-[100px] pt-0 pb-[35px] absolute top-[851px] left-[707px]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
            Other Notes
          </div>

          <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegularEmployee;

