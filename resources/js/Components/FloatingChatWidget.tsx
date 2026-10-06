import React, { useState, useRef, useEffect } from 'react';
import { Bot, X } from "lucide-react";
import AIChat from "./AIChat";

export default function FloatingChatWidget() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // Position state: 'right' or 'left'
    const [side, setSide] = useState<'right' | 'left'>('right');
    
    // Dragging state for visual feedback
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    const dragStartRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        hasDraggedRef.current = false;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasDraggedRef.current = true;
            }
            
            setDragOffset({ x: dx, y: dy });
        };
        
        const handleMouseUp = (e: MouseEvent) => {
            if (isDragging) {
                setIsDragging(false);
                
                // Snap to left or right based on final cursor position
                if (hasDraggedRef.current) {
                    if (e.clientX < window.innerWidth / 2) {
                        setSide('left');
                    } else {
                        setSide('right');
                    }
                }
                
                // Reset visual drag offset since it snapped
                setDragOffset({ x: 0, y: 0 });
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleToggle = () => {
        // Prevent toggle if the user just finished dragging
        if (!hasDraggedRef.current) {
            setIsChatOpen(!isChatOpen);
        }
    };

    return (
        <div 
            style={{ 
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
            className={`fixed bottom-6 z-[100] flex flex-col ${side === 'right' ? 'right-6 items-end' : 'left-6 items-start'}`}
        >
            {isChatOpen && (
                <div className={`mb-4 shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in ${side === 'right' ? 'slide-in-from-bottom-5' : 'slide-in-from-bottom-5'}`}>
                    <AIChat onDragStart={handleMouseDown} isDragging={isDragging} />
                </div>
            )}
            <button
                onMouseDown={handleMouseDown}
                onClick={handleToggle}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
                    isChatOpen 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white rotate-90' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                title="Tanya AI (Drag untuk memindah)"
            >
                {isChatOpen ? <X className="w-7 h-7 pointer-events-none" /> : <Bot className="w-7 h-7 pointer-events-none" />}
            </button>
        </div>
    );
}
