export default function Feature({icon,feature,desc, image, flip}:{icon:any,feature:string,desc:string,image:string,flip?:boolean}){
    return(
        <div className ={`w-full shadow-md h-full border-2 bg-white gap-8 flex flex-col ${flip && "flex-col-reverse"}`}>
            <img className=" w-full h-fit border-b-2" src={image}></img>
            <div className="flex flex-col gap-4 p-6">
                <h3 className="text-2xl font-bold ">{feature}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>

            </div>
        </div>
    )
}