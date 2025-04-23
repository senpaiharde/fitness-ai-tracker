export type user = {
    id: string,
    email : string,
    password: string,
    profile: {
        age?: number,
        weight?: number,
        heught?: number,
        isEnchaned?: boolean,
    }

}