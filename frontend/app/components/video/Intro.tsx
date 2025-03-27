import { FaVideo } from "react-icons/fa";
import { Switch } from "../ui/switch";

export default function Intro({joinRoom, preference,setPreferences}:
    {joinRoom:CallableFunction,preference:boolean,setPreferences:CallableFunction}
){
    return(
        <main className="p-24 flex justify-center items-center w-full h-screen ">
            <div className="flex flex-col gap-1">
                <h1 className=" text-4xl font-bold flex items-center gap-4"><FaVideo size={40}></FaVideo>Enter Session</h1>
                <h1 className=" text-md text-slate-500">Welcome,  Ready to meet your technical match?</h1>
                <div className="flex gap-2 mt-4 items-center">
                    <Switch onCheckedChange={()=>setPreferences(!preference)} checked={preference}/>
                    <p className="text-sm">Use Preferences</p>
                    <label className="text-sm text-secondary">Pre-Alpha</label>
                </div>
                <button onClick={()=>joinRoom()} className="bg-secondary mt-6 shadow-md rounded-xl text-white p-4 hover:bg-opacity-70 active:scale-95 duration-300">Join Session</button>
            </div>

        </main>
    )
}