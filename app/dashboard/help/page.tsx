"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Plus, MessageCircle, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface HelpPost {
  _id: string
  title: string
  description: string
  category: string
  author: {
    firstName: string
    lastName: string
    _id: string
  }
  createdAt: string
  likes: string[]
  comments: any[]
}

export default function HelpPage() {
  const { user } = useAuth()
  const [helpPosts, setHelpPosts] = useState<HelpPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchHelpPosts()
  }, [])

  const fetchHelpPosts = async () => {
    try {
      const response = await fetch("/api/help")
      if (response.ok) {
        const data = await response.json()
        setHelpPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch help posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/help/${postId}/like`, {
        method: "POST",
      })
      if (response.ok) {
        fetchHelpPosts() // Refresh posts
      }
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const startConversation = async (participantId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to contact helpers",
        variant: "destructive",
      })
      return
    }

    if (participantId === user._id) {
      toast({
        title: "Info",
        description: "You cannot message yourself",
        variant: "default",
      })
      return
    }

    try {
      const response = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      })

      if (response.ok) {
        const conversation = await response.json()
        // Navigate to messages page with this conversation selected
        window.location.href = `/dashboard/messages?conversation=${conversation._id}`
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to start conversation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Community Help</h1>
            <p className="text-gray-600">Request help or offer assistance to your neighbors</p>
          </div>
          <div className="space-x-2">
            <Button asChild>
              <Link href="/dashboard/help/request">
                <Plus className="h-4 w-4 mr-2" />
                Request Help
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/help/offer">
                <Heart className="h-4 w-4 mr-2" />
                Offer Help
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="my-offers">My Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading help requests...</div>
            ) : helpPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No help requests yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to request or offer help in your community!</p>
                  <Button asChild>
                    <Link href="/dashboard/help/request">Create Help Request</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {helpPosts.map((post) => (
                  <Card key={post._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>
                            by {post.author.firstName} {post.author.lastName} •{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{post.description}</p>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post._id)}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes?.length || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1"
                          onClick={() => {
                            // Toggle comment section or navigate to detailed view
                            console.log("Show comments for post:", post._id)
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments?.length || 0}</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => startConversation(post.author._id)}
                          disabled={post.author._id === user?._id}
                        >
                          {post.author._id === user?._id ? "Your Post" : "Contact Helper"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-requests">
            <div className="grid gap-4">
              {helpPosts
                .filter((post) => post.author._id === user?._id)
                .map((post) => (
                  <Card key={post._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>
                            Your request • {new Date(post.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{post.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes?.length || 0} likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments?.length || 0} comments</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {helpPosts.filter((post) => post.author._id === user?._id).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">You haven't created any help requests yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-offers">
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">Help offers you've made will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
