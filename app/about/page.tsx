import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Our Community Platform</h1>

          <div className="prose prose-lg mx-auto mb-12">
            <p className="text-xl text-gray-600 text-center">
              We believe that strong communities are built on mutual support, collaboration, and shared experiences. Our
              platform connects neighbors and community members to create positive change together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  To empower communities by providing tools for mutual support, event organization, and meaningful
                  connections between neighbors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  A world where every community is connected, supportive, and actively working together to improve the
                  lives of all members.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Compassion, collaboration, inclusivity, and the belief that small acts of kindness can create
                  significant positive change.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">How It Started</h2>
            <p className="text-gray-600 mb-4">
              Our platform was born from the simple idea that communities thrive when people help each other. We noticed
              that many people wanted to help their neighbors but didn't know how to connect, and others needed
              assistance but were hesitant to ask.
            </p>
            <p className="text-gray-600 mb-4">
              By creating a digital space where community members can easily request help, offer assistance, organize
              events, and communicate, we're breaking down barriers and fostering genuine connections.
            </p>
            <p className="text-gray-600">
              Today, our platform serves communities worldwide, facilitating thousands of helpful interactions and
              meaningful events that bring people together.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
