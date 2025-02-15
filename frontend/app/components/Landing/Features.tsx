import { FaDatabase, FaMagic, FaSearch, FaVideo } from "react-icons/fa";
import Feature from "./Feature";
import { FaMessage } from "react-icons/fa6";

export default function Features(){
    return(
        <div className="flex w-full min-h-screen p-24  ">
            <div className=" flex flex-col gap-16">

                <div className="flex flex-col gap-8 text-center">
                        <h1 className="text-5xl font-bold">Discover the Right Partner—Faster
                        </h1>
                        <p className="text-slate-500 w-[50%] self-center text-lg">Stop searching endlessly. Our AI-driven platform matches you with developers who align with your goals, expertise, and vision.</p>   
                    </div>
                <div className="flex flex-col gap-32 grid-cols-8 bg-gradient-to-b  p-12 rounded-xl">
                    <Feature className="  col-span-4" image="Matches.png" icon={<FaMagic className=" shadow-md p-3 rounded-xl" size={50}></FaMagic>} feature="AI-Powered Profile Matching" desc="No more endless searching. Our smart AI scans profiles to pair you with developers who truly align with your goals, expertise, and vision."></Feature>
                    <Feature flip className="  col-span-4" image="Explore.png" icon={<FaDatabase className=" shadow-md p-3 rounded-xl" size={50}></FaDatabase>} feature="Comprehensive Profile Database" desc="Explore a curated database of skilled professionals ready to collaborate. Tailored filters ensure you see only the most relevant matches."></Feature>
                    <Feature className="  col-span-5" image="Video.png" icon={<FaVideo className="shadow-md p-3 rounded-xl" size={50}/>} feature="Video Chat for Instant Collaboration" desc="Break the ice face-to-face. Connect in live video sessions and bond over shared passions using AI"></Feature>
                    <Feature flip className="  col-span-3" image="Message.png" icon={<FaMessage className="shadow-md p-3 rounded-xl" size={50}/>} feature="Real-Time Messaging" desc="Start conversations instantly. Build connections faster with real-time direct messaging."></Feature>
                    
                </div>

            </div>
        </div>
    )
}