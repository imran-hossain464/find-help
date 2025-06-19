import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Building Stronger Communities Together</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with your neighbors, offer help, request assistance, and organize community events. Join our platform
          to make a positive impact in your community.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/auth/register">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How We Help Communities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Request & Offer Help</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Post help requests or offer assistance to community members in need.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Organize and manage community events like clean-ups and charity drives.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Community Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Connect and communicate with other community members directly.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Build Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Foster meaningful relationships and strengthen community bonds.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">Join thousands of community members making their neighborhoods better.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">Join Our Community</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
