export default function BannerSides({header, items}:{header:string, items: string[]}){
    return(
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white">
            <h1 className="font-bold">{header}</h1>
            <div className="flex flex-col gap-2 ml-2">
                {items.map((item)=>{
                    return(
                        <h1>{item}</h1>
                    )
                })}
            </div>
        </div>
    )
}