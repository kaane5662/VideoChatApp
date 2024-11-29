export default function Intro({joinRoom}:{joinRoom:CallableFunction}){
    return(
        <main className="p-24 flex justify-center items-center">
            <div className="flex flex-col gap-2 mt-24">
                <h1 className=" text-4xl font-bold">Enter Session</h1>
                <h1 className=" text-md text-secondary text-opacity-50">Welcome,  Ready to meet your technical match?</h1>
                <button onClick={()=>joinRoom()} className="bg-secondary mt-4 text-white p-4 rounded-sm shadow-md hover:bg-opacity-70">Join Session</button>
            </div>

        </main>
    )
}