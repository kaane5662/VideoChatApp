import PaddedList from "@/app/helpers/PaddedList";
import { IProfile } from "@/app/interfaces";
import { getSimilarProfiles } from "@/app/services/profiles";

export default async function Similar({id}:IProfile){
    const SimilarProfiles:IProfile[] = await getSimilarProfiles(id)
    return(
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Explore</h1>
            <h2 className="text-md">Profiles similar to {id}</h2>
            <div className="grid grid-cols-3 gap-8">

                {SimilarProfiles.map((similarProfile,index)=>{
                    return(
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <img className="w-30 h-30 bg-secondary text-complementary"></img>
                                <h1>{similarProfile.username}</h1>
                                <h3>{similarProfile.industry} | {similarProfile.currentRole}</h3>   
                            </div>
                            <div className="flex flex-col p-4">
                                <label>Avaliablity</label>
                                <h1 className="font-bold text-lg">{similarProfile?.avaliability}</h1>
                                <label>Frameworks</label>
                                <PaddedList items={similarProfile?.frameworks}></PaddedList>
                                <label>Interests</label>
                                <PaddedList items={similarProfile?.developmentInterests}></PaddedList>
                                <label>Languages</label>
                                <PaddedList items={similarProfile?.programmingLanguages}></PaddedList>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}