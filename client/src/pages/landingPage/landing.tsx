import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Globe,
  Sparkles,
  CreditCard,
  ArrowRight,
  Link as LinkIcon,
  Search,
  BrainCircuit,
  Zap,
  Check,
  Star,
  Menu,
  X
} from "lucide-react";
import { SiX, SiGithub, SiLinkedin } from "react-icons/si";
import { useEffect, useState } from "react";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <a href="/" className="flex items-center gap-2 flex-wrap" data-testid="link-logo">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl" data-testid="text-brand-name">Nexora</span>
          </a>

          <div className="hidden md:flex items-center gap-8 flex-wrap">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-testimonials">Testimonials</a>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-wrap">
            <Button onClick={() => {
              navigate("/login")
            }} variant="ghost" data-testid="button-login">Log In</Button>
            <Button
              onClick={() => {
                navigate("/sign-up")
              }}
              data-testid="button-get-started-nav">Get Started</Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1" data-testid="link-features-mobile">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1" data-testid="link-how-it-works-mobile">How It Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1" data-testid="link-pricing-mobile">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1" data-testid="link-testimonials-mobile">Testimonials</a>
              <div className="flex gap-3 pt-2 flex-wrap">
                <Button
                  onClick={() => {
                    navigate("/login")
                  }}
                  variant="ghost" className="flex-1" data-testid="button-login-mobile">Log In</Button>
                <Button
                  onClick={() => {
                    navigate("/sign-up")
                  }}
                  className="flex-1" data-testid="button-get-started-mobile">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5" data-testid="badge-hero">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              AI-Powered Web Intelligence
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" data-testid="text-hero-headline">
              Turn Any Website Into Your
              <span className="text-primary"> AI Knowledge Base</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl" data-testid="text-hero-subheadline">
              Simply paste a URL, and let our AI scrape, analyze, and answer questions about any website content. Get instant insights powered by cutting-edge AI technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Button
                onClick={() => {
                  navigate("/sign-up")
                }}
                size="lg" data-testid="button-get-started-hero">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 flex-wrap">
              <div className="flex flex-wrap -space-x-3">
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">JD</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">MK</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">AS</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">+5K</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-1 flex-wrap">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-hero-trust">Trusted by 5,000+ users</p>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="relative bg-gradient-to-br from-foreground/5 to-foreground/10 dark:from-foreground/5 dark:to-foreground/10 rounded-2xl p-6 border border-border shadow-xl" data-testid="container-demo-chat">
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-primary/30 rounded-full blur-2xl" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border flex-wrap">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground" data-testid="text-demo-url">https://docs.example.com/api</span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 justify-end flex-wrap">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg rounded-br-none max-w-xs">
                      <p className="text-sm" data-testid="text-demo-question">How do I authenticate with this API?</p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-lg rounded-bl-none max-w-sm">
                      <p className="text-sm" data-testid="text-demo-answer">Based on the documentation, you can authenticate using Bearer tokens. Add an Authorization header with your API key:</p>
                      <code className="text-xs bg-background/50 px-2 py-1 rounded mt-2 block font-mono" data-testid="text-demo-code">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 flex-wrap">
                  <div className="flex-1 bg-background rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground" data-testid="text-demo-placeholder">
                    Ask anything about this website...
                  </div>
                  <Button size="icon" data-testid="button-send-demo">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Create Chat Sessions",
      description: "Start a conversation by simply entering a website URL or title. Our AI creates a dedicated chat session for each website you want to explore."
    },
    {
      icon: Globe,
      title: "Smart Web Scraping",
      description: "Powered by Puppeteer, our system intelligently extracts and processes website content, handling dynamic pages and complex structures with ease."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Answers",
      description: "Leveraging LangChain and Google GenAI, get accurate, context-aware answers to any question about the scraped website content."
    },
    {
      icon: CreditCard,
      title: "Flexible Subscriptions",
      description: "Choose from free or premium tiers. Unlock unlimited chats, priority processing, and advanced features with our premium subscription."
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-features">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-features-headline">
            Everything You Need to
            <span className="text-primary"> Extract Knowledge</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-subheadline">
            Our comprehensive suite of tools makes it easy to turn any website into an interactive knowledge base.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300 border-border/50 bg-background" data-testid={`card-feature-${index}`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg" data-testid={`text-feature-title-${index}`}>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed" data-testid={`text-feature-desc-${index}`}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: LinkIcon,
      title: "Enter URL",
      description: "Paste any website URL you want to explore and analyze."
    },
    {
      step: "02",
      icon: Search,
      title: "Scrape Content",
      description: "Our AI automatically extracts and processes all relevant content."
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Start chatting and ask any questions about the website content."
    },
    {
      step: "04",
      icon: BrainCircuit,
      title: "Get AI Answers",
      description: "Receive accurate, contextual answers powered by advanced AI."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-how-it-works">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-how-it-works-headline">
            Simple Steps to
            <span className="text-primary"> Get Started</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-subheadline">
            From URL to insights in seconds. Our streamlined process makes it incredibly easy.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center" data-testid={`container-step-${index}`}>
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center" data-testid={`text-step-number-${index}`}>
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid={`text-step-title-${index}`}>{item.title}</h3>
                <p className="text-muted-foreground text-sm" data-testid={`text-step-desc-${index}`}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


const PricingSection = () => {
  const get = useGetAndDelete(axios.get)
  const [plans, setPlans] = useState<any[]>([])
  const navigate = useNavigate();

  const getPlan = async () => {
    const response = await get.callApi("pricing-plan/get", false, false)
    const fetchedPlans = response?.data?.plan || []

    // Map API fields to expected names if needed
    const formattedPlans = fetchedPlans.map((plan: any) => ({
      name: plan.planName || plan.name,
      price: plan.price,
      period: "per month",
      description: plan.description || "Perfect for scaling your usage",
      features: plan.features || [],
      cta: plan.price === 0 ? "Get Started Free" : "Subscribe",
      popular: plan.price > 10, // example logic, adjust as needed
    }))

    setPlans(formattedPlans)
  }

  useEffect(() => {
    getPlan()
  }, [])

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-pricing">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-pricing-headline">
            Simple, Transparent
            <span className="text-primary"> Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-pricing-subheadline">
            Choose the plan that works best for you. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"}`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-4" data-testid="badge-popular">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl" data-testid={`text-plan-name-${plan.name.toLowerCase()}`}>
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold" data-testid={`text-plan-price-${plan.name.toLowerCase()}`}>
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground ml-2" data-testid={`text-plan-period-${plan.name.toLowerCase()}`}>
                    /{plan.period}
                  </span>
                </div>
                <CardDescription className="mt-2" data-testid={`text-plan-desc-${plan.name.toLowerCase()}`}>
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 flex-wrap">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm" data-testid={`text-plan-feature-${plan.name.toLowerCase()}-${i}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    navigate("/login")
                  }}
                  data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechCorp",
      initials: "SC",
      content: "WebChat AI has completely transformed how we research competitors. I can now analyze any website in minutes instead of hours. The AI responses are incredibly accurate and contextual."
    },
    {
      name: "Marcus Johnson",
      role: "Freelance Developer",
      initials: "MJ",
      content: "As a developer, I use this tool daily to quickly understand documentation sites. It's like having a personal assistant that has read every page of the docs for me."
    },
    {
      name: "Emily Rodriguez",
      role: "Content Strategist",
      initials: "ER",
      content: "The ability to chat with any website has made content research so much easier. I can extract insights from multiple sites and compare them effortlessly. Highly recommend!"
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-testimonials">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-testimonials-headline">
            Loved by
            <span className="text-primary"> Thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-subheadline">
            See what our users are saying about their experience with WebChat AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed" data-testid={`text-testimonial-content-${index}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm" data-testid={`text-testimonial-name-${index}`}>{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-cta-headline">
          Ready to Transform Your
          <span className="text-primary"> Web Research?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-subheadline">
          Join thousands of users who are already using WebChat AI to extract insights from any website. Start for free today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <Button
            onClick={() => {
              navigate("sign-up")
            }}
            size="lg" data-testid="button-cta-start">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground/5 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4 flex-wrap" data-testid="link-footer-logo">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg" data-testid="text-footer-brand">Nexora</span>
            </a>
            <p className="text-sm text-muted-foreground mb-4" data-testid="text-footer-tagline">
              Turn any website into your personal AI knowledge base.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="https://github.com/MuhammadOsman381" target="_blank" data-testid="button-social-github">
                <SiGithub className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/mosman257" target="_blank" data-testid="button-social-linkedin">
                <SiLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-product-heading">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-features">Features</a></li>
              <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-pricing">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-changelog">Changelog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-docs">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-company-heading">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-careers">Careers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-legal-heading">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            2026 Nexora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
