export default function CTA(){
    return(
        <div className="p-32 py-24 font-fold items-center flex justify-center self-center text-complementary shadow-md bg-secondary w-full">
            <div className=" text-complementary justify-center items-center text-center w-[70%] gap-8 flex flex-col bg-secondary">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">Don’t Wait—Your Match is One Click Away
                    </h1>
                    <p className=" text-slate-200">Click below to find your technical match today and turn your ideas into action.</p>

                </div>
                <button className=" bg-complementary w-fit font-semibold text-secondary shadow-md p-3 rounded-xl px-12">Find Now</button>
            </div>
        </div>
    )
}