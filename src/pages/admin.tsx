import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
    RefreshCw, Trash2, LayoutDashboard, FileText,
    Plus, Save, X, Users, Settings
} from "lucide-react";

// --- Helpers ---
const safeEntries = (obj: any) => (!obj || typeof obj !== 'object' ? [] : Object.entries(obj));

// ----------------------------------------------------------------------
// FORM COMPONENT: QUESTION EDITOR (Aligned with DB Schema)
// ----------------------------------------------------------------------
function QuestionForm({ initialData, onSave, onCancel }: any) {
    const [formData, setFormData] = useState(initialData);

    // Ensure options array exists
    if (!formData.options) formData.options = [];

    const updateField = (field: string, val: any) => {
        setFormData({ ...formData, [field]: val });
    };

    const updateOption = (idx: number, field: string, val: string) => {
        const newOpts = [...formData.options];
        newOpts[idx][field] = val;
        setFormData({ ...formData, options: newOpts });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: "New Option", description: "", value: "TargetValue" }]
        });
    };

    const removeOption = (idx: number) => {
        const newOpts = [...formData.options];
        newOpts.splice(idx, 1);
        setFormData({ ...formData, options: newOpts });
    };

    return (
        <div className="space-y-6 border p-6 rounded-lg bg-background shadow-sm">
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-bold text-lg">
                    {initialData._id ? "Edit Question" : "Create Question"}
                </h3>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={() => onSave(formData)}>Save Changes</Button>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                        <Label>Factor ID (Key)</Label>
                        <Input
                            placeholder="e.g. project_size"
                            value={formData.id || ""}
                            onChange={e => updateField("id", e.target.value)}
                            className="font-mono bg-muted/30"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Must match Method attribute keys.</p>
                    </div>
                    <div className="col-span-3">
                        <Label>Question Text</Label>
                        <Input
                            placeholder="e.g. What is the team size?"
                            value={formData.question || ""}
                            onChange={e => updateField("question", e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Label>Description / Help Text</Label>
                    <Textarea
                        placeholder="Additional context displayed to the user..."
                        value={formData.description || ""}
                        onChange={e => updateField("description", e.target.value)}
                        className="h-20"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-base">Answer Options</Label>
                <div className="space-y-3">
                    {formData.options.map((opt: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-start border p-3 rounded-md bg-muted/10">
                            <div className="col-span-3">
                                <Label className="text-xs text-muted-foreground">Label</Label>
                                <Input
                                    placeholder="Display Text"
                                    value={opt.text}
                                    onChange={e => updateOption(idx, 'text', e.target.value)}
                                />
                            </div>
                            <div className="col-span-3">
                                <Label className="text-xs text-muted-foreground">Scoring Value</Label>
                                <Input
                                    placeholder="Matches Method Attribute"
                                    value={opt.value || opt.factorValue || ""}
                                    onChange={e => updateOption(idx, 'value', e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                            <div className="col-span-5">
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <Input
                                    placeholder="Tooltip / Details"
                                    value={opt.description}
                                    onChange={e => updateOption(idx, 'description', e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 flex justify-end pt-5">
                                <Button variant="ghost" size="icon" onClick={() => removeOption(idx)} className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full border-dashed">
                    <Plus className="h-3 w-3 mr-2" /> Add Option Row
                </Button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// FORM COMPONENT: METHODOLOGY EDITOR
// ----------------------------------------------------------------------
function MethodForm({ initialData, onSave, onCancel }: any) {
    const [formData, setFormData] = useState(initialData);
    const [attributesList, setAttributesList] = useState(
        Object.entries(initialData.attributes || {}).map(([key, value]) => ({ key, value }))
    );

    const updateField = (field: string, val: any) => {
        setFormData({ ...formData, [field]: val });
    };

    const updateAttr = (idx: number, field: 'key' | 'value', val: any) => {
        const newList = [...attributesList];
        // @ts-ignore
        newList[idx][field] = val;
        setAttributesList(newList);
    };

    const addAttr = () => {
        setAttributesList([...attributesList, { key: "", value: "" }]);
    };

    const removeAttr = (idx: number) => {
        const newList = [...attributesList];
        newList.splice(idx, 1);
        setAttributesList(newList);
    };

    const handleSave = () => {
        const attrObj: any = {};
        attributesList.forEach((item: any) => {
            if (item.key.trim()) attrObj[item.key.trim()] = item.value;
        });
        onSave({ ...formData, attributes: attrObj });
    };

    return (
        <div className="space-y-6 border p-6 rounded-lg bg-background shadow-sm">
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-bold text-lg">
                    {initialData._id ? "Edit Methodology" : "Create Methodology"}
                </h3>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>

            <div className="grid gap-4">
                <div>
                    <Label>Method Name</Label>
                    <Input
                        value={formData.name || ""}
                        onChange={e => updateField("name", e.target.value)}
                        className="text-lg font-semibold"
                    />
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea
                        value={formData.description || ""}
                        onChange={e => updateField("description", e.target.value)}
                        className="h-24"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-base">Scoring Attributes</Label>
                <div className="grid grid-cols-2 gap-4">
                    {attributesList.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center border p-2 rounded-md bg-muted/10">
                            <div className="flex-1">
                                <Label className="text-[10px] text-muted-foreground uppercase">Factor</Label>
                                <Input
                                    value={item.key}
                                    onChange={e => updateAttr(idx, 'key', e.target.value)}
                                    className="font-mono text-sm h-8"
                                    placeholder="e.g. project_size"
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="text-[10px] text-muted-foreground uppercase">Target Match</Label>
                                <Input
                                    value={item.value}
                                    onChange={e => updateAttr(idx, 'value', e.target.value)}
                                    className="text-sm h-8"
                                    placeholder="e.g. Small, Medium"
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeAttr(idx)} className="mt-4 h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addAttr} className="w-full border-dashed">
                    <Plus className="h-3 w-3 mr-2" /> Add Attribute Factor
                </Button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// DATA EDITOR CONTAINER
// ----------------------------------------------------------------------
function DataEditor({ type, title }: { type: "questions" | "methods", title: string }) {
    const [data, setData] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const loadData = async () => {
        const res = await fetch(`/api/admin/data/${type}`);
        if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json)) setData(json);
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        const res = await fetch(`/api/admin/data/${type}/${id}`, { method: "DELETE" });
        if (res.ok) loadData();
    };

    const saveItem = async (itemData: any) => {
        try {
            const payload = { ...itemData };
            if (payload._id === "new") delete payload._id;

            const res = await fetch(`/api/admin/data/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setEditingItem(null);
                loadData();
            } else {
                alert("Failed to save. Check server logs.");
            }
        } catch (e) {
            alert("Error saving data");
        }
    };

    const addNew = () => {
        const template = type === 'questions'
            ? { _id: "new", id: "new_id", question: "", category: "General", options: [] }
            : { _id: "new", name: "", description: "", attributes: {} };
        setEditingItem(template);
    };

    useEffect(() => { loadData(); }, [type]);

    if (editingItem) {
        return type === 'questions' ? (
            <QuestionForm initialData={editingItem} onSave={saveItem} onCancel={() => setEditingItem(null)} />
        ) : (
            <MethodForm initialData={editingItem} onSave={saveItem} onCancel={() => setEditingItem(null)} />
        );
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{title} ({data.length})</h3>
                <Button onClick={addNew} size="sm"><Plus className="h-4 w-4 mr-2" /> Add New</Button>
            </div>

            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item._id} className="border p-4 rounded-lg bg-card hover:bg-accent/5 flex justify-between items-start group">
                        <div className="space-y-1">
                            <div className="font-bold flex items-center gap-2">
                                {/* Display 'question' for questions, 'name' for methods */}
                                {item.question || item.name}
                                {item.id && <Badge variant="outline" className="font-mono text-[10px]">{item.id}</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                            </div>
                            {type === 'questions' && (
                                <div className="text-xs text-muted-foreground mt-2 flex gap-2">
                                    <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                                    <span>{(item.options || []).length} Options</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button onClick={() => setEditingItem(item)} variant="outline" size="sm">Edit</Button>
                            <Button onClick={() => deleteItem(item._id)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function AdminPage() {
    const [summary, setSummary] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);

    const fetchData = async () => {
        fetch("/api/admin/summary").then(r => r.json()).then(d => d.success && setSummary(d.summary));
        fetch("/api/admin/users").then(r => r.json()).then(d => d.success && setUsers(d.users));
        fetch("/api/admin/answers").then(r => r.json()).then(d => d.success && setAnswers(d.answers));
    };

    useEffect(() => { fetchData(); }, []);

    const handleReset = async () => {
        if (!confirm("Reset all history?")) return;
        await fetch("/api/admin/reset/answers", { method: "DELETE" });
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">System Overview</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = "/"}>Exit</Button>
                </div>

                {/* Summary */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-6">
                            <div className="text-3xl font-bold">{summary.users_count}</div>
                            <div className="text-sm text-muted-foreground font-medium">Users</div>
                        </Card>
                        <Card className="p-6">
                            <div className="text-3xl font-bold">{summary.answers_count}</div>
                            <div className="text-sm text-muted-foreground font-medium">Assessments</div>
                        </Card>
                        <Card className="p-6">
                            <div className="text-3xl font-bold">{summary.questions_count}</div>
                            <div className="text-sm text-muted-foreground font-medium">Questions</div>
                        </Card>
                        <Card className="p-6">
                            <div className="text-3xl font-bold">{summary.methods_count}</div>
                            <div className="text-sm text-muted-foreground font-medium">Methods</div>
                        </Card>
                    </div>
                )}

                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-background border">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="answers">Assessments</TabsTrigger>
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="methods">Methods</TabsTrigger>
                        <TabsTrigger value="actions">System</TabsTrigger>
                    </TabsList>

                    {/* USERS TAB */}
                    <TabsContent value="users">
                        <Card className="p-6">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-xl font-semibold">Registered Users</h3>
                                <Button size="sm" variant="outline" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
                            </div>
                            <div className="space-y-4">
                                {users.map(u => (
                                    <div key={u._id} className="flex justify-between items-center border-b pb-4 last:border-0 hover:bg-muted/5 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-4">
                                            {/* ⬇️ FIXED: Prevent squishing */}
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {u.fullName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    {u.fullName}
                                                    {u.role === 'admin' && <Badge variant="destructive" className="text-[10px]">ADMIN</Badge>}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{u.email} {u.company && `• ${u.company}`}</div>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            <div>Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                                            <div className="font-mono opacity-50">{u._id}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* ASSESSMENTS TAB */}
                    <TabsContent value="answers">
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-6">Assessment History</h3>
                            <div className="space-y-4">
                                {answers.length === 0 ? <p className="text-muted-foreground">No records found.</p> : answers.map((entry) => (
                                    <div key={entry.id} className="border rounded-lg p-4 bg-card shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-lg">{entry.projectName || "Untitled Project"}</span>
                                                    <Badge variant="secondary">{entry.topMethod}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    ID: <span className="font-mono">{entry.id}</span> • User: {entry.userId} • {new Date(entry.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">
                                                    {typeof entry.score === 'number' ? (entry.score * 100).toFixed(0) : 0}%
                                                </div>
                                                <div className="text-xs text-muted-foreground">Match Score</div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
                                            <div>
                                                <h4 className="font-semibold text-sm mb-2 text-muted-foreground flex items-center gap-2"><FileText className="h-3 w-3" /> User Inputs</h4>
                                                <ul className="space-y-1 max-h-40 overflow-y-auto pr-2">
                                                    {safeEntries(entry.fullRecord?.answers).map(([q, a]) => (
                                                        <li key={q} className="flex justify-between text-xs border-b border-border/40 pb-1 mb-1">
                                                            <span className="truncate w-3/4 opacity-80" title={q}>{q}</span>
                                                            <span className="font-medium">{String(a)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-2 text-muted-foreground flex items-center gap-2"><LayoutDashboard className="h-3 w-3" /> Ranking</h4>
                                                <ul className="space-y-1">
                                                    {(entry.fullRecord?.results || [])
                                                        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
                                                        .slice(0, 5)
                                                        .map((r: any, i: number) => (
                                                            <li key={i} className="flex justify-between text-xs p-1 rounded hover:bg-muted">
                                                                <span>{i + 1}. {r.method}</span>
                                                                <span className="font-mono">{(r.score * 100).toFixed(1)}%</span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* QUESTIONS EDITOR */}
                    <TabsContent value="questions">
                        <DataEditor type="questions" title="Question Library" />
                    </TabsContent>

                    {/* METHODS EDITOR */}
                    <TabsContent value="methods">
                        <DataEditor type="methods" title="Methodology Library" />
                    </TabsContent>

                    {/* ACTIONS */}
                    <TabsContent value="actions">
                        <Card className="p-6 border-destructive/20 bg-destructive/5">
                            <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Permanently remove all assessment results. Users and configurations will remain.</p>
                                <Button variant="destructive" onClick={handleReset}>Clear All Assessments</Button>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
