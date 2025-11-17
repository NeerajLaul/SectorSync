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
} from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

/**
 * ProfilePage
 * - Overview: quick stats + last result
 * - Results: paginated history with export
 * - Account: profile fields (name, title, company, bio), contact info
 * - Security: change email/password + sessions
 *
 * NOTE: This is a front-end template. Wire the handlers to your API.
 */

export interface PastResult {
  id: string;
  createdAt: string; // ISO
  projectName?: string;
  projectDescription?: string;
  topMethod: string;
  score: number; // 0..100
  factors: Record<string, number>; // optional breakdown
  fullResults?: ScoringResult; // Store the complete scoring result for viewing later
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
}

interface ProfilePageProps {
  user: UserProfile;
  results: PastResult[];
  onUpdateProfile: (
    patch: Partial<UserProfile>,
  ) => Promise<void>;
  onChangeEmail: (
    newEmail: string,
    currentPassword: string,
  ) => Promise<void>;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  onExportResult?: (resultId: string) => Promise<Blob | void>;
  onDeleteResult?: (resultId: string) => Promise<void>;
  onViewResult?: (resultId: string) => void;
}

export default function ProfilePage({
  user,
  results,
  onUpdateProfile,
  onChangeEmail,
  onChangePassword,
  onExportResult,
  onDeleteResult,
  onViewResult,
}: ProfilePageProps) {
  const [tab, setTab] = useState("overview");

  // Account fields state
  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [company, setCompany] = useState(user.company || "");
  const [title, setTitle] = useState(user.title || "");
  const [bio, setBio] = useState(user.bio || "");

  // Security state
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [emailPw, setEmailPw] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setCompany(user.company || "");
    setTitle(user.title || "");
    setBio(user.bio || "");
  }, [user]);

  const last = results[0];
  const bestScore = useMemo(
    () =>
      results.length
        ? Math.max(...results.map((r) => r.score))
        : 0,
    [results],
  );

  async function handleProfileSave() {
    try {
      setPending(true);
      await onUpdateProfile({ fullName, company, title, bio });
      setMessage("Profile updated");
    } catch (e: any) {
      setMessage(e?.message || "Failed to update profile");
    } finally {
      setPending(false);
    }
  }

  async function handleEmailChange() {
    try {
      setPending(true);
      await onChangeEmail(email, emailPw);
      setMessage(
        "Email change requested. Check your inbox to confirm.",
      );
      setEmailPw("");
    } catch (e: any) {
      setMessage(e?.message || "Failed to change email");
    } finally {
      setPending(false);
    }
  }

  async function handlePasswordChange() {
    try {
      setPending(true);
      await onChangePassword(currentPw, newPw);
      setMessage("Password updated");
      setCurrentPw("");
      setNewPw("");
    } catch (e: any) {
      setMessage(e?.message || "Failed to change password");
    } finally {
      setPending(false);
    }
  }

  async function handleExport(id: string) {
    if (!onExportResult) return;
    const blob = (await onExportResult(id)) as Blob | undefined;
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sectorsync-result-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage
                src={user.avatarUrl}
                alt={user.fullName}
              />
              <AvatarFallback>
                {user.fullName
                  ?.split(" ")
                  ?.map((s) => s[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl">Your Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your SectorSync account, security, and
                results
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="backdrop-blur-sm"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />{" "}
                  {results.length} saved results
                </Badge>
                <Badge
                  variant="secondary"
                  className="backdrop-blur-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Best
                  score {bestScore}%
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-0 overflow-hidden shadow-2xl glass-card border-white/20 dark:border-white/10">
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="w-full"
          >
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="results">
                  Past Results
                </TabsTrigger>
                <TabsTrigger value="account">
                  Account
                </TabsTrigger>
                <TabsTrigger value="security">
                  Security
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator className="my-0" />

            {/* OVERVIEW */}
            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-5 col-span-1 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg">
                      Most Recent Result
                    </h3>
                    <div className="flex gap-2">
                      <Badge>{last?.topMethod || "—"}</Badge>
                      {last && (
                        <Badge variant="secondary">
                          {last.score}% match
                        </Badge>
                      )}
                    </div>
                  </div>
                  {last ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(
                            last.createdAt,
                          ).toLocaleString()}
                        </p>
                        <div className="mt-3 space-y-2">
                          {Object.entries(last.factors || {})
                            .slice(0, 6)
                            .map(([k, v]) => (
                              <div
                                key={k}
                                className="flex justify-between text-sm"
                              >
                                <span className="capitalize">
                                  {k.replaceAll("_", " ")}
                                </span>
                                <span className="font-medium">
                                  {v}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
                        <p className="text-sm mb-2">
                          Top Recommendation
                        </p>
                        <p className="text-2xl font-semibold mb-3">
                          {last.topMethod}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your inputs indicated the highest
                          alignment with {last.topMethod}.
                          Explore the detailed report in the
                          Results tab.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No results yet. Complete an assessment to
                      see insights here.
                    </p>
                  )}
                </Card>

                <Card className="p-5">
                  <h3 className="text-lg mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setTab("results")}
                    >
                      <History className="h-4 w-4 mr-2" /> View
                      history
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setTab("account")}
                    >
                      <User className="h-4 w-4 mr-2" /> Edit
                      profile
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setTab("security")}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />{" "}
                      Update password
                    </Button>
                    <Button
                      onClick={() =>
                        window.location.assign("/assess")
                      }
                    >
                      <Sparkles className="h-4 w-4 mr-2" /> New
                      assessment
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* RESULTS */}
            <TabsContent value="results" className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg">Saved Assessments</h3>
                <p className="text-sm text-muted-foreground">
                  {results.length} total
                </p>
              </div>
              <Card className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Top Method</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {r.projectName || "Untitled Project"}
                            </div>
                            {r.projectDescription && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {r.projectDescription}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(
                            r.createdAt,
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge>{r.topMethod}</Badge>
                        </TableCell>
                        <TableCell>{r.score}%</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(r.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />{" "}
                            Export
                          </Button>
                          {onDeleteResult && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                onDeleteResult(r.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-1" />{" "}
                              Delete
                            </Button>
                          )}
                          {onViewResult && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                onViewResult(r.id)
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />{" "}
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Your saved assessment results. Export or delete as needed.
                  </TableCaption>
                </Table>
              </Card>
            </TabsContent>

            {/* ACCOUNT */}
            <TabsContent value="account" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-5 lg:col-span-2">
                  <h3 className="text-lg mb-4">Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" /> Full name
                      </Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="h-4 w-4" /> Title /
                        Role
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) =>
                          setTitle(e.target.value)
                        }
                        placeholder="e.g., Product Manager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="flex items-center gap-2"
                      >
                        <Building className="h-4 w-4" /> Company
                      </Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) =>
                          setCompany(e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" /> Email
                        (login)
                      </Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Change is verified via email in Security
                        tab.
                      </p>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about your team or use case…"
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button
                      onClick={handleProfileSave}
                      disabled={pending}
                    >
                      <Save className="h-4 w-4 mr-2" /> Save
                      changes
                    </Button>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-lg mb-4">
                    Connected Accounts
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4" /> GitHub
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4" /> Google
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* SECURITY */}
            <TabsContent value="security" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h3 className="text-lg mb-4">Change Email</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="newEmail"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" /> New Email
                      </Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="emailPw"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" /> Current
                        Password
                      </Label>
                      <Input
                        id="emailPw"
                        type="password"
                        value={emailPw}
                        onChange={(e) =>
                          setEmailPw(e.target.value)
                        }
                      />
                    </div>
                    <Button
                      onClick={handleEmailChange}
                      disabled={pending}
                    >
                      Update Email
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      We'll send a verification link to confirm
                      this change.
                    </p>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-lg mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPw"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" /> Current
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPw"
                          type={showPw ? "text" : "password"}
                          value={currentPw}
                          onChange={(e) =>
                            setCurrentPw(e.target.value)
                          }
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPw((s) => !s)}
                        >
                          {showPw ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPw"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" /> New
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPw"
                          type={showNewPw ? "text" : "password"}
                          value={newPw}
                          onChange={(e) =>
                            setNewPw(e.target.value)
                          }
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() =>
                            setShowNewPw((s) => !s)
                          }
                        >
                          {showNewPw ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use at least 8 characters, with a mix of
                        letters and numbers.
                      </p>
                    </div>
                    <Button
                      onClick={handlePasswordChange}
                      disabled={pending}
                    >
                      Update Password
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {message && (
          <div className="mt-4 text-sm text-center text-muted-foreground">
            {message}
          </div>
        )}

        {/* Footer helper blurb */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Tip: You can surface a full printable report for any
          row in <b>Past Results</b> by routing to e.g.{" "}
          <code>/results/:id</code>.
        </div>
      </div>
    </div>
  );
}
