"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Film, Sparkles } from 'lucide-react';

interface HeroProps {
  onAnalyze: (movieId: string) => void;
  isLoading: boolean;
}

/* -----------------------------
IMDb IDs
------------------------------*/

const imdbIds = [
  "tt27497448","tt2560140","tt0499549","tt1630029","tt4154796","tt4154756",
  "tt2771200","tt0903747","tt2820852","tt0944947","tt11198330","tt1375666",
  "tt0816692","tt7286456","tt0369610","tt2788316","tt10872600","tt2488496",
  "tt0848228","tt1190634","tt1345836","tt6105098","tt0120338","tt1745960"
  ];

/* -----------------------------
Poster URLs
------------------------------*/

const posters = imdbIds.map(
(id)=>`https://images.metahub.space/poster/small/${id}/img`
);

/* -----------------------------
Scrolling Row
------------------------------*/

const ScrollingMovieRow = ({
  posters,
  rotations,
  direction="left",
  speed=40,
  top
}:{
  posters:string[]
  rotations:number[]
  direction?:'left'|'right'
  speed?:number
  top:string
})=>{

const doubled=[...posters,...posters]

return(
<div
className="absolute flex gap-4"
style={{
top,
animation:`scroll-${direction} ${speed}s linear infinite`
}}
>

{doubled.map((poster,index)=>(
<div
key={index}
className="relative flex-shrink-0 rounded-lg overflow-hidden"
style={{
width:140,
height:210,
transform:`rotate(${rotations[index%rotations.length]}deg)`
}}
>

<div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] border border-white/10 z-10"/>

<img
src={poster}
alt=""
className="w-full h-full object-cover"
loading="eager"
style={{filter:'brightness(0.7) contrast(1.1)'}}
/>

</div>
))}

</div>
)
}

/* -----------------------------
Background
------------------------------*/

const MovieBackground=()=>{

const [row1,setRow1]=useState<string[]>([])
const [row2,setRow2]=useState<string[]>([])
const [row3,setRow3]=useState<string[]>([])
const [rot,setRot]=useState<number[]>([])

useEffect(()=>{

const shuffled=[...posters].sort(()=>Math.random()-0.5)

setRow1(shuffled.slice(0,8))
setRow2(shuffled.slice(8,16))
setRow3(shuffled.slice(16,24))

setRot(Array.from({length:8},()=>Math.random()*6-3))

},[])

return(

<div className="absolute inset-0 overflow-hidden">

<div
className="absolute inset-0 z-20"
style={{
background:`radial-gradient(ellipse at 50% 50%, rgba(18,18,18,0.7) 0%, rgba(18,18,18,0.85) 50%, rgba(18,18,18,0.95) 100%)`
}}
/>

<div className="absolute inset-0 z-10">

<ScrollingMovieRow posters={row1} rotations={rot} direction="left" speed={50} top="5%"/>

<ScrollingMovieRow posters={row2} rotations={rot} direction="right" speed={45} top="38%"/>

<ScrollingMovieRow posters={row3} rotations={rot} direction="left" speed={55} top="72%"/>

</div>

<div
className="absolute top-0 left-0 h-full w-40 z-30 pointer-events-none"
style={{
background:'linear-gradient(to right, rgba(18,18,18,1), rgba(18,18,18,0))'
}}
/>

<div
className="absolute top-0 right-0 h-full w-40 z-30 pointer-events-none"
style={{
background:'linear-gradient(to left, rgba(18,18,18,1), rgba(18,18,18,0))'
}}
/>

<div
className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
style={{
background:'radial-gradient(circle, rgba(245,197,24,0.05) 0%, transparent 50%)'
}}
/>

</div>

)
}

/* -----------------------------
Hero
------------------------------*/

export default function Hero({ onAnalyze, isLoading }: HeroProps) {

const [movieId,setMovieId]=useState('')
const [isVisible,setIsVisible]=useState(false)

useEffect(()=>{
setIsVisible(true)
},[])

const handleSubmit=(e:React.FormEvent)=>{
e.preventDefault()
if(movieId.trim()){
onAnalyze(movieId.trim())
}
}

return(

<section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">

<style>{`
@keyframes scroll-left{
0%{transform:translateX(0)}
100%{transform:translateX(-50%)}
}

@keyframes scroll-right{
0%{transform:translateX(-50%)}
100%{transform:translateX(0)}
}
`}</style>

<MovieBackground/>

<div className="relative z-30 w-full max-w-2xl mx-auto text-center">

{/* your original hero UI remains exactly same */}

<div
className={`flex justify-center mb-8 transition-all duration-700 ${
isVisible ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'
}`}
style={{transitionDelay:'200ms'}}
>
<div className="relative">
<div className="absolute inset-0 bg-imdb-yellow/30 blur-2xl rounded-full animate-pulse"/>
<div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-imdb-yellow to-imdb-gold flex items-center justify-center shadow-[0_0_40px_rgba(245,197,24,0.4)]">
<Film className="w-10 h-10 text-imdb-darker"/>
</div>
</div>
</div>

<h1
className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 transition-all duration-700 ${
isVisible ? 'opacity-100 translate-y-0':'opacity-0 translate-y-12'
}`}
style={{transitionDelay:'400ms'}}
>
<span className="text-white">AI Movie </span>
<span className="text-gradient-gold relative">
Insight Builder
<Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-imdb-yellow animate-pulse"/>
</span>
</h1>

<p
className={`text-base sm:text-lg text-gray-300 mb-12 max-w-xl mx-auto transition-all duration-700 ${
isVisible ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'
}`}
style={{transitionDelay:'600ms'}}
>
Paste an IMDb movie ID like <span className="text-imdb-yellow font-medium">tt1234567</span>
</p>

<form
onSubmit={handleSubmit}
className="bg-imdb-gray/90 backdrop-blur-xl border border-imdb-lightgray/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
>

<Input
value={movieId}
onChange={(e)=>setMovieId(e.target.value)}
placeholder="tt1234567"
disabled={isLoading}
/>

<Button
type="submit"
disabled={isLoading||!movieId.trim()}
className="w-full mt-4"
>
{isLoading?(
<>
<Loader2 className="w-5 h-5 animate-spin"/>
Analyzing...
</>
):(
<>
<Sparkles className="w-5 h-5"/>
Analyze Movie
</>
)}
</Button>

</form>

</div>

<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-imdb-darker to-transparent z-30 pointer-events-none"/>

</section>

)
}