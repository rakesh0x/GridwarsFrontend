"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GridState, Player, Block } from "@/types";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [grid, setGrid] = useState<GridState>({});
    const [players, setPlayers] = useState<Record<string, Player>>({});
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socketInstance: Socket = io("http://localhost:3001");

        socketInstance.on("connect", () => {
            setConnected(true);
            setSocket(socketInstance);
        });

        socketInstance.on("init", ({ grid, players }: { grid: GridState; players: Record<string, Player> }) => {
            setGrid(grid);
            setPlayers(players);
        });

        socketInstance.on("playerJoined", (player: Player) => {
            setPlayers((prev) => ({ ...prev, [player.id]: player }));
        });

        socketInstance.on("playerLeft", (playerId: string) => {
            setPlayers((prev) => {
                const next = { ...prev };
                delete next[playerId];
                return next;
            });
        });

        socketInstance.on("blockClaimed", ({ blockId, ownerId, color }: { blockId: string; ownerId: string; color: string }) => {
            setGrid((prev) => ({
                ...prev,
                [blockId]: { ...prev[blockId], ownerId, color },
            }));
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const claimBlock = (blockId: string) => {
        socket?.emit("claimBlock", blockId);
    };

    const join = (name: string, color: string) => {
        socket?.emit("join", { name, color });
    };

    return { grid, players, connected, claimBlock, join, socketId: socket?.id };
};
