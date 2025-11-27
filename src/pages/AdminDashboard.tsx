import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminDashboard = () => {
  // Mock stats
  const stats = [
    { label: "Total Notes", value: "1,234", icon: FileText, change: "+12%" },
    { label: "Total Users", value: "5,678", icon: Users, change: "+8%" },
    { label: "Total Downloads", value: "45.6K", icon: Download, change: "+23%" },
    { label: "Active Today", value: "892", icon: TrendingUp, change: "+5%" },
  ];

  // Mock reported notes
  const reportedNotes = [
    {
      id: "1",
      title: "Incorrect DSA Notes",
      reportedBy: "Student A",
      reason: "Wrong content",
      date: "2 hours ago",
    },
    {
      id: "2",
      title: "Spam Upload",
      reportedBy: "Student B",
      reason: "Spam",
      date: "5 hours ago",
    },
  ];

  // Mock branch stats
  const branchStats = [
    { branch: "CSE", notes: 456, users: 1234 },
    { branch: "ECE", notes: 234, users: 789 },
    { branch: "Mechanical", notes: 189, users: 567 },
    { branch: "Civil", notes: 145, users: 456 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage notes, users, and platform analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reported Notes */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-bold text-foreground">Reported Notes</h2>
              </div>
              <Badge variant="destructive">{reportedNotes.length}</Badge>
            </div>

            <div className="space-y-4">
              {reportedNotes.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg bg-muted/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Reported by {report.reportedBy} • {report.date}
                      </p>
                    </div>
                    <Badge variant="outline">{report.reason}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Statistics */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Branch Statistics</h2>
            <div className="space-y-4">
              {branchStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{stat.branch}</span>
                    <span className="text-muted-foreground">
                      {stat.notes} notes • {stat.users} users
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${(stat.notes / 500) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="glass-card p-6 rounded-xl mt-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Manage Branches
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
