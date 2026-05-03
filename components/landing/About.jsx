export default function About() {
    return (
        <div className="flex flex-col items-center text-center bg-background px-6 lg:px-16 py-16 lg:py-32 border-t border-[#2A2A2A] min-h-screen">
            <div className="flex-1 items-center max-w-2xl mx-auto">
                <h2 className="font-mono text-4xl font-bold text-white mb-6">About Structura</h2>
                <p className="text-muted text-lg  mb-4">Structura was built because too many students hear "linked list" in a lecture and nod along without ever seeing what's actually happening. This project exists to close that gap — through animation, interaction, and a critical lens that asks who built these tools and why.</p>
                <p className="text-muted text-lg mb-8">But Structura also asks the questions textbooks skip: Who designed these structures? For what kind of data? Whose problems were they built to solve? Every structure has a history — and understanding that history makes you a better thinker, not just a better coder.</p>
                <a className="bg-primary text-black font-mono px-8 py-3 rounded-md font-bold" href="#structures">Start Exploring →</a>
            </div>
        </div>
    )
}