import Typewriter from "./Typewriter";
import NodeChain from './NodeChain'


export default function Hero() {
    return (
        <section className="min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] flex flex-col lg:flex-row items-center px-6 lg:px-16 py-12 lg:py-0 bg-background">
            <div className="flex-1 flex flex-col justify-center">
                <h1 className="font-mono font-bold text-2xl lg:text-3xl leading-tight mb-6">
                    <span className="text-white block">&gt; Data Structure,</span>
                    <span className="text-primary block"><Typewriter /></span>
                </h1>

                <p className="text-muted text-base lg:text-lg max-w-md">Learn the code. Understand the history. Question the design.</p>
            </div>
            <div className="flex-1 flex items-center justify-center mt-8 lg:mt-0">
                <NodeChain />
            </div>
        </section>
    )
}