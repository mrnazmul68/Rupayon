import BestSeller from "../pages/BestSeller";
import Curated from "../pages/Curated";
import Hero from "../pages/Hero";
import Offer from "../pages/Offer";
import Worker from "../pages/Worker";

const Home = () => {
    return (
        <div>
            <Hero/>
            <Curated/>
            <BestSeller/>
            <Offer/>
            <Worker/>
        </div>
    );
};

export default Home;