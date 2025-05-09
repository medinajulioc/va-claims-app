"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MessageSquare,
  FileText,
  Scale,
  Check,
  Book,
  FileCheck,
  Users,
  Star,
  Award,
  Shield,
  BadgeCheck,
  Medal,
  TrendingUp,
  Menu,
  X
} from "lucide-react";
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
    {
      role: "assistant",
      content:
        "For most VA disability claims, you'll need medical documentation of your condition, service records connecting the condition to your military service, and in some cases, buddy statements or expert opinions. Sign up to get personalized guidance for your specific situation."
    },
    { role: "user", content: "How long does the claims process take?" },
    {
      role: "assistant",
      content:
        "VA claims typically take 3-6 months, but can vary based on complexity. Our system helps optimize your submission to avoid common delays. Create an account to learn more about expediting your specific claim."
    }
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      answer:
        "VAClaims provides comprehensive research tools, document preparation assistance, and expert guidance to strengthen your VA disability claim. Our AI-powered platform analyzes thousands of successful claims and relevant case law to help build the strongest possible case for your specific situation."
    },
    {
      question: "Is my information secure on your platform?",
      answer:
        "Yes, we take security very seriously. All your personal and medical information is encrypted and protected according to military-grade security standards. We are fully compliant with all relevant privacy regulations and never share your information with third parties without your explicit consent."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to the platform until the end of your current billing period."
    },
    {
      question: "Do you offer discounts for veterans with financial hardships?",
      answer:
        "We believe all veterans deserve access to quality claims assistance. If you're experiencing financial hardship, please contact our support team to learn about our assistance programs. We offer discounted rates and, in some cases, free access to veterans in need."
    }
  ];

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" }
  ];

  return (
    <div className="relative min-h-screen bg-[#f7f6f2]">
      {/* Sticky Navigation Header */}
      <div
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#7b664a] py-3 shadow-md" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white">VAClaims</h2>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden space-x-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-white transition-colors hover:text-[#f0d78c]">
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <Button
                size="sm"
                className={`bg-[#958a68] text-white hover:bg-[#77775f] ${isScrolled ? "shadow-md" : ""}`}>
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 bg-[#7b664a] shadow-lg md:hidden">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-white transition-colors hover:text-[#f0d78c]"
                    onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                  </a>
                ))}
                <Button
                  size="sm"
                  className="mt-2 w-full bg-[#958a68] text-white hover:bg-[#77775f]">
                  Sign Up
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section with MultiCam color palette */}
      <header
        className="relative bg-[#7b664a] pt-32 pb-16 text-white md:pt-36 md:pb-20 lg:pt-40 lg:pb-24"
        id="home">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left content */}
            <div className="space-y-8 lg:col-span-5">
              <div className="inline-block rounded-full border border-[#9d9b80] bg-[#958b60] px-4 py-1.5 text-sm font-medium tracking-wide uppercase shadow-sm">
                FOR U.S. MILITARY VETERANS
              </div>
              <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
                Secure the benefits <span className="text-[#f0d78c]">you've earned</span> serving
                our country
              </h1>
              <p className="max-w-xl text-lg text-[#f7f6f2] md:text-xl">
                VAClaims helps veterans navigate the complex VA disability claims process with
                AI-powered research, filing assistance, and expert guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-[#958a68] font-medium text-white shadow-md transition-all hover:bg-[#77775f]">
                  Start Your Claim Today <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#9d9b80] bg-[#7b664a]/10 text-white shadow-md transition-all hover:bg-[#7b664a]/20">
                  Learn More
                </Button>
              </div>

              {/* Mobile Hero Benefits (visible only on smaller screens) */}
              <div className="mt-6 md:hidden">
                <p className="mb-3 font-medium text-[#f0d78c]">Why Veterans Choose Us:</p>
                <ul className="space-y-2 text-[#f7f6f2]">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#f0d78c]" />
                    <span>94% success rate with VA claims</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#f0d78c]" />
                    <span>Average 30% increase in benefits</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#f0d78c]" />
                    <span>Veteran-owned and operated</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chat Demo */}
            <div className="w-full lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-[#9d9b80]/20 bg-white shadow-2xl">
                <div className="flex items-center border-b border-[#77775f]/80 bg-[#77775f] p-5 text-white">
                  <MessageSquare className="mr-3 h-5 w-5" />
                  <span className="text-lg font-semibold">VAClaims Assistant</span>
                </div>
                <div className="flex h-[420px] flex-col space-y-6 overflow-y-auto bg-[#f7f6f2] p-6 md:h-[450px] lg:h-[480px]">
                  {chatMessages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 ${
                          message.role === "user"
                            ? "rounded-br-none bg-[#77775f] text-white shadow-md"
                            : "rounded-bl-none border border-[#9d9b80]/30 bg-white text-[#3a3a3a] shadow-md"
                        }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#9d9b80]/20 bg-white p-5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask about your VA claim..."
                      className="w-full rounded-full border border-[#9d9b80]/30 bg-[#f7f6f2] p-3 pr-28 pl-5 text-[#3a3a3a] focus:ring-2 focus:ring-[#958b60] focus:outline-none"
                      disabled
                    />
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full border border-[#9d9b80]/30 bg-[#f7f6f2] px-3 py-1 text-sm font-medium text-[#7b664a]">
                      Sign up to chat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Benefit Badges (visible only on larger screens) */}
        <div className="absolute -bottom-10 left-1/2 z-10 hidden w-full max-w-5xl -translate-x-1/2 transform md:block">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center rounded-lg border border-[#9d9b80]/20 bg-white p-6 shadow-lg">
              <Award className="mr-4 h-10 w-10 text-[#958b60]" />
              <div>
                <h4 className="font-bold text-[#7b664a]">94% Success Rate</h4>
                <p className="text-sm text-[#77775f]">With VA disability claims</p>
              </div>
            </div>
            <div className="flex items-center rounded-lg border border-[#9d9b80]/20 bg-white p-6 shadow-lg">
              <TrendingUp className="mr-4 h-10 w-10 text-[#958b60]" />
              <div>
                <h4 className="font-bold text-[#7b664a]">30% Avg. Increase</h4>
                <p className="text-sm text-[#77775f]">In disability benefits</p>
              </div>
            </div>
            <div className="flex items-center rounded-lg border border-[#9d9b80]/20 bg-white p-6 shadow-lg">
              <Badge className="mr-4 h-10 w-10 text-[#958b60]" />
              <div>
                <h4 className="font-bold text-[#7b664a]">Veteran-Owned</h4>
                <p className="text-sm text-[#77775f]">By veterans, for veterans</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section with MultiCam palette */}
      <section className="bg-white py-24 pt-32 md:pt-24" id="features">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#7b664a]">
              Military-Grade Assistance for Your VA Claims
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#77775f]">
              Our comprehensive platform provides you with the tools and expertise needed to
              successfully navigate the VA claims process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f6f2] shadow-sm">
                <FileText className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#7b664a]">Supporting Evidence</h3>
              <p className="text-[#77775f]">
                Access research-backed medical journals and documentation to strengthen your claims
                with scientific precision.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f6f2] shadow-sm">
                <Book className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#7b664a]">Narrative Creation</h3>
              <p className="text-[#77775f]">
                Develop compelling stories that connect your evidence, legal backing, and service
                history into a persuasive claim.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f6f2] shadow-sm">
                <Scale className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#7b664a]">Legal Backing</h3>
              <p className="text-[#77775f]">
                Leverage expert knowledge of VA rules and regulations to build solid, legally sound
                claims that meet all requirements.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f6f2] shadow-sm">
                <FileCheck className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#7b664a]">Preparation</h3>
              <p className="text-[#77775f]">
                Comprehensive C&P exam preparation ensures you approach every evaluation with
                confidence and readiness.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f6f2] shadow-sm">
                <Book className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#7b664a]">Case Law</h3>
              <p className="text-[#77775f]">
                Access relevant legal precedents that hold the VA accountable and strengthen your
                position throughout the claims process.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f6f2] shadow-sm">
                <Users className="h-7 w-7 text-[#7b664a]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#7b664a]">Veteran Support</h3>
              <p className="text-[#77775f]">
                Connect with veteran experts who guide you through every step of the process with
                empathy and understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y border-[#9d9b80]/20 bg-[#f7f6f2] py-24" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#7b664a]">
              Trusted by Veterans Nationwide
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#77775f]">
              Hear from fellow veterans who have successfully navigated the VA claims process with
              our help
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex text-[#958b60]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="mb-6 text-[#77775f]">
                "After struggling with my PTSD claim for over two years, VAClaims helped me organize
                my evidence and craft a compelling narrative. My claim was approved at 70% within 3
                months of submission."
              </blockquote>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9d9b80] font-bold text-white">
                  JM
                </div>
                <div className="ml-3">
                  <p className="font-medium text-[#7b664a]">James M.</p>
                  <p className="text-sm text-[#9d9b80]">Army Veteran, served 2008-2016</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex text-[#958b60]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="mb-6 text-[#77775f]">
                "The C&P exam prep was invaluable. I knew exactly what to expect and how to
                effectively communicate my conditions. VAClaims' guidance increased my rating from
                30% to 80%, completely changing my life."
              </blockquote>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9d9b80] font-bold text-white">
                  SD
                </div>
                <div className="ml-3">
                  <p className="font-medium text-[#7b664a]">Sarah D.</p>
                  <p className="text-sm text-[#9d9b80]">Navy Veteran, served 2010-2019</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-xl border border-[#9d9b80]/20 bg-white p-8 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex text-[#958b60]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="mb-6 text-[#77775f]">
                "Filing for back pay seemed impossible until I found VAClaims. Their research tools
                helped me identify key medical evidence from my service records that I didn't know
                was relevant. Received 5 years of back pay."
              </blockquote>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9d9b80] font-bold text-white">
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
          <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#958b60]/10">
                <TrendingUp className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-[#7b664a]">94%</h3>
              <p className="text-[#77775f]">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#958b60]/10">
                <Users className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-[#7b664a]">10k+</h3>
              <p className="text-[#77775f]">Veterans Helped</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#958b60]/10">
                <Award className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-[#7b664a]">$42M+</h3>
              <p className="text-[#77775f]">Back Pay Secured</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#958b60]/10">
                <Medal className="h-8 w-8 text-[#958b60]" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-[#7b664a]">4.9/5</h3>
              <p className="text-[#77775f]">Veteran Rating</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-sm font-medium tracking-wider text-[#77775f] uppercase">
                Trusted By
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center text-[#7b664a]">
                <Shield className="mr-2 h-6 w-6" />
                <span className="font-medium">Military Times</span>
              </div>
              <div className="flex items-center text-[#7b664a]">
                <BadgeCheck className="mr-2 h-6 w-6" />
                <span className="font-medium">Veterans Affairs Accredited</span>
              </div>
              <div className="flex items-center text-[#7b664a]">
                <Award className="mr-2 h-6 w-6" />
                <span className="font-medium">Disabled American Veterans</span>
              </div>
              <div className="flex items-center text-[#7b664a]">
                <Medal className="mr-2 h-6 w-6" />
                <span className="font-medium">American Legion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with MultiCam palette */}
      <section className="bg-white py-24" id="pricing">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-[#7b664a]">Choose Your Service Plan</h2>
              <p className="mx-auto max-w-2xl text-lg text-[#77775f]">
                Get the support you need with our veteran-focused claim assistance services
              </p>
            </div>

            {/* Add highlight banner above pricing card */}
            <div className="mb-8 rounded-xl border border-[#958b60]/30 bg-[#958b60]/10 p-4 text-center">
              <p className="font-medium text-[#7b664a]">
                <span className="font-bold text-[#958b60]">Special Offer:</span> Use code{" "}
                <span className="rounded bg-[#f7f6f2] px-2 py-1 font-mono font-bold text-[#7b664a]">
                  VETERAN25
                </span>{" "}
                for 25% off your first 3 months
              </p>
            </div>

            <Card className="border-[#9d9b80]/20 shadow-lg">
              <CardContent className="relative p-8">
                <div className="flex flex-col lg:flex-row">
                  {/* Left side: Content */}
                  <div className="lg:w-2/3">
                    <h2 className="mb-2 text-2xl font-bold text-[#7b664a]">Veteran Pro Plan</h2>
                    <p className="mb-6 text-[#77775f]">
                      Everything you need for a successful VA disability claim
                    </p>

                    <div className="block space-y-4 lg:hidden">
                      <div>
                        <span className="text-4xl font-bold text-[#7b664a]">${currentPrice}</span>
                        <span className="ml-2 text-[#77775f]">/{isAnnual ? "year" : "month"}</span>
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
                    <p className="text-sm text-[#9d9b80]">
                      All subscriptions come with a 30-day money-back guarantee. Cancel anytime.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center space-y-6 md:w-1/3 lg:relative lg:border-s lg:border-[#9d9b80]/20 lg:ps-8">
                    <div className="hidden space-y-4 lg:block">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-[#7b664a]">${currentPrice}</span>
                        <span className="ml-2 text-[#77775f]">/{isAnnual ? "year" : "month"}</span>
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
                      <Button className="w-full bg-[#958a68] font-medium text-white shadow-md hover:bg-[#77775f]">
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
            <div className="mt-8 text-center">
              <div className="inline-flex items-center rounded-full bg-[#958b60]/10 px-6 py-3">
                <Shield className="mr-2 h-5 w-5 text-[#958b60]" />
                <span className="font-medium text-[#7b664a]">30-Day Money-Back Guarantee</span>
              </div>
            </div>

            <div className="my-12">
              <h2 className="mb-8 text-center text-xl font-semibold text-[#7b664a]">
                Why Choose VAClaims?
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-[#9d9b80]/20 transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#7b664a]">Veteran-Owned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#77775f]">
                      Created by veterans who understand the challenges you face
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-[#9d9b80]/20 transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#7b664a]">Expert Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#77775f]">
                      Access to retired VA raters and claims specialists
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-[#9d9b80]/20 transition-shadow hover:shadow-md">
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
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-[#9d9b80]/20">
                      <AccordionTrigger className="text-start text-[#7b664a]">
                        {faq.question}
                      </AccordionTrigger>
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
      <section className="bg-[#77775f] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold">Ready to Secure Your VA Benefits?</h2>
            <p className="mb-6 text-lg text-[#f7f6f2]">
              Join thousands of veterans who have successfully navigated the claims process with
              VAClaims.
            </p>
            <p className="mb-10 text-[#f0d78c]">
              No credit card required to start your free 7-day trial
            </p>
            <Button
              size="lg"
              className="bg-[#958a68] px-10 py-6 text-lg font-medium text-white shadow-md hover:bg-[#77775f]">
              Start Your Claim Today
            </Button>
            <p className="mx-auto mt-6 max-w-md text-sm text-[#f7f6f2]/80">
              By signing up, you agree to our Terms of Service and Privacy Policy. We're committed
              to protecting your information.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with MultiCam palette */}
      <footer className="bg-[#3a3a3a] py-16 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-8 md:mb-0">
              <h2 className="mb-2 text-2xl font-bold text-white">VAClaims</h2>
              <p className="text-[#9d9b80]">Supporting veterans with the benefits they deserve</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <Link href="#" className="text-[#9d9b80] transition-colors hover:text-white">
                About
              </Link>
              <Link href="#" className="text-[#9d9b80] transition-colors hover:text-white">
                Features
              </Link>
              <Link href="#" className="text-[#9d9b80] transition-colors hover:text-white">
                Testimonials
              </Link>
              <Link href="#" className="text-[#9d9b80] transition-colors hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-10 border-t border-[#77775f]/30 pt-10 text-center text-sm">
            <p>© {new Date().getFullYear()} VAClaims. All rights reserved.</p>
            <p className="mt-4 flex justify-center gap-6">
              <Link href="#" className="text-[#9d9b80] transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[#9d9b80] transition-colors hover:text-white">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA - Fixed at the bottom on mobile */}
      <div className="fixed right-0 bottom-0 left-0 z-40 bg-[#7b664a] p-4 shadow-lg md:hidden">
        <Button className="w-full bg-[#958a68] font-medium text-white shadow-inner hover:bg-[#77775f]">
          Start Your Claim Today
        </Button>
      </div>
    </div>
  );
}
