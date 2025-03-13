import NavbarLanding from "../../components/user/common/Navbar-Landing";
import CategorySection from "../../components/user/landing/CategorySection";
import HeroSection from "../../components/user/landing/HeroSection";
import HowItWorksSection from "../../components/user/landing/HowItWorks";

const LandingPage: React.FC = () => {
  

    return (
        <>
             <NavbarLanding />
            <HeroSection></HeroSection>
            <CategorySection></CategorySection>
            <HowItWorksSection></HowItWorksSection>
            
        </>
       
        
  
        
    );
  };
  
  export default LandingPage;