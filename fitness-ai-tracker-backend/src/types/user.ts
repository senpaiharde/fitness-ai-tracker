export type EnhancementLog = {
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
    
    age?: number;
    weight?: number;
    heught?: number;
    isEnchaned?: boolean;
    CreatedAt?: number;
    enchancementLog: EnhancementLog[]; 
  };
};

