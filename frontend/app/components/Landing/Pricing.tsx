import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export default function Pricing(){
    return(
        <main className=" min-h-screen w-full">
            <div className="flex p-32 max-md:p-4 flex-col gap-8">
                <div className="flex flex-col gap-16 p-8 max-md:px-0  rounded-xl relative ">
                        
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="font-bold text-5xl max-md:text-4xl">Choose Plan</h1>
                            <p className="text-lg text-slate-500">Switch to annual pricing to save 30% off</p>
        
                        </div>
                        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
                            <div className="flex flex-col gap-3 bg-white shadow-xl border-2 p-4 rounded-md">
                                <h1 className="text-md">Free</h1>
                                <h1 className="text-xl font-semibold">$0</h1>
                                
                                <div className="flex flex-col gap-1 text-sm">
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle>50 Video credits monthly</h1>
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> Instant Messaging with Matches</h1>
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle>Up to 3 Matches a month</h1>
                                </div>
                                <Link href={"/platform/settings"}  className="hover:opacity-70 text-center duration-300 text-white bg-secondary p-2 mt-auto rounded-xl">Start Now</Link>
                            </div>
                            <div className="flex flex-col gap-3 bg-white shadow-xl border-2 p-4 rounded-md">
                                <h1 className="text-md">Premium</h1>
                                <h1 className="text-xl font-semibold">$5.99 per month</h1>
                                
                                <div className="flex flex-col gap-1 text-sm">
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle>Unlimited Video credits</h1>
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> Cold messaging</h1>
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> No match limit</h1>
                                </div>
                                <Link href={"/platform/settings"}  className="hover:opacity-70 text-center duration-300 text-white bg-secondary p-2 mt-auto rounded-xl">Subscribe</Link>
                            </div>
                            <div className="flex flex-col gap-3 bg-white shadow-xl border-2 p-4 rounded-md">
                                <h1 className="text-md">Premium Yearly</h1>
                                <h1 className="text-xl font-semibold">$50.40 per year</h1>
                                <p className=" text-secondary border-2 bg-slate-100 font-semibold px-3 w-fit text-xs rounded-xl">Save 30%</p>
                                
                                <div className="flex flex-col gap-1 text-sm">
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle>Unlimited Video credits</h1>
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> Cold messaging</h1>
                                <h1 className="flex gap-2 items-center"> <FaCheckCircle className="text-secondary"></FaCheckCircle> No match limit</h1>
                                </div>
                                <Link href={"/platform/settings"} className="hover:opacity-70 text-center duration-300 text-white bg-secondary p-2 mt-auto rounded-xl">Subscribe</Link>
                            </div>
                        </div>
                    </div>
            </div>
        
        </main>
    )
}