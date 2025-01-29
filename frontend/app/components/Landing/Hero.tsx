export default function Hero(){
    return(
        <div className="flex flex-col p-24 items-center justify-center w-full gap-16 min-h-screen">
            <div className="w-[60%] items-center text-center flex flex-col gap-8">
                <h1 className="text-6xl font-bold">Find Your Technical Match</h1>
                <p className="text-xl w-[70%] text-slate-600">Turn your vision into reality by finding your ideal technical co-founder or partner through our AI-powered platform.</p>
                <button className="bg-secondary w-fit px-8 shadow-md text-complementary p-4 rounded-xl">Find Now</button>
            </div>
            <img className=" w-[80%] h-full shadow-xl" src="Dashboard.png"></img>
        </div>
    )
}