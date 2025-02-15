import { HttpStatusCode } from "axios"


export interface IProfile {
    firstName: string,
    lastName: string,
    industry: string,
    currentRole: string,
    frameworks: string[],
    description: string,
    programmingLanguages: string[],
    developmentInterests: string[],
    avaliability: string,
    id:number,
    identityUserId: string,
    similarityScore: number | null,
    matches: number,
    sessions: number,
    githubUrl: string,
    linkedInUrl: string,
    portfolioUrl: string,
    twitterUrl: string,
}

export interface IProfileSearch {
    industry: string,
    currentRole: string,
    programmingLanguages: string[],
    avaliability: string,
}

export interface IServiceResponse {
    response: IProfile | string | number,
    staus: HttpStatusCode
}

export interface IVideoChat {
    message: string,
    isSender: boolean
}

export interface IDirectMessage{
    
    roomId:number,
    recentText:string,
    recentCreatedAt:string,
    profileName:string,
    profileIndustry: string,
    profileId: number
}

export interface IMessage{
    text:string,
    createdAt:string,
    firstName:string,
    fromProfileId:number,
    id:number
}
export interface IUser{
    email:string,
    stripeCustomerId?:string,
    subscribed:Boolean,
    annualPlan:Boolean,
    id:string
}