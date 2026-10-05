import shieldImage from "@/assets/herosection/sheildWithRating.png";
import AppButton from "@/components/ui/MyButton/AppButton";
import Image from "next/image";
import HeroSearchForm from "./HeroSearchForm";

const HeroSection = () => {
  return (
    <div className="bg-primary text-white py-20 min-h-[60vh]">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3 py-10 pt-28">
        {/* left  */}
        <div className="lg:col-span-2">
          <h1 className="text-white text-[64px] font-bold max-w-4xl">
            Committed to your health & life long care
          </h1>
          <p className="mt-7 max-w-2xl leading-normal">
            We are committed to providing you with the best medical and
            healthcare services to help you live healthier and happier.
          </p>
          {/* search form  */}
          <HeroSearchForm />
        </div>
        {/* right */}
        <div>
          <Image
            src={shieldImage}
            width={200}
            height={200}
            alt="shield image eith rating"
          />
          <div className="mt-20 flex flex-col gap-5 w-fit">
            <AppButton type="primary" danger className="text-xl p-6">
              Book Appointment
            </AppButton>
            <AppButton status="success" className="p-6 text-lg font-medium">
              Clinics Near You
            </AppButton>

            <AppButton danger className="text-xl p-6 " variant="outlined">
              Emergency
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
