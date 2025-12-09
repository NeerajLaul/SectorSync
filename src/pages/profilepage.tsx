import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Textarea } from "../components/ui/textarea";
import {
  User,
  Mail,
  Building,
  Lock,
  Eye,
  EyeOff,
  Save,
  Download,
  Trash2,
  History,
  ShieldCheck,
  Link as LinkIcon,
  BarChart3,
  Sparkles,
  ExternalLink,
  Trophy as TrophyIcon
} from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

export interface PastResult {
  id: string;
  createdAt: string;
  projectName?: string;
  projectDescription?: string;
  topMethod: string;
  score: number;
  factors: Record<string, number>;
  fullResults?: ScoringResult;
}

export interface UserProfile {
  fullName: string;
  email: string;
  company?: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
}

interface ProfilePageProps {
  user: UserProfile;
  onLogout: () => void;
  // Methods to actually do the updates:
  onUpdateProfile?: (patch: Partial<UserProfile>) => Promise<void>;
  onChangeEmail?: (newEmail: string, currentPassword: string) => Promise<void>;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<void>;

  // Data fetchers for history
  history?: PastResult[]; // Changed prop name to match your App.tsx ('history' vs 'results')

  onExportResult?: (id: string, format: "csv" | "json") => void;
  onDeleteResult?: (id: string) => void;
  onViewResult?: (id: string) => void;
  onStartAssessment?: () => void;
}

export default function ProfilePage({
  user,
  onLogout,
  onUpdateProfile,
  onChangeEmail,
  onChangePassword,
  history = [], // Default to empty array
  onExportResult,
  onDeleteResult,
  onViewResult,
  onStartAssessment,
}: ProfilePageProps) {

  const [tab, setTab] = useState("overview");

  // 1. STATE: Initialize with safe fallbacks
  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [company, setCompany] = useState(user.company || "");
  const [title, setTitle] = useState(user.title || "");
  const [bio, setBio] = useState(user.bio || "");

  // Security state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [emailPw, setEmailPw] = useState(""); // For email change confirmation
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // 2. EFFECT: Sync state when user prop updates
  useEffect(() => {
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setCompany(user.company || "");
    setTitle(user.title || "");
    setBio(user.bio || "");
  }, [user]);

  // Derived stats
  const last = history[0]; // Most recent result
  const bestScore = useMemo(
    () => (history.length ? Math.max(...history.map((r) => r.score)) : 0),
    [history]
  );

  const handleProfileSave = async () => {
    setPending(true);
    setMessage(null);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile({ fullName, company, title, bio });
      }
      // simulate delay
      await new Promise((r) => setTimeout(r, 600));
      setMessage("Profile details updated successfully.");
    } catch (err: any) {
      setMessage("Error updating profile: " + err.message);
    } finally {
      setPending(false);
    }
  };

  const handleEmailChange = async () => {
    setPending(true);
    setMessage(null);
    try {
      if (onChangeEmail) await onChangeEmail(email, emailPw);
      await new Promise((r) => setTimeout(r, 600));
      setMessage("Email change requested. Check your inbox.");
      setEmailPw("");
    } catch (err: any) {
      setMessage("Error changing email: " + err.message);
    } finally {
      setPending(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPw) return;
    setPending(true);
    setMessage(null);
    try {
      if (onChangePassword) await onChangePassword(currentPw, newPw);
      await new Promise((r) => setTimeout(r, 600));
      setMessage("Password changed successfully.");
      setNewPw("");
      setCurrentPw("");
    } catch (err: any) {
      setMessage("Error changing password: " + err.message);
    } finally {
      setPending(false);
    }
  };

  // 3. FIX: Safe initials calculation
  const initials = useMemo(() => {
    return (fullName || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [fullName]);

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm ring-2 ring-primary/10">
              <AvatarImage src={user.avatarUrl} alt={fullName} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account, security, and assessment history.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="backdrop-blur-sm">
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  {history.length} Saved Results
                </Badge>
                <Badge variant="secondary" className="backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Best Score {bestScore}%
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Sign Out
          </Button>
        </div>

        {/* Main Content - Horizontal Tabs Layout */}
        <Card className="overflow-hidden shadow-sm border-border/50">
          <Tabs value={tab} onValueChange={setTab} className="w-full">

            {/* Horizontal Tabs List */}
            <div className="border-b px-6 pt-2 bg-muted/30">
              <TabsList className="bg-transparent h-12 w-full justify-start gap-6 p-0">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4 border-b-2 border-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4 border-b-2 border-transparent"
                >
                  Past Results
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4 border-b-2 border-transparent"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4 border-b-2 border-transparent"
                >
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            {/* --- OVERVIEW TAB --- */}
            <TabsContent value="overview" className="p-6 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Most Recent Result Card */}
                <Card className="p-5 col-span-1 lg:col-span-2 flex flex-col justify-between shadow-none border-dashed">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Most Recent Result</h3>
                    </div>
                    {last ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(last.createdAt).toLocaleString()}
                          </p>
                          <div className="mt-3 space-y-2">
                            {Object.entries(last.factors || {})
                              .slice(0, 5)
                              .map(([k, v]) => (
                                <div key={k} className="flex justify-between text-sm">
                                  <span className="capitalize text-muted-foreground">{k.replaceAll("_", " ")}</span>
                                  <span className="font-medium">{v}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="rounded-xl bg-primary/5 p-4 flex flex-col justify-center items-center text-center">
                          <p className="text-sm text-muted-foreground mb-2">Top Recommendation</p>
                          <div className="bg-background p-3 rounded-full mb-2 shadow-sm">
                            <TrophyIcon className="h-6 w-6 text-yellow-500" />
                          </div>
                          <p className="text-xl font-bold text-primary">{last.topMethod}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <p>No results yet.</p>
                        <p className="text-sm">Complete an assessment to see insights here.</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Actions Card */}
                <Card className="p-5 flex flex-col justify-between shadow-none border-dashed bg-muted/20">
                  <div>
                    <h3 className="text-lg mb-4 font-semibold">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Button variant="outline" className="justify-start bg-background" onClick={() => setTab("results")}>
                        <History className="h-4 w-4 mr-2" /> View History
                      </Button>
                      <Button variant="outline" className="justify-start bg-background" onClick={() => setTab("account")}>
                        <User className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                      <Button variant="outline" className="justify-start bg-background" onClick={() => setTab("security")}>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Security Settings
                      </Button>
                    </div>
                  </div>
                  {onStartAssessment && (
                    <Button className="mt-4 w-full" onClick={onStartAssessment}>
                      <Sparkles className="h-4 w-4 mr-2" /> New Assessment
                    </Button>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* --- PAST RESULTS TAB --- */}
            <TabsContent value="results" className="p-0 animate-in fade-in-50 duration-300">
              <div className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Saved Assessments</h3>
                  <span className="text-sm text-muted-foreground">{history.length} total</span>
                </div>
              </div>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Project Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Top Method</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No past assessments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="pl-6 font-medium">
                          {item.projectName || "Untitled Project"}
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {item.projectDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.topMethod}</Badge>
                        </TableCell>
                        <TableCell>{item.score}%</TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            {onViewResult && (
                              <Button variant="ghost" size="sm" onClick={() => onViewResult(item.id)}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            {onExportResult && (
                              <Button variant="ghost" size="sm" onClick={() => onExportResult(item.id, "json")}>
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {onDeleteResult && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => onDeleteResult(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* --- ACCOUNT TAB --- */}
            <TabsContent value="account" className="p-6 md:p-8 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title / Role</Label>
                      <div className="relative">
                        <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="pl-9" placeholder="e.g. Product Owner" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="email" value={email} disabled className="pl-9 bg-muted" />
                      </div>
                      <p className="text-xs text-muted-foreground">Change email in Security tab.</p>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about your team or project needs..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <Button onClick={handleProfileSave} disabled={pending}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>

                {/* Right: Connected Accounts */}
                <div className="space-y-6">
                  <Card className="p-5 shadow-none border-dashed bg-muted/20">
                    <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <span>GitHub</span>
                        </div>
                        <Button variant="outline" size="sm" disabled>Connect</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Google</span>
                        </div>
                        <Button variant="outline" size="sm" disabled>Connect</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* --- SECURITY TAB --- */}
            <TabsContent value="security" className="p-6 md:p-8 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Change Email */}
                <Card className="p-5 shadow-none border-dashed">
                  <h3 className="text-lg font-semibold mb-4">Change Email</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">New Email Address</Label>
                      <Input id="newEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailPw">Current Password</Label>
                      <Input id="emailPw" type="password" value={emailPw} onChange={(e) => setEmailPw(e.target.value)} placeholder="Required to verify" />
                    </div>
                    <Button onClick={handleEmailChange} disabled={pending} variant="outline" className="w-full">
                      Update Email
                    </Button>
                  </div>
                </Card>

                {/* Change Password */}
                <Card className="p-5 shadow-none border-dashed">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPw">Current Password</Label>
                      <div className="relative">
                        <Input id="currentPw" type={showPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="pr-10" />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPw">New Password</Label>
                      <div className="relative">
                        <Input id="newPw" type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} className="pr-10" />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange} disabled={pending} className="w-full">
                      Update Password
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

          </Tabs>
        </Card>

        {message && (
          <div className="text-center p-3 bg-primary/10 text-primary rounded-md text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            {message}
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Need help? Contact support or check the tool guide.
        </div>

      </div>
    </div>
  );
}