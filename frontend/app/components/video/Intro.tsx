import { FaVideo } from "react-icons/fa";

export default function Intro({joinRoom}:{joinRoom:CallableFunction}){
    return(
        <main className="p-24 flex justify-center items-center w-full h-screen text-secondary">
            <div className="flex flex-col gap-1">
                <h1 className=" text-4xl font-bold flex items-center gap-4"><FaVideo size={40}></FaVideo>Enter Session</h1>
                <h1 className=" text-md text-secondary text-opacity-50">Welcome,  Ready to meet your technical match?</h1>
                <button onClick={()=>joinRoom()} className="bg-secondary mt-6 shadow-md rounded-xl text-white p-4 hover:bg-opacity-70">Join Session</button>
            </div>

        </main>
    )
}