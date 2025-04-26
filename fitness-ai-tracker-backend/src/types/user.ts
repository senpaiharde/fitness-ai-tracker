export type EnhancementLog = {
    id: number; 
    date: number;
    compound: string;
    dose: number;
    time: string;
    goal?: string;
  };

export type User = {
  name: string;
  id: string;
  email: string;
  password: string;
  profile: {
    id : string,
    age?: number;
    weight?: number;
    height?: number;
    isEnchaned?: boolean;
    CreatedAt?: number;
    enchancementLog: EnhancementLog[]; 
  };
};

