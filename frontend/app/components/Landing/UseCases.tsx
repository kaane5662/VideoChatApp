import { FaChartBar, FaGlobe, FaHeart, FaLaptop, FaRocket } from "react-icons/fa";
import UseCase from "./UseCase";

export default function UseCases(){
    return(
        <div className="flex w-full min-h-screen p-24 max-md:p-4 items-center justify-center  ">
                    <div className=" flex flex-col gap-4 items-center justify-center ">
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-5xl max-md:text-4xl font-bold">Use Cases</h1>
                            <p className="text-slate-600 text-xl">Unlock the Potential of Your Vision</p>   
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-12 max-md:p-2 rounded-xl">
                            <UseCase icon={<FaRocket className="text-secondary" size={20}></FaRocket>} use="Launching a Startup" desc="Find a technical partner to help you build a scalable MVP, secure funding, and grow your business."></UseCase>
                            <UseCase icon={<FaLaptop className="text-secondary" size={20}></FaLaptop>} use="Expanding Your Team" desc="Source specialized talent or a co-founder to take your current project to the next level."></UseCase>
                            <UseCase icon={<FaHeart className="text-secondary" size={20}></FaHeart>} use="Collaborating on Side Projects" desc="Meet developers with similar interests and skill levels for passion projects or community-driven innovation."></UseCase>
                            <UseCase icon={<FaGlobe className="text-secondary" size={20}></FaGlobe>} use="Scaling SaaS Solutions" desc="Pair with engineers experienced in your industry to create and optimize SaaS applications."></UseCase>
                            <UseCase icon={<FaChartBar className="text-secondary" size={20}></FaChartBar>} use="Entering New Markets" desc="Find a partner with the expertise to break into new niches or industries and diversify your impact."></UseCase>
                            
                        </div>
        
                    </div>
                </div>
    )
}