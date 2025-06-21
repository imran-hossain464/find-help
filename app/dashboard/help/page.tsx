"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Plus, MessageCircle, ThumbsUp, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface HelpPost {
  _id: string
  title: string
  description: string
  category: string
  urgency: string
  location: string
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
  const [editingPost, setEditingPost] = useState<HelpPost | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "",
    location: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
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

  const handleEditPost = (post: HelpPost) => {
    setEditingPost(post)
    setEditFormData({
      title: post.title,
      description: post.description,
      category: post.category,
      urgency: post.urgency,
      location: post.location,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/help/${editingPost._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Help request updated successfully!",
        })
        setIsEditDialogOpen(false)
        fetchHelpPosts()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to update help request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update help request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this help request?")) return

    try {
      const response = await fetch(`/api/help/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Help request deleted successfully!",
        })
        fetchHelpPosts()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete help request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete help request. Please try again.",
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
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                          {post.author._id === user?._id && (
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
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
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
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
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Help Request</DialogTitle>
              <DialogDescription>Update your help request details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="household">Household Tasks</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="childcare">Childcare</SelectItem>
                      <SelectItem value="petcare">Pet Care</SelectItem>
                      <SelectItem value="technology">Technology Help</SelectItem>
                      <SelectItem value="moving">Moving/Heavy Lifting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select
                    value={editFormData.urgency}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, urgency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Within a week</SelectItem>
                      <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                      <SelectItem value="high">High - Within 24 hours</SelectItem>
                      <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePost} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
