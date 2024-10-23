export default function SimilarStep({header,desc}:{header:string,desc:string}){
    return(
        <div className=" p-4 py-2 rounded-xl gap-2 border-r-2 border-black border-opacity-15">
            <h3 className="font-bold text-lg">{header}</h3>
            <p className="text-black text-opacity-50 text-sm ">{desc}</p>
        </div>
    )
}