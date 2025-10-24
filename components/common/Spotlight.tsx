'use client'

import React, { useRef, useState, useEffect } from 'react'
import useMousePosition from '@/lib/utils/useMousePosition'
import throttle from 'lodash.throttle'

type SpotlightProps = {
  children: React.ReactNode
  className?: string
}

export default function Spotlight({
  children,
  className = '',
}: SpotlightProps) {

  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()

  useEffect(() => {
    const updateMousePosition = throttle(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = mousePosition.x - rect.left
        const y = mousePosition.y - rect.top
        containerRef.current.style.setProperty('--mouse-x', `${x}px`)
        containerRef.current.style.setProperty('--mouse-y', `${y}px`)
      }
    }, 100); // Adjust the throttle delay as needed

    updateMousePosition();
  }, [mousePosition]);

  return (
    <div className={`spotlight-container transition-all duration-300 ${className}`} ref={containerRef}>
      {children}
    </div>
  )
}

type SpotlightCardProps = {
  children: React.ReactNode,
  className?: string,
  outerClassName?: string
}

export function SpotlightCard({
  children,
  className = '',
  outerClassName = ''
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div 
      ref={cardRef}
      className={`relative bg-slate-200/50 dark:bg-slate-950/50 rounded-3xl p-px 
        group backdrop-blur-md

        before:absolute 
        before:w-80 before:h-80 before:-left-40 before:-top-40 before:bg-slate-100 dark:before:bg-slate-100 
        before:rounded-full before:opacity-20 before:pointer-events-none 
        before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] 
        before:translate-y-[var(--mouse-y)] before:group-hover:opacity-20 before:z-10 
        before:blur-[100px] overflow-hidden
        
        after:absolute after:w-96 after:h-96 after:-left-48 
        after:-top-48 after:dark:bg-violet-500 after:bg-violet-100 
        after:rounded-full after:opacity-20 
        after:pointer-events-none after:transition-opacity after:duration-500 
        after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] 
        after:group-hover:opacity-20 
        after:dark:group-hover:opacity-10 after:z-30 after:blur-[100px] 
        ${outerClassName}`}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      } as React.CSSProperties}
    >
      <div className={`relative h-full bg-slate-100/10 
        hover:bg-slate-100/60 dark:bg-slate-950/50 hover:dark:bg-slate-950/75 
        rounded-[inherit] transition-all duration-300 z-20 ${className}`}>
        
        {children}
      </div>
    </div>
  )
}
