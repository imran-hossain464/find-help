import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, MessageCircle, Bell, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Heart,
      title: "Help Request & Offer System",
      description:
        "Post help requests or offer assistance to community members. Connect with neighbors who need support or can provide help.",
      features: ["Create help requests", "Offer assistance", "Comment and interact", "Like/unlike posts"],
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Organize and manage community events like clean-ups, charity drives, and social gatherings.",
      features: ["Create events", "Manage attendees", "Event calendar", "RSVP system"],
    },
    {
      icon: MessageCircle,
      title: "Community Messaging",
      description: "Direct messaging system to communicate with other community members privately and securely.",
      features: ["Private messaging", "Group chats", "Real-time communication", "Message history"],
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay informed about events, help requests, messages, and community activities that matter to you.",
      features: ["Event reminders", "New help requests", "Message alerts", "Custom preferences"],
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Tools to build stronger connections and foster meaningful relationships within your community.",
      features: ["User profiles", "Community groups", "Interest matching", "Local connections"],
    },
    {
      icon: Shield,
      title: "Safe & Secure Platform",
      description: "Your privacy and security are our top priorities with robust protection and moderation systems.",
      features: ["Data encryption", "User verification", "Content moderation", "Privacy controls"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all the ways our platform helps you connect with your community, offer and receive help, and
              organize meaningful events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your account and join your local community network.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Find neighbors, post help requests, or offer your assistance.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Make Impact</h3>
                <p className="text-gray-600">Help others, organize events, and strengthen your community.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6">Join our community platform and start making a difference today.</p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">Create Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
