import Typewriter from "./Typewriter";

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-row items-center px-16 bg-background">
            <div className=" flex-1 flex flex-col justify-center">
                <h1 className="font-mono font-bold text-6xl leading-tight mb-6">
                    <span className="text-white block">&gt; Data Structure,</span>
                    <span className="text-primary block"><Typewriter /></span>
                </h1>

                <p className="text-muted text-lg max-w-md">Learn the code. Understand the history. Question the design.</p>
            </div>
            <div className="flex-1"></div>
        </section>
    )
}