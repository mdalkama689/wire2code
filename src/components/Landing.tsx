"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code2, Zap, Lock, Sparkles, ArrowRight, Github } from "lucide-react";
import Header from "./Header";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Footer from "./Footer";

function Landing() {
    const { status } = useSession();
  return (
    <div className="min-h-screen ">
<Header />
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-[#101010]">
        <div className="absolute " />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Code2 className="h-12 w-12 " />
              <h1 className="text-4xl font-bold">Wire2Code</h1>
            </div>
            <h2 className="text-5xl font-bold  mb-6">
              Transform Your Ideas Into Code
            </h2>
            <p className="text-xl  max-w-2xl mx-auto mb-8">
              The intelligent AI platform that converts your wireframes and
              designs into production-ready code instantly.
            </p>
            <div className="flex gap-4 justify-center">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="cursor-pointer bg-white text-black px-3 py-1 rounded font-bold hover:bg-gray-200 flex items-center justify-center"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Button size="lg">
                  Try Wire2Code Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="lg">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-[#262626]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose Wire2Code?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 " />}
              title="Lightning Fast"
              description="Convert designs to code in seconds, not hours. Boost your development workflow significantly."
            />
            <FeatureCard
              icon={<Lock className="h-8 w-8 " />}
              title="Secure & Private"
              description="Your designs and code are encrypted and never stored. We prioritize your privacy and security."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 " />}
              title="AI-Powered"
              description="Advanced machine learning algorithms ensure high-quality, maintainable code output."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className=" w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold bg-[#262626] h-12 w-12 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Design</h3>
              <p className="">
                Upload your wireframe, sketch, or design file in any common
                format.
              </p>
            </div>
            <div>
              <div className=" w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold bg-[#262626] h-12 w-12 rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Processing</h3>
              <p className="">
                Our AI analyzes your design and converts it into clean,
                efficient code.
              </p>
            </div>
            <div>
              <div className=" w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold bg-[#262626] h-12 w-12 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Code</h3>
              <p className="">
                Download production-ready code in your preferred framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24  bg-white text-black ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Design Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who are already using Wire2Code to
            streamline their workflow.
          </p>

          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="cursor-pointer bg-black text-white px-3 py-1 rounded font-bold hover:bg-zinc-900  flex items-center justify-center w-fit"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Button size="lg" variant="secondary">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
 <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="">{description}</p>
    </Card>
  );
}

export default Landing;
