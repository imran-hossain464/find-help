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
import { Calendar, Plus, MapPin, Users, Clock, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxAttendees: number
  attendees: string[]
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxAttendees: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to join events",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        fetchEvents() // Refresh events
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setEditFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0], // Format date for input
      time: event.time,
      location: event.location,
      category: event.category,
      maxAttendees: event.maxAttendees.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateEvent = async () => {
    if (!editingEvent) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          maxAttendees: Number.parseInt(editFormData.maxAttendees),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully!",
        })
        setIsEditDialogOpen(false)
        fetchEvents()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to update event",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully!",
        })
        fetchEvents()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete event",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isUserAttending = (event: Event) => {
    return user && event.attendees?.includes(user._id)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Event Management</h1>
            <p className="text-gray-600">Organize and participate in community events</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
            <TabsTrigger value="joined">Joined Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to create a community event!</p>
                  <Button asChild>
                    <Link href="/dashboard/events/create">Create Event</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>
                            Organized by {event.organizer.firstName} {event.organizer.lastName}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {event.category}
                          </span>
                          {event.organizer._id === user?._id && (
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.attendees?.length || 0} / {event.maxAttendees} attendees
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleJoinEvent(event._id)}
                          disabled={event.attendees?.length >= event.maxAttendees}
                          variant={isUserAttending(event) ? "outline" : "default"}
                        >
                          {event.attendees?.length >= event.maxAttendees
                            ? "Full"
                            : isUserAttending(event)
                              ? "Leave Event"
                              : "Join Event"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-events">
            <div className="grid gap-4">
              {events
                .filter((event) => event.organizer._id === user?._id)
                .map((event) => (
                  <Card key={event._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>You organized this event</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {event.category}
                          </span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees?.length || 0} attendees</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {events.filter((event) => event.organizer._id === user?._id).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">You haven't created any events yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="joined">
            <div className="grid gap-4">
              {events
                .filter((event) => isUserAttending(event))
                .map((event) => (
                  <Card key={event._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>
                            Organized by {event.organizer.firstName} {event.organizer.lastName}
                          </CardDescription>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Joined</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {events.filter((event) => isUserAttending(event)).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">You haven't joined any events yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update your event details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
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
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, time: e.target.value }))}
                  />
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
                      <SelectItem value="cleanup">Clean-up</SelectItem>
                      <SelectItem value="charity">Charity Drive</SelectItem>
                      <SelectItem value="social">Social Gathering</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="sports">Sports & Recreation</SelectItem>
                      <SelectItem value="volunteer">Volunteer Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxAttendees">Max Attendees</Label>
                  <Input
                    id="edit-maxAttendees"
                    type="number"
                    min="1"
                    value={editFormData.maxAttendees}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, maxAttendees: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateEvent} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Event"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
