"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { Users, LayoutGrid, Zap, Shield, Crown, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import RetroGrid from "@/components/magicui/retro-grid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import confetti from "canvas-confetti";

const COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
];

export default function Home() {
  const { grid, players, connected, claimBlock, join, socketId } = useSocket();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [isJoined, setIsJoined] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      join(name, selectedColor);
      setIsJoined(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [selectedColor, "#ffffff"],
      });
    }
  };

  if (!mounted) return null;

  const playerCount = Object.keys(players).length;
  const blocksClaimed = Object.values(grid).filter(b => b.ownerId).length;
  const myBlocks = Object.values(grid).filter(b => b.ownerId === socketId).length;

  return (
    <main className="app-container font-sans selection:bg-primary/30">
      <RetroGrid className="opacity-20" />

      <AnimatePresence>
        {!isJoined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white">Join the Conquest</h2>
                  <p className="text-muted-foreground">Choose your identity and claim your territory.</p>
                </div>

                <form onSubmit={handleJoin} className="w-full space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-zinc-400">Commander Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name..."
                      className="bg-black/50 border-white/10 text-white h-12"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-3 text-left">
                    <label className="text-sm font-medium text-zinc-400">Battle Color</label>
                    <div className="flex flex-wrap justify-center gap-3">
                      {COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                            selectedColor === color.value ? "border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent"
                          )}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-bold">
                    Deploy to Grid
                  </Button>
                </form>
              </div>
          
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Grid Wars</h1>
        </div>

        <div className="flex items-center gap-6">
          <StatItem label="Players" value={playerCount} icon={<Users size={14} />} />
          <StatItem label="Territory" value={`${blocksClaimed}/400`} icon={<Crown size={14} />} />
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ring-1",
            connected ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-red-500/10 text-red-400 ring-red-500/20"
          )}>
            <Zap size={10} fill="currentColor" />
            {connected ? "LIVE" : "OFFLINE"}
          </div>
        </div>
      </header>

      <div className="grid-container">
        <motion.div
          className="relative group grid-board"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
         
          {Object.values(grid).map((block) => (
            <motion.div
              key={block.id}
              className="cell"
              style={{
                backgroundColor: block.color || 'rgba(255,255,255,0.03)',
                boxShadow: block.color ? `0 0 20px ${block.color}66` : 'none',
                borderColor: block.color ? `${block.color}88` : 'transparent'
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => claimBlock(block.id)}
            />
          ))}
        </motion.div>
      </div>

      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
              <MousePointer2 className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Commander</p>
              <p className="text-sm font-bold text-white">{name || "Awaiting Orders"}</p>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10" style={{ backgroundColor: `${selectedColor}22` }}>
              <Shield className="w-4 h-4" style={{ color: selectedColor }} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Blocks captured</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white">{myBlocks}</span>
                <span className="text-[10px] text-zinc-500">units</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ label, value, icon }: { label: string, value: any, icon: any }) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  )
}