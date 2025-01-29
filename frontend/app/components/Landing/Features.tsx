import { FaDatabase, FaMagic, FaSearch, FaVideo } from "react-icons/fa";
import Feature from "./Feature";
import { FaMessage } from "react-icons/fa6";

export default function Features(){
    return(
        <div className="flex w-full min-h-screen p-24  ">
            <div className=" flex flex-col gap-16">
                <div className="flex flex-col gap-8 text-center">
                        <h1 className="text-5xl font-bold">Discover the Partner You’ve Been Searching For
                        </h1>
                        <p className="text-slate-600 w-[50%] self-center text-xl">Turn your vision into reality by finding your ideal technical co-founder or partner through our AI-powered platform.</p>   
                    </div>
                <div className="grid gap-8 grid-cols-2 bg-gradient-to-b  p-12 rounded-xl">
                    <Feature image="Matches.png" icon={<FaMagic className="shadow-md p-3 rounded-xl" size={50}></FaMagic>} feature="AI-Powered Profile Matching" desc="No more endless searching. Our smart AI scans profiles to pair you with developers who truly align with your goals, expertise, and vision."></Feature>
                    <Feature image="Explore.png" icon={<FaDatabase className="shadow-md p-3 rounded-xl" size={50}></FaDatabase>} feature="Comprehensive Profile Database" desc="Explore a curated database of skilled professionals ready to collaborate. Tailored filters ensure you see only the most relevant matches."></Feature>
                    <Feature image="Message.png" icon={<FaMessage className="shadow-md p-3 rounded-xl" size={50}/>} feature="Real-Time Messaging" desc="Start conversations instantly. Build connections faster with real-time direct messaging."></Feature>
                    <Feature image="Video.png" icon={<FaVideo className="shadow-md p-3 rounded-xl" size={50}/>} feature="Video Chat for Instant Collaboration" desc="Break the ice face-to-face. Connect in live video sessions and bond over shared passions using AI"></Feature>
                    
                </div>

            </div>
        </div>
    )
}