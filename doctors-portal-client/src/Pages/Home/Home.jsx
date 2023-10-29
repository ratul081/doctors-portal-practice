import MakeAppointment from "./MakeAppointment.jsx/MakeAppointment";
import Services from "./Services/Services";
import ContactUs from "../Shared/ContactUs/ContactUs";
import HomeBanner from "./HomeBanner/HomeBanner";
import HomeMiddleBanner from "./HomeMiddleBanner/HomeMiddleBanner";
import HomeCards from "./InfoCards/HomeCards";
import Testimonial from "./Testimonial/Testimonial";

const Home = () => {
  return (
    <>
      <HomeBanner></HomeBanner>
      <HomeCards></HomeCards>
      <Services></Services>
      <HomeMiddleBanner></HomeMiddleBanner>
      <MakeAppointment></MakeAppointment>
      <Testimonial></Testimonial>
      <ContactUs></ContactUs>
    </>
  );
};

export default Home;
