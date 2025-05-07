import Link from "next/link";
import { Command, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="flex h-14 items-center px-4 lg:px-6 border-b border-zinc-800 bg-black">
        <Link className="flex items-center justify-center" href="/">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white">VA</span>
          <span className="ml-2 text-lg font-semibold text-white">Claims Research Assistant</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <Link href="#features">Features</Link>
          </Button>
          <Button asChild variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <Link href="/dashboard">Sign in</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16 border-b border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_600px] xl:grid-cols-[1fr_700px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                    VA Claims Research Assistant
                  </h1>
                  <p className="max-w-[600px] text-zinc-400 text-lg md:text-xl">
                    Our AI research assistant helps veterans navigate the complex VA disability claims process with personalized guidance and expert knowledge.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <p className="text-white">Get personalized guidance for your specific situation</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <p className="text-white">Access up-to-date information on VA regulations and processes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <p className="text-white">Find relevant forms and supporting documentation requirements</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                      <Link href="/dashboard" className="flex items-center">
                        Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800">
                      <Link href="#pricing">
                        View Pricing
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[550px] md:h-[600px] rounded-xl border border-zinc-800 overflow-hidden">
                  <LandingChatDemo />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-16 lg:py-20 border-b border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
              <p className="text-zinc-400 max-w-[800px] mx-auto">Choose the plan that works best for your VA claims journey</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:max-w-[1200px] mx-auto">
              {/* Free Plan */}
              <div className="flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">Free</h3>
                  <p className="text-zinc-400 mt-1">Get started with basic assistance</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-zinc-400">/month</span>
                </div>
                <ul className="mb-6 space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">5 AI research queries per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Basic claim information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Access to public resources</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
              
              {/* Veteran Plan */}
              <div className="flex flex-col p-6 bg-zinc-900 border border-blue-600 rounded-xl relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">Veteran</h3>
                  <p className="text-zinc-400 mt-1">Comprehensive claims support</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">$9.99</span>
                  <span className="text-zinc-400">/month</span>
                </div>
                <ul className="mb-6 space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Unlimited AI research queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Personalized claim guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Document templates and examples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Claim status tracking</span>
                  </li>
                </ul>
                <Button asChild className="mt-auto bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard">Start 7-Day Free Trial</Link>
                </Button>
              </div>
              
              {/* Premium Plan */}
              <div className="flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">Premium</h3>
                  <p className="text-zinc-400 mt-1">Maximum support for complex claims</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">$19.99</span>
                  <span className="text-zinc-400">/month</span>
                </div>
                <ul className="mb-6 space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">All Veteran plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Priority support from VA specialists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Advanced claim strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">Expert appeal guidance</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href="/dashboard">Start 7-Day Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t border-zinc-800 px-4 md:px-6">
        <p className="text-xs text-zinc-500">© 2023 VA Claims Research. Not affiliated with the U.S. Department of Veterans Affairs.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-zinc-500" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-zinc-500" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function LandingChatDemo() {
  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs">
            VA
          </div>
          <span className="text-sm text-zinc-300">VA Claims Assistant</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* VA Message 1 */}
        <div className="flex items-start gap-4 max-w-[90%]">
          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-zinc-800 text-white text-xs">
            VA
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 text-sm text-zinc-300">
            <p className="text-white mb-2">Welcome! I'm your VA claims research assistant. How can I help with your disability claim today?</p>
          </div>
        </div>
        
        {/* User Message 1 */}
        <div className="flex items-start gap-4 max-w-[90%] ml-auto">
          <div className="bg-blue-600 rounded-xl p-4 text-sm text-white">
            <p>I need help filing a VA disability claim for PTSD from my service in Afghanistan.</p>
          </div>
          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-zinc-800 text-white text-xs">
            You
          </div>
        </div>
        
        {/* VA Message 2 */}
        <div className="flex items-start gap-4 max-w-[90%]">
          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-zinc-800 text-white text-xs">
            VA
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 text-sm text-zinc-300">
            <p className="text-white mb-2">I'll help you with your PTSD claim. To file a successful VA disability claim for PTSD from your Afghanistan service, you'll need:</p>
            <ol className="list-decimal list-inside space-y-2 pl-1">
              <li><strong className="text-white">Current diagnosis</strong> - A medical professional must diagnose you with PTSD</li>
              <li><strong className="text-white">In-service stressor</strong> - Documentation of the traumatic event during service</li>
              <li><strong className="text-white">Nexus letter</strong> - Medical opinion connecting your PTSD to military service</li>
            </ol>
            <p className="mt-3">For combat-related PTSD claims, the VA has a streamlined process. Would you like details on starting your claim or gathering evidence?</p>
          </div>
        </div>
        
        {/* User Message 2 */}
        <div className="flex items-start gap-4 max-w-[90%] ml-auto">
          <div className="bg-blue-600 rounded-xl p-4 text-sm text-white">
            <p>What evidence do I need for a strong PTSD claim?</p>
          </div>
          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-zinc-800 text-white text-xs">
            You
          </div>
        </div>
        
        {/* VA Message 3 - Typing indicator */}
        <div className="flex items-start gap-4 max-w-[90%]">
          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-zinc-800 text-white text-xs">
            VA
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 text-zinc-400 text-sm">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "100ms" }}></div>
              <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none z-10 h-40 -mt-40"></div>
      </div>
      
      <div className="p-4 border-t border-zinc-800 bg-black">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Type a message..." 
            disabled
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm focus:ring-blue-600 focus:border-blue-600 pr-32"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-xs"
              size="sm"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
        <p className="text-zinc-500 text-xs mt-2 text-center">Subscribe to continue this conversation and get unlimited assistance</p>
      </div>
    </div>
  );
}
