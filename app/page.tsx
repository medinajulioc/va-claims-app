"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageSquare, FileText, Scale, Check, Book, FileCheck, Users, Star, Award, Shield, BadgeCheck, Medal, TrendingUp, Menu, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [chatMessages, setChatMessages] = useState([
    { role: "user", content: "What evidence do I need for my claim?" },
    { role: "assistant", content: "For most VA disability claims, you'll need medical documentation of your condition, service records connecting the condition to your military service, and in some cases, buddy statements or expert opinions. Sign up to get personalized guidance for your specific situation." },
    { role: "user", content: "How long does the claims process take?" },
    { role: "assistant", content: "VA claims typically take 3-6 months, but can vary based on complexity. Our system helps optimize your submission to avoid common delays. Create an account to learn more about expediting your specific claim." }
  ]);

  const [isAnnual, setIsAnnual] = useState(false);
  const monthlyPrice = 29.99;
  const annualPrice = 299.99;
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const savings = (((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100).toFixed(0);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    "Full access to VA claims research tools",
    "Personalized claim strategy development",
    "Document preparation and review",
    "C&P exam preparation guidance",
    "Unlimited AI claims assistant chat",
    "Expert veteran support"
  ];

  const faqs = [
    {
      question: "How does VAClaims help with my disability claim?",
      answer: "VAClaims provides comprehensive research tools, document preparation assistance, and expert guidance to strengthen your VA disability claim. Our AI-powered platform analyzes thousands of successful claims and relevant case law to help build the strongest possible case for your specific situation."
    },
    {
      question: "Is my information secure on your platform?",
      answer: "Yes, we take security very seriously. All your personal and medical information is encrypted and protected according to military-grade security standards. We are fully compliant with all relevant privacy regulations and never share your information with third parties without your explicit consent."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to the platform until the end of your current billing period."
    },
    {
      question: "Do you offer discounts for veterans with financial hardships?",
      answer: "We believe all veterans deserve access to quality claims assistance. If you're experiencing financial hardship, please contact our support team to learn about our assistance programs. We offer discounted rates and, in some cases, free access to veterans in need."
    }
  ];

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2] relative">
      {/* Sticky Navigation Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#7b664a] shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white">VAClaims</h2>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-[#f0d78c] transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            
            <div className="hidden md:block">
              <Button 
                size="sm" 
                className={`bg-[#958a68] hover:bg-[#77775f] text-white ${isScrolled ? 'shadow-md' : ''}`}
              >
                Sign Up
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#7b664a] shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-[#f0d78c] transition-colors text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <Button 
                  size="sm" 
                  className="bg-[#958a68] hover:bg-[#77775f] text-white w-full mt-2"
                >
                  Sign Up
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section with MultiCam color palette */}
      <header className="relative bg-[#7b664a] text-white pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24" id="home">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left content */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#958b60] text-sm font-medium tracking-wide uppercase border border-[#9d9b80] shadow-sm">
                FOR U.S. MILITARY VETERANS
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Secure the benefits <span className="text-[#f0d78c]">you've earned</span> serving our country
              </h1>
              <p className="text-lg md:text-xl text-[#f7f6f2] max-w-xl">
                VAClaims helps veterans navigate the complex VA disability claims process with AI-powered research, filing assistance, and expert guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#958a68] hover:bg-[#77775f] text-white font-medium shadow-md transition-all">
                  Start Your Claim Today <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="border-[#9d9b80] bg-[#7b664a]/10 text-white hover:bg-[#7b664a]/20 shadow-md transition-all">
                  Learn More
                </Button>
              </div>
              
              {/* Mobile Hero Benefits (visible only on smaller screens) */}
              <div className="mt-6 md:hidden">
                <p className="text-[#f0d78c] font-medium mb-3">Why Veterans Choose Us:</p>
                <ul className="space-y-2 text-[#f7f6f2]">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-[#f0d78c]" />
                    <span>94% success rate with VA claims</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-[#f0d78c]" />
                    <span>Average 30% increase in benefits</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-[#f0d78c]" />
                    <span>Veteran-owned and operated</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chat Demo */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#9d9b80]/20">
                <div className="bg-[#77775f] text-white p-5 flex items-center border-b border-[#77775f]/80">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  <span className="font-semibold text-lg">VAClaims Assistant</span>
                </div>
                <div className="h-[420px] md:h-[450px] lg:h-[480px] p-6 overflow-y-auto flex flex-col space-y-6 bg-[#f7f6f2]">
                  {chatMessages.map((message, i) => (
                    <div 
                      key={i} 
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.role === "user" 
                            ? "bg-[#77775f] text-white rounded-br-none shadow-md" 
                            : "bg-white text-[#3a3a3a] border border-[#9d9b80]/30 rounded-bl-none shadow-md"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-5 border-t border-[#9d9b80]/20 bg-white">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask about your VA claim..." 
                      className="w-full p-3 pl-5 pr-28 border border-[#9d9b80]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#958b60] bg-[#f7f6f2] text-[#3a3a3a]"
                      disabled
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-[#7b664a] bg-[#f7f6f2] px-3 py-1 rounded-full border border-[#9d9b80]/30">Sign up to chat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Benefit Badges (visible only on larger screens) */}
        <div className="hidden md:block absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-5xl">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-[#9d9b80]/20 flex items-center">
              <Award className="h-10 w-10 text-[#958b60] mr-4" />
              <div>
                <h4 className="font-bold text-[#7b664a]">94% Success Rate</h4>
                <p className="text-[#77775f] text-sm">With VA disability claims</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border border-[#9d9b80]/20 flex items-center">
              <TrendingUp className="h-10 w-10 text-[#958b60] mr-4" />
              <div>
                <h4 className="font-bold text-[#7b664a]">30% Avg. Increase</h4>
                <p className="text-[#77775f] text-sm">In disability benefits</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border border-[#9d9b80]/20 flex items-center">
              <Badge className="h-10 w-10 text-[#958b60] mr-4" />
              <div>
                <h4 className="font-bold text-[#7b664a]">Veteran-Owned</h4>
                <p className="text-[#77775f] text-sm">By veterans, for veterans</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section with MultiCam palette */}
      <section className="py-24 pt-32 md:pt-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-[#7b664a]">Military-Grade Assistance for Your VA Claims</h2>
            <p className="text-lg text-[#77775f] max-w-2xl mx-auto">
              Our comprehensive platform provides you with the tools and expertise needed to successfully navigate the VA claims process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-[#9d9b80]/20 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-14 h-14 bg-[#f7f6f2] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#7b664a]">Supporting Evidence</h3>
              <p className="text-[#77775f]">
                Access research-backed medical journals and documentation to strengthen your claims with scientific precision.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-[#9d9b80]/20 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-14 h-14 bg-[#f7f6f2] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Book className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#7b664a]">Narrative Creation</h3>
              <p className="text-[#77775f]">
                Develop compelling stories that connect your evidence, legal backing, and service history into a persuasive claim.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-[#9d9b80]/20 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-14 h-14 bg-[#f7f6f2] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Scale className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#7b664a]">Legal Backing</h3>
              <p className="text-[#77775f]">
                Leverage expert knowledge of VA rules and regulations to build solid, legally sound claims that meet all requirements.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border border-[#9d9b80]/20 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-14 h-14 bg-[#f7f6f2] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FileCheck className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#7b664a]">Preparation</h3>
              <p className="text-[#77775f]">
                Comprehensive C&P exam preparation ensures you approach every evaluation with confidence and readiness.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 border border-[#9d9b80]/20 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-14 h-14 bg-[#f7f6f2] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Book className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#7b664a]">Case Law</h3>
              <p className="text-[#77775f]">
                Access relevant legal precedents that hold the VA accountable and strengthen your position throughout the claims process.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 border border-[#9d9b80]/20 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-14 h-14 bg-[#f7f6f2] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Users className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#7b664a]">Veteran Support</h3>
              <p className="text-[#77775f]">
                Connect with veteran experts who guide you through every step of the process with empathy and understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#f7f6f2] border-y border-[#9d9b80]/20" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-[#7b664a]">Trusted by Veterans Nationwide</h2>
            <p className="text-lg text-[#77775f] max-w-2xl mx-auto">
              Hear from fellow veterans who have successfully navigated the VA claims process with our help
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl border border-[#9d9b80]/20 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-[#958b60]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-[#77775f] mb-6">
                "After struggling with my PTSD claim for over two years, VAClaims helped me organize my evidence and craft a compelling narrative. My claim was approved at 70% within 3 months of submission."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#9d9b80] flex items-center justify-center text-white font-bold">
                  JM
                </div>
                <div className="ml-3">
                  <p className="font-medium text-[#7b664a]">James M.</p>
                  <p className="text-sm text-[#9d9b80]">Army Veteran, served 2008-2016</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl border border-[#9d9b80]/20 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-[#958b60]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-[#77775f] mb-6">
                "The C&P exam prep was invaluable. I knew exactly what to expect and how to effectively communicate my conditions. VAClaims' guidance increased my rating from 30% to 80%, completely changing my life."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#9d9b80] flex items-center justify-center text-white font-bold">
                  SD
                </div>
                <div className="ml-3">
                  <p className="font-medium text-[#7b664a]">Sarah D.</p>
                  <p className="text-sm text-[#9d9b80]">Navy Veteran, served 2010-2019</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl border border-[#9d9b80]/20 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-[#958b60]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-[#77775f] mb-6">
                "Filing for back pay seemed impossible until I found VAClaims. Their research tools helped me identify key medical evidence from my service records that I didn't know was relevant. Received 5 years of back pay."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#9d9b80] flex items-center justify-center text-white font-bold">
                  RT
                </div>
                <div className="ml-3">
                  <p className="font-medium text-[#7b664a]">Robert T.</p>
                  <p className="text-sm text-[#9d9b80]">Marine Corps Veteran, served 2005-2013</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#958b60]/10 mb-4">
                <TrendingUp className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="text-3xl font-bold text-[#7b664a] mb-2">94%</h3>
              <p className="text-[#77775f]">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#958b60]/10 mb-4">
                <Users className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="text-3xl font-bold text-[#7b664a] mb-2">10k+</h3>
              <p className="text-[#77775f]">Veterans Helped</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#958b60]/10 mb-4">
                <Award className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="text-3xl font-bold text-[#7b664a] mb-2">$42M+</h3>
              <p className="text-[#77775f]">Back Pay Secured</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#958b60]/10 mb-4">
                <Medal className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="text-3xl font-bold text-[#7b664a] mb-2">4.9/5</h3>
              <p className="text-[#77775f]">Veteran Rating</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <p className="text-[#77775f] text-sm uppercase font-medium tracking-wider">Trusted By</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              <div className="flex items-center text-[#7b664a]">
                <Shield className="h-6 w-6 mr-2" />
                <span className="font-medium">Military Times</span>
              </div>
              <div className="flex items-center text-[#7b664a]">
                <BadgeCheck className="h-6 w-6 mr-2" />
                <span className="font-medium">Veterans Affairs Accredited</span>
              </div>
              <div className="flex items-center text-[#7b664a]">
                <Award className="h-6 w-6 mr-2" />
                <span className="font-medium">Disabled American Veterans</span>
              </div>
              <div className="flex items-center text-[#7b664a]">
                <Medal className="h-6 w-6 mr-2" />
                <span className="font-medium">American Legion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with MultiCam palette */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-[#7b664a]">Choose Your Service Plan</h2>
              <p className="text-lg text-[#77775f] max-w-2xl mx-auto">
                Get the support you need with our veteran-focused claim assistance services
              </p>
            </div>
            
            {/* Add highlight banner above pricing card */}
            <div className="bg-[#958b60]/10 border border-[#958b60]/30 rounded-xl p-4 mb-8 text-center">
              <p className="text-[#7b664a] font-medium">
                <span className="text-[#958b60] font-bold">Special Offer:</span> Use code <span className="font-mono bg-[#f7f6f2] px-2 py-1 rounded text-[#7b664a] font-bold">VETERAN25</span> for 25% off your first 3 months
              </p>
            </div>
            
            <Card className="border-[#9d9b80]/20 shadow-lg">
              <CardContent className="relative p-8">
                <div className="flex flex-col lg:flex-row">
                  {/* Left side: Content */}
                  <div className="lg:w-2/3">
                    <h2 className="mb-2 text-2xl font-bold text-[#7b664a]">Veteran Pro Plan</h2>
                    <p className="text-[#77775f] mb-6">
                      Everything you need for a successful VA disability claim
                    </p>

                    <div className="block space-y-4 lg:hidden">
                      <div>
                        <span className="text-4xl font-bold text-[#7b664a]">${currentPrice}</span>
                        <span className="text-[#77775f] ml-2">
                          /{isAnnual ? "year" : "month"}
                        </span>
                      </div>

                      <div className="mb-6 flex items-start justify-start space-x-4">
                        <span
                          className={`text-sm font-medium ${!isAnnual ? "text-[#7b664a]" : "text-[#77775f]"}`}>
                          Monthly
                        </span>
                        <Switch
                          checked={isAnnual}
                          onCheckedChange={setIsAnnual}
                          className="data-[state=checked]:bg-[#958b60]"
                          aria-label="Toggle annual pricing"
                        />
                        <span
                          className={`text-sm font-medium ${isAnnual ? "text-[#7b664a]" : "text-[#77775f]"}`}>
                          Annual
                        </span>
                      </div>
                    </div>

                    <ul className="mb-6 space-y-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="mr-3 size-5 shrink-0 text-[#958b60]" />
                          <span className="text-[#77775f]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[#9d9b80] text-sm">
                      All subscriptions come with a 30-day money-back guarantee. Cancel anytime.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center space-y-6 md:w-1/3 lg:relative lg:border-s lg:border-[#9d9b80]/20 lg:ps-8">
                    <div className="hidden space-y-4 lg:block">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-[#7b664a]">${currentPrice}</span>
                        <span className="text-[#77775f] ml-2">
                          /{isAnnual ? "year" : "month"}
                        </span>
                      </div>

                      <div className="mb-6 flex items-center justify-center space-x-4">
                        <span
                          className={`text-sm font-medium ${!isAnnual ? "text-[#7b664a]" : "text-[#77775f]"}`}>
                          Monthly
                        </span>
                        <Switch
                          checked={isAnnual}
                          onCheckedChange={setIsAnnual}
                          className="data-[state=checked]:bg-[#958b60]"
                          aria-label="Toggle annual pricing"
                        />
                        <span
                          className={`text-sm font-medium ${isAnnual ? "text-[#7b664a]" : "text-[#77775f]"}`}>
                          Annual
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 lg:mt-0">
                      <Button className="w-full bg-[#958a68] hover:bg-[#77775f] text-white font-medium shadow-md">
                        Start Your Plan
                      </Button>

                      {isAnnual && (
                        <Badge className="absolute end-4 top-2 bg-[#958b60] hover:bg-[#958b60]">
                          Save {savings}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add 30-day guarantee badge */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center px-6 py-3 bg-[#958b60]/10 rounded-full">
                <Shield className="h-5 w-5 text-[#958b60] mr-2" />
                <span className="text-[#7b664a] font-medium">30-Day Money-Back Guarantee</span>
              </div>
            </div>

            <div className="my-12">
              <h2 className="mb-8 text-xl font-semibold text-center text-[#7b664a]">Why Choose VAClaims?</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-[#9d9b80]/20 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#7b664a]">Veteran-Owned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#77775f]">
                      Created by veterans who understand the challenges you face
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-[#9d9b80]/20 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#7b664a]">Expert Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#77775f]">
                      Access to retired VA raters and claims specialists
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-[#9d9b80]/20 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#7b664a]">Proven Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#77775f]">
                      Thousands of veterans have successfully used our platform
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ with ID anchor */}
            <Card className="border-[#9d9b80]/20 shadow-lg" id="faq">
              <CardHeader>
                <CardTitle className="text-[#7b664a]">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-[#9d9b80]/20">
                      <AccordionTrigger className="text-start text-[#7b664a]">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-[#77775f]">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section with MultiCam palette */}
      <section className="py-20 bg-[#77775f] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Secure Your VA Benefits?</h2>
            <p className="text-lg mb-6 text-[#f7f6f2]">
              Join thousands of veterans who have successfully navigated the claims process with VAClaims.
            </p>
            <p className="mb-10 text-[#f0d78c]">
              No credit card required to start your free 7-day trial
            </p>
            <Button size="lg" className="bg-[#958a68] hover:bg-[#77775f] text-white font-medium px-10 py-6 text-lg shadow-md">
              Start Your Claim Today
            </Button>
            <p className="mt-6 text-sm text-[#f7f6f2]/80 max-w-md mx-auto">
              By signing up, you agree to our Terms of Service and Privacy Policy. We're committed to protecting your information.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with MultiCam palette */}
      <footer className="bg-[#3a3a3a] text-gray-400 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">VAClaims</h2>
              <p className="text-[#9d9b80]">Supporting veterans with the benefits they deserve</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <Link href="#" className="text-[#9d9b80] hover:text-white transition-colors">About</Link>
              <Link href="#" className="text-[#9d9b80] hover:text-white transition-colors">Features</Link>
              <Link href="#" className="text-[#9d9b80] hover:text-white transition-colors">Testimonials</Link>
              <Link href="#" className="text-[#9d9b80] hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-[#77775f]/30 mt-10 pt-10 text-sm text-center">
            <p>© {new Date().getFullYear()} VAClaims. All rights reserved.</p>
            <p className="mt-4 flex justify-center gap-6">
              <Link href="#" className="text-[#9d9b80] hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[#9d9b80] hover:text-white transition-colors">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Mobile Sticky CTA - Fixed at the bottom on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#7b664a] p-4 shadow-lg z-40">
        <Button className="w-full bg-[#958a68] hover:bg-[#77775f] text-white font-medium shadow-inner">
          Start Your Claim Today
        </Button>
      </div>
    </div>
  );
} 