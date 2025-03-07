import Link from "next/link";

export default function CTA(){
    return(
        <div className="p-32 py-24 max-md:p-4 max-md:py-12 font-fold items-center flex justify-center self-center text-complementary shadow-md bg-secondary w-full">
            <div className=" text-complementary justify-center items-center text-center max-md:w-full w-[70%] gap-8 flex flex-col bg-secondary">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl max-md:text-3xl font-bold">Don’t Wait—Your Match is One Click Away
                    </h1>
                    <p className=" text-slate-200">Start your journey today and bring your ideas to life.</p>

                </div>
                <Link href="/platform/dashboard" className=" bg-complementary w-fit font-semibold text-primary shadow-md p-3 rounded-xl px-12">Find Now</Link>
            </div>
        </div>
    )
}