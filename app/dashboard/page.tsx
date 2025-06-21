"use client"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Calendar, MessageCircle, Bell, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    helpRequests: 0,
    eventsCreated: 0,
    messagesReceived: 0,
    notifications: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    if (user) {
      fetchStats()
      // Refresh stats every 30 seconds
      const interval = setInterval(fetchStats, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600">Here's what's happening in your community today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.helpRequests}</div>
              <p className="text-xs text-muted-foreground">Active in your area</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.eventsCreated}</div>
              <p className="text-xs text-muted-foreground">Upcoming events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messagesReceived}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notifications}</div>
              <p className="text-xs text-muted-foreground">New notifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Help Requests</CardTitle>
              <CardDescription>Latest requests from your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Need help with grocery shopping</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Looking for pet sitter</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Help with moving furniture</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Community events you might be interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Community Clean-up Day</p>
                    <p className="text-xs text-gray-500">Tomorrow at 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Charity Food Drive</p>
                    <p className="text-xs text-gray-500">This weekend</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Neighborhood BBQ</p>
                    <p className="text-xs text-gray-500">Next Sunday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Heart className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Request Help</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Offer Help</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Create Event</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <MessageCircle className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Send Message</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
