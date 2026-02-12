export interface Block {
    id: string;
    ownerId: string | null;
    color: string | null;
}

export interface Player {
    id: string;
    name: string;
    color: string;
}

export type GridState = Record<string, Block>;
