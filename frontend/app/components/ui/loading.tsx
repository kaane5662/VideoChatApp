import { ImSpinner8 } from "react-icons/im";

export default function Loading(){
    return(
        <main className="w-full h-screen justify-center flex items-center">
            <div className="flex gap-4 flex-col items-center text-center">
                <h1 className="text-2xl font-semibold">Loading</h1>
                <ImSpinner8 size={40} className="text-secondary animate-spin"></ImSpinner8>
            </div>
        </main>
    )
}