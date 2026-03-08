import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuffixInput } from "@/components/ui/SuffixInput";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert } from "@/components/ui/alert";
import { Banner } from "@/components/ui/banner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
  DialogTrigger,
  FullscreenDialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSkeleton } from "@/components/ui/loading-spinner";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconButtonWithTooltip } from "@/components/ui/icon-button-with-tooltip";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import { getTooltipText } from "@/utils/tooltipText";
import { toast } from "sonner";
import {
  Home,
  Settings,
  User,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TrainingCard } from "@/components/TrainingCard";
import type { TrainingVideo } from "@/components/TrainingCard";
interface ComponentsGalleryProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}
export const ComponentsGallery = ({ userName, userEmail, onLogout }: ComponentsGalleryProps) => {
  const [switchValue, setSwitchValue] = useState(false);
  const [twoOptionToggle, setTwoOptionToggle] = useState<string>("light");
  const [multiOptionToggle, setMultiOptionToggle] = useState<string>("medium");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState("");
  const [checkboxGroupValue, setCheckboxGroupValue] = useState<string[]>(["option1"]);
  const [progress, setProgress] = useState(33);
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());
  const [alertDemo, setAlertDemo] = useState<"info" | "success" | "warning" | "error" | null>(null);
  const [dismissibleBannerVisible, setDismissibleBannerVisible] = useState(true);

  const tableData = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      department: "101",
    },
    {
      name: "Bob Wilson",
      email: "bob@example.com",
      department: "205",
    },
    {
      name: "Carol Smith",
      email: "carol@example.com",
      department: "150",
    },
    {
      name: "David Brown",
      email: "david@example.com",
      department: "89",
    },
    {
      name: "Emma Davis",
      email: "emma@example.com",
      department: "312",
    },
  ];
  const sortedData = [...tableData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];

    // Handle numerical sorting for department column
    if (sortColumn === "department") {
      const aNum = parseInt(aValue);
      const bNum = parseInt(bValue);
      let comparison = aNum - bNum;
      // Secondary sort: alphabetical by name when department is the same
      if (comparison === 0) {
        comparison = a.name.localeCompare(b.name);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    }

    // String sorting for other columns
    let comparison = aValue.localeCompare(bValue);
    // Secondary sort: alphabetical by name when primary column values are the same
    if (comparison === 0 && sortColumn !== "name") {
      comparison = a.name.localeCompare(b.name);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const showToast = (type: "default" | "success" | "warning") => {
    switch (type) {
      case "success":
        toast.success("Success!", { description: "This is a success message." });
        break;
      case "warning":
        toast.warning("Warning!", { description: "This is a warning message." });
        break;
      default:
        toast.info("Info", { description: "This is an info message." });
    }
  };
  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };
  const toggleEmployeeExpanded = (employeeId: string) => {
    setExpandedEmployees((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(employeeId)) {
        newExpanded.delete(employeeId);
      } else {
        newExpanded.add(employeeId);
      }
      return newExpanded;
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header userRole="admin" userName={userName} userEmail={userEmail} onLogout={onLogout} />

      {/* Fixed sidebar navigation */}
      <nav className="hidden lg:block fixed top-24 right-6 w-[200px] z-40">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-2">Components</h3>
          <ul className="space-y-0.5">
            {[
              { href: "#avatars", label: "Avatars" },
              { href: "#badges", label: "Badges" },
              { href: "#buttons", label: "Buttons" },
              { href: "#cards", label: "Cards" },
              { href: "#color-palette", label: "Color Palette" },
              { href: "#dialogs", label: "Dialogs" },
              { href: "#form-controls", label: "Form Controls" },
              { href: "#icons", label: "Icons" },
              { href: "#loading-states", label: "Loading States" },
              { href: "#notifications", label: "Notifications" },
              { href: "#progress", label: "Progress" },
              { href: "#shadows", label: "Shadows" },
              { href: "#tables", label: "Tables" },
              { href: "#tabs", label: "Tabs" },
              { href: "#tooltips", label: "Tooltips" },
              { href: "#typography", label: "Typography" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block text-sm text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-2">App Specific</h3>
          <ul className="space-y-0.5">
            {[
              { href: "#training-cards", label: "Training Cards" },
              { href: "#badge-rules", label: "Badge Rules" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block text-sm text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="px-4 py-8 space-y-6 lg:mr-[220px] max-w-[1400px] mx-auto">
        {/* Color Palette Section */}
        <Card id="color-palette" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Design system color tokens and semantic colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary & Secondary Colors */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-bold uppercase text-primary">Primary & Secondary</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Primary</div>
                      <div className="text-caption text-muted-foreground">--primary</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Secondary</div>
                      <div className="text-caption text-muted-foreground">--secondary</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Colors */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-bold uppercase text-primary">Status Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-success border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Success</div>
                      <div className="text-caption text-muted-foreground">--success</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-warning border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Warning</div>
                      <div className="text-caption text-muted-foreground">--warning</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-destructive border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Destructive</div>
                      <div className="text-caption text-muted-foreground">--destructive</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* UI Colors */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-bold uppercase text-primary">UI Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background-main border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Background Main</div>
                      <div className="text-caption text-muted-foreground">--background-main</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background-header border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Background Header</div>
                      <div className="text-caption text-muted-foreground">--background-header</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background-header-admin border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Background Header Admin</div>
                      <div className="text-caption text-muted-foreground">--background-header-admin</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background-primary border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Background Primary</div>
                      <div className="text-caption text-muted-foreground">--background-primary</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background-muted border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Background Muted</div>
                      <div className="text-caption text-muted-foreground">--background-muted</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-card border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Card</div>
                      <div className="text-caption text-muted-foreground">--card</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Muted</div>
                      <div className="text-caption text-muted-foreground">--muted</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Colors */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-bold uppercase text-primary">Text Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center">
                      <div className="w-6 h-6 bg-foreground rounded-sm shadow-sm"></div>
                    </div>
                    <div>
                      <div className="text-body-sm font-medium">Foreground</div>
                      <div className="text-caption text-muted-foreground">--foreground</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-background border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center">
                      <div className="w-6 h-6 bg-muted-foreground rounded-sm shadow-sm"></div>
                    </div>
                    <div>
                      <div className="text-body-sm font-medium">Muted Foreground</div>
                      <div className="text-caption text-muted-foreground">--muted-foreground</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary-foreground rounded-sm shadow-sm"></div>
                    </div>
                    <div>
                      <div className="text-body-sm font-medium">Primary Foreground</div>
                      <div className="text-caption text-muted-foreground">--primary-foreground</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center">
                      <div className="w-6 h-6 bg-secondary-foreground rounded-sm shadow-sm"></div>
                    </div>
                    <div>
                      <div className="text-body-sm font-medium">Secondary Foreground</div>
                      <div className="text-caption text-muted-foreground">--secondary-foreground</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Border & Input Colors */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-bold uppercase text-primary">Border & Input</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-border-primary border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Border Primary</div>
                      <div className="text-caption text-muted-foreground">--border-primary</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-border-secondary border border-border-secondary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Border Secondary</div>
                      <div className="text-caption text-muted-foreground">--border-secondary</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-input border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Input</div>
                      <div className="text-caption text-muted-foreground">--input</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-accent border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Accent</div>
                      <div className="text-caption text-muted-foreground">--accent</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-ring border border-border-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"></div>
                    <div>
                      <div className="text-body-sm font-medium">Ring</div>
                      <div className="text-caption text-muted-foreground">--ring</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Typography Section — Major Second (1.125) Scale */}
        <Card id="typography" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Major Second (1.125) type scale — 16px base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg p-6 border border-border-primary/50 shadow-sm">
              {/* Display — .text-display (~37px) — hero sections only */}
              <div className="flex items-baseline gap-2">
                <span className="text-display">Display</span>
                <span className="text-body-sm text-muted-foreground">(~37px / 2.281rem)</span>
              </div>
              <p className="text-body-sm text-muted-foreground -mt-2 ml-1">Hero sections, major page titles, strategic emphasis only. Use <code className="text-code bg-muted px-1 py-0.5 rounded">.text-display</code> — no HTML tag mapping.</p>

              <Separator />

              {/* Headings — use bare HTML tags, sized by global CSS */}
              <div className="flex items-baseline gap-2">
                <h1>Heading 1</h1>
                <span className="text-body-sm text-muted-foreground">(~29px / 1.802rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h2>Heading 2</h2>
                <span className="text-body-sm text-muted-foreground">(~26px / 1.602rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3>Heading 3</h3>
                <span className="text-body-sm text-muted-foreground">(~23px / 1.424rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h4>Heading 4</h4>
                <span className="text-body-sm text-muted-foreground">(~20px / 1.266rem)</span>
              </div>

              <Separator />

              {/* Body — .text-body (1rem / 16px) */}
              <div className="flex items-baseline gap-2">
                <p className="text-body">Body text — Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <span className="text-body-sm text-muted-foreground">(16px / 1rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-body font-medium">Body text medium — Lorem ipsum dolor sit amet.</p>
                <span className="text-body-sm text-muted-foreground">(16px / 1rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-body font-bold">Body text bold — Lorem ipsum dolor sit amet.</p>
                <span className="text-body-sm text-muted-foreground">(16px / 1rem)</span>
              </div>

              <Separator />

              {/* Body-sm — .text-body-sm (0.889rem / ~14px) */}
              <div className="flex items-baseline gap-2">
                <p className="text-body-sm text-muted-foreground">Small text — Secondary information</p>
                <span className="text-body-sm text-muted-foreground">(~14px / 0.889rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-body-sm text-muted-foreground font-medium">
                  Small text medium — Secondary information
                </p>
                <span className="text-body-sm text-muted-foreground">(~14px / 0.889rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-body-sm text-muted-foreground font-bold">Small text bold — Secondary information</p>
                <span className="text-body-sm text-muted-foreground">(~14px / 0.889rem)</span>
              </div>

              <Separator />

              {/* Caption — .text-caption (0.79rem / ~13px) */}
              <div className="flex items-baseline gap-2">
                <p className="text-caption text-muted-foreground">Caption text — Labels and captions</p>
                <span className="text-body-sm text-muted-foreground">(~13px / 0.79rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-caption text-muted-foreground font-medium">
                  Caption text medium — Labels and captions
                </p>
                <span className="text-body-sm text-muted-foreground">(~13px / 0.79rem)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-caption text-muted-foreground font-bold">Caption text bold — Labels and captions</p>
                <span className="text-body-sm text-muted-foreground">(~13px / 0.79rem)</span>
              </div>

              <Separator />

              {/* Code — .text-code (0.875rem / 14px) */}
              <div className="flex items-baseline gap-2">
                <code className="text-code bg-muted px-2 py-1 rounded shadow-sm border border-border-primary/30">
                  Code snippet
                </code>
                <span className="text-body-sm text-muted-foreground">(14px / 0.875rem)</span>
              </div>
            </div>

            {/* Font Weights */}
            <h3 id="font-weights" className="font-semibold pt-2">Font Weights</h3>
            <p className="text-body-sm text-muted-foreground">Available font weight utilities — use to control emphasis and hierarchy</p>
            <div className="space-y-4 rounded-lg p-6 border border-border-primary/50 shadow-sm">
              {([
                { cls: "font-light", weight: "300", label: "Light" },
                { cls: "font-normal", weight: "400", label: "Normal" },
                { cls: "font-medium", weight: "500", label: "Medium" },
                { cls: "font-semibold", weight: "600", label: "Semibold" },
                { cls: "font-bold", weight: "700", label: "Bold" },
              ] as const).map(({ cls, weight, label }) => (
                <div key={cls} className="flex items-baseline gap-4">
                  <p className={`text-body-lg ${cls} flex-1`}>
                    {label} — The quick brown fox jumps over the lazy dog.
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <code className="text-code bg-muted px-1.5 py-0.5 rounded">.{cls}</code>
                    <span className="text-body-sm text-muted-foreground">({weight})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Typography Utility Classes */}
            <h3 id="typography-utilities" className="font-semibold pt-2">Typography Utility Classes</h3>
            <p className="text-body-sm text-muted-foreground">
              Visual overrides for semantic tags using the Major Second (1.125) scale. Use semantic HTML tags (h1-h4, p) by
              default. Apply these utility classes only when a visual override is needed.
            </p>
            {/* Reference Table */}
            <div className="rounded-lg border border-border-primary/50 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground">Class Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Size (rem)</TableHead>
                    <TableHead className="font-semibold text-foreground">Size (px)</TableHead>
                    <TableHead className="font-semibold text-foreground">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-display</code>
                    </TableCell>
                    <TableCell>2.281rem</TableCell>
                    <TableCell>~37px</TableCell>
                    <TableCell>Hero sections, major page titles (strategic use only)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-h1</code>
                    </TableCell>
                    <TableCell>1.802rem</TableCell>
                    <TableCell>~29px</TableCell>
                    <TableCell>Page titles (visual override)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-h2</code>
                    </TableCell>
                    <TableCell>1.602rem</TableCell>
                    <TableCell>~26px</TableCell>
                    <TableCell>Section headings (visual override)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-h3</code>
                    </TableCell>
                    <TableCell>1.424rem</TableCell>
                    <TableCell>~23px</TableCell>
                    <TableCell>Subsection headings (visual override)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-h4</code>
                    </TableCell>
                    <TableCell>1.266rem</TableCell>
                    <TableCell>~20px</TableCell>
                    <TableCell>Minor headings (visual override)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-body</code>
                    </TableCell>
                    <TableCell>1rem</TableCell>
                    <TableCell>16px</TableCell>
                    <TableCell>Body text</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-body-sm</code>
                    </TableCell>
                    <TableCell>0.889rem</TableCell>
                    <TableCell>~14px</TableCell>
                    <TableCell>Secondary info</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-sm</code>
                    </TableCell>
                    <TableCell>0.875rem</TableCell>
                    <TableCell>14px</TableCell>
                    <TableCell>Table headers</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-caption</code>
                    </TableCell>
                    <TableCell>0.79rem</TableCell>
                    <TableCell>~13px</TableCell>
                    <TableCell>Captions and labels</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code className="text-code bg-muted px-1.5 py-0.5 rounded">.text-code</code>
                    </TableCell>
                    <TableCell>0.875rem</TableCell>
                    <TableCell>14px</TableCell>
                    <TableCell>Code snippets (monospace, matches text-sm)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Buttons Section */}
        <Card id="buttons" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Button Component</CardTitle>
            <CardDescription>Comprehensive guidelines for button variants, sizes, states, and usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="variants">
              <TabsList className="shadow-sm">
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="sizes">Sizes</TabsTrigger>
                <TabsTrigger value="states">Interactive States</TabsTrigger>
                <TabsTrigger value="icons">With Icons</TabsTrigger>
              </TabsList>

              {/* Variants */}
              <TabsContent value="variants" className="space-y-4">
                <p className="text-muted-foreground">Six button variants for different semantic meanings and visual hierarchy</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {([
                    { variant: undefined, label: "Default", desc: "Primary actions, main CTAs", code: 'variant="default"' },
                    { variant: "secondary" as const, label: "Secondary", desc: "Secondary actions", code: 'variant="secondary"' },
                    { variant: "destructive" as const, label: "Destructive", desc: "Delete, remove, dangerous actions", code: 'variant="destructive"' },
                    { variant: "outline" as const, label: "Outline", desc: "Tertiary actions, filters", code: 'variant="outline"' },
                    { variant: "ghost" as const, label: "Ghost", desc: "Subtle actions, menu items", code: 'variant="ghost"' },
                    { variant: "link" as const, label: "Link", desc: "Text links, inline actions", code: 'variant="link"' },
                  ] as const).map(({ variant, label, desc, code }) => (
                    <div key={code} className="flex flex-col gap-3">
                      <Button variant={variant}>{label}</Button>
                      <code className="text-[0.8125rem] text-muted-foreground font-mono bg-muted px-2 py-1.5 rounded-md whitespace-nowrap overflow-x-auto">{code}</code>
                      <p className="text-[0.8125rem] text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Sizes */}
              <TabsContent value="sizes" className="space-y-4">
                <p className="text-muted-foreground">Four size options to match different UI contexts</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {([
                    { size: "sm" as const, label: "Small", desc: "32px height, compact spaces", code: 'size="sm"' },
                    { size: "default" as const, label: "Default", desc: "36px height, standard", code: 'size="default"' },
                    { size: "lg" as const, label: "Large", desc: "40px height, emphasis", code: 'size="lg"' },
                  ] as const).map(({ size, label, desc, code }) => (
                    <div key={code} className="flex flex-col gap-3">
                      <div><Button size={size}>{label}</Button></div>
                      <code className="text-[0.8125rem] text-muted-foreground font-mono bg-muted px-2 py-1.5 rounded-md">{code}</code>
                      <p className="text-[0.8125rem] text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                  <div className="flex flex-col gap-3">
                    <div>
                      <Button size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <code className="text-[0.8125rem] text-muted-foreground font-mono bg-muted px-2 py-1.5 rounded-md">size="icon"</code>
                    <p className="text-[0.8125rem] text-muted-foreground">36×36px, icons only</p>
                  </div>
                </div>
              </TabsContent>

              {/* Interactive States */}
              <TabsContent value="states" className="space-y-4">
                <p className="text-muted-foreground">All button states across different variants</p>
                {([
                  { variant: undefined, name: "Default" },
                  { variant: "secondary" as const, name: "Secondary" },
                  { variant: "destructive" as const, name: "Destructive" },
                  { variant: "outline" as const, name: "Outline" },
                  { variant: "ghost" as const, name: "Ghost" },
                  { variant: "link" as const, name: "Link" },
                ] as const).map(({ variant, name }) => (
                  <div key={name}>
                    <h4 className="text-body font-medium mb-4 text-foreground">{name} Variant</h4>
                    <div className="grid grid-cols-6 gap-4 items-center mb-6">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Variant</div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Normal</div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Hover</div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Active</div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Focus</div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Disabled</div>

                      <div className="font-medium text-foreground">{name}</div>
                      <div className="flex justify-center">
                        <Button variant={variant}>{name === "Link" ? "Link" : name === "Destructive" ? "Delete" : "Button"}</Button>
                      </div>
                      <div className="flex justify-center">
                        <Button variant={variant} className={
                          variant === "outline" ? "bg-muted border-muted-foreground/40" :
                          variant === "ghost" ? "bg-muted" :
                          variant === "link" ? "text-primary/80" :
                          "opacity-80"
                        }>{name === "Link" ? "Link" : name === "Destructive" ? "Delete" : "Button"}</Button>
                      </div>
                      <div className="flex justify-center">
                        <Button variant={variant} className="scale-[0.98]">{name === "Link" ? "Link" : name === "Destructive" ? "Delete" : "Button"}</Button>
                      </div>
                      <div className="flex justify-center">
                        <Button variant={variant} className="ring-2 ring-ring ring-offset-2">{name === "Link" ? "Link" : name === "Destructive" ? "Delete" : "Button"}</Button>
                      </div>
                      <div className="flex justify-center">
                        <Button variant={variant} disabled>{name === "Link" ? "Link" : name === "Destructive" ? "Delete" : "Button"}</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* With Icons */}
              <TabsContent value="icons" className="space-y-6">
                <p className="text-muted-foreground">Icons enhance button meaning and visual clarity</p>

                <div>
                  <h4 className="text-body font-medium mb-4 text-foreground">Text + Icon</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button variant="ghost">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-body font-medium mb-4 text-foreground">Icon Only (size="icon")</h4>
                  <div className="grid grid-cols-5 sm:grid-cols-5 gap-5 max-w-lg">
                    {([
                      { variant: undefined, icon: Plus, label: "default" },
                      { variant: "outline" as const, icon: Edit, label: "outline" },
                      { variant: "destructive" as const, icon: Trash2, label: "destructive" },
                      { variant: "ghost" as const, icon: Settings, label: "ghost" },
                      { variant: "secondary" as const, icon: Download, label: "secondary" },
                    ] as const).map(({ variant, icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <Button size="icon" variant={variant}>
                          <Icon className="w-4 h-4" />
                        </Button>
                        <span className="text-[0.8125rem] text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Form Controls Section */}
        <Card id="form-controls" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Form Controls</CardTitle>
            <CardDescription>Input fields and form elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Form Section Header */}
            <div className="rounded-lg p-6 border border-border-primary/50 shadow-sm space-y-1">
              <h4 className="text-body font-bold text-foreground mb-3">Form Section Header</h4>
              <p className="text-body-sm text-muted-foreground mb-4">
                Use to label groups of related form fields. Apply the single
                <code className="text-code bg-muted px-1 py-0.5 rounded">.form-section-header</code> class — no
                additional utilities needed.
              </p>
              <div className="rounded-md bg-card/50 p-4">
                <h3 className="form-section-header !mt-0">Contact Information</h3>
                <Input placeholder="Enter your email..." className="shadow-sm" />

                <h3 className="form-section-header">Administrative Settings</h3>
                <Input placeholder="Enter department..." className="shadow-sm" />
              </div>
            </div>
            <div className="rounded-lg p-6 border border-border-primary/50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">Text Input</Label>
                    <Input
                      id="text-input"
                      placeholder="Enter text here..."
                      className="shadow-sm hover:shadow-md transition-shadow"
                    />
                  </div>
                  <div>
                    <Label htmlFor="disabled-input">Disabled Input</Label>
                    <Input id="disabled-input" placeholder="Disabled input" disabled className="shadow-sm" />
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="helper-input">Email Address</Label>
                      <p className="form-helper-text">We'll use this to send you login instructions.</p>
                    </div>
                    <Input
                      id="helper-input"
                      placeholder="you@example.com"
                      className="shadow-sm hover:shadow-md transition-shadow"
                    />
                    <p className="form-additional-text">Must be a valid company email address.</p>
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="textarea">Textarea</Label>
                      <p className="form-helper-text">Provide as much detail as possible.</p>
                    </div>
                    <Textarea
                      id="textarea"
                      placeholder="Enter longer text here..."
                      className="shadow-sm hover:shadow-md transition-shadow"
                    />
                    <p className="form-additional-text">Maximum 500 characters recommended.</p>
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="suffix-input">Input with Suffix</Label>
                      <p className="form-helper-text">Appends a unit label inside the field.</p>
                    </div>
                    <SuffixInput id="suffix-input" suffix="seconds" placeholder="60" className="max-w-[180px]" />
                    <p className="form-additional-text">Use for numeric fields that require a unit indicator.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-card/50 shadow-sm space-y-3">
                    <div>
                      <Label className="text-body-sm mb-2 block">Binary Switch (On/Off)</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="switch" checked={switchValue} onCheckedChange={setSwitchValue} />
                        <Label htmlFor="switch" className="font-normal">Enable notifications</Label>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="mb-2 block">Two-Option Toggle</Label>
                      <ToggleGroup
                        type="single"
                        value={twoOptionToggle}
                        onValueChange={(value) => value && setTwoOptionToggle(value)}
                        variant="pill"
                        size="pill"
                        className="justify-start"
                      >
                        <ToggleGroupItem value="light" aria-label="Light mode">
                          Light
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Dark mode">
                          Dark
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <Separator />

                    <div>
                      <Label className="mb-2 block">Multi-Option Toggle</Label>
                      <ToggleGroup
                        type="single"
                        value={multiOptionToggle}
                        onValueChange={(value) => value && setMultiOptionToggle(value)}
                        variant="pill"
                        size="pill"
                        className="justify-start"
                      >
                        <ToggleGroupItem value="small" aria-label="Small size">
                          Small
                        </ToggleGroupItem>
                        <ToggleGroupItem value="medium" aria-label="Medium size">
                          Medium
                        </ToggleGroupItem>
                        <ToggleGroupItem value="large" aria-label="Large size">
                          Large
                        </ToggleGroupItem>
                        <ToggleGroupItem value="xl" aria-label="Extra large size">
                          XL
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-md bg-card/50 shadow-sm">
                    <Checkbox
                      id="checkbox"
                      checked={checkboxValue}
                      onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
                    />
                    <Label htmlFor="checkbox" className="font-normal">Checkbox</Label>
                  </div>

                  <div>
                    <Label className="mb-2 block">Radio Button Group</Label>
                    <RadioGroup
                      value={radioValue}
                      onValueChange={setRadioValue}
                      className="p-3 rounded-md bg-card/50 shadow-sm space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="size-small" />
                        <Label htmlFor="size-small" className="font-normal">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="size-medium" />
                        <Label htmlFor="size-medium" className="font-normal">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="size-large" />
                        <Label htmlFor="size-large" className="font-normal">Large</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="extra-large" id="size-xl" />
                        <Label htmlFor="size-xl" className="font-normal">Extra Large</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="mb-2 block">Checkbox Group</Label>
                    <div className="p-3 rounded-md bg-card/50 shadow-sm space-y-3">
                      {["Newsletter", "Marketing", "Updates", "Security Alerts"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`checkbox-${option.toLowerCase().replace(" ", "-")}`}
                            checked={checkboxGroupValue.includes(option.toLowerCase().replace(" ", "-"))}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCheckboxGroupValue((prev) => [...prev, option.toLowerCase().replace(" ", "-")]);
                              } else {
                                setCheckboxGroupValue((prev) =>
                                  prev.filter((item) => item !== option.toLowerCase().replace(" ", "-")),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`checkbox-${option.toLowerCase().replace(" ", "-")}`} className="font-normal">{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div>
                      <Label>Select Dropdown</Label>
                      <p className="form-helper-text">Choose from the available options.</p>
                    </div>
                    <Select value={selectValue} onValueChange={setSelectValue}>
                      <SelectTrigger className="shadow-sm hover:shadow-md transition-shadow">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="form-additional-text">You can change this selection at any time.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Menus */}
            <div className="space-y-4">
              <h4 className="text-body-sm font-bold uppercase text-primary">Dropdown Menus</h4>
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Dropdown Menu <ChevronDown className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Menu With Icons <ChevronDown className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Menu Without Icons <ChevronDown className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Notifications ── */}
        <Card id="notifications" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Four notification types ordered by priority: Toast, Banner, Inline Banner, and Alert.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">

            {/* ── 1. Toast ── */}
            <div className="space-y-4">
              <h4 className="text-body-sm font-bold uppercase text-primary">Toast</h4>
              <p className="text-sm text-muted-foreground">
                Lightweight, non-blocking feedback. Bottom-right, auto-dismiss at 4s. Description only, no title. Use for transient confirmations that don't require user action.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => showToast("success")}>
                  Success
                </Button>
                <Button size="sm" variant="outline" onClick={() => showToast("default")}>
                  Info
                </Button>
                <Button size="sm" variant="outline" onClick={() => showToast("warning")}>
                  Warning
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Usage:</strong> <code className="text-code bg-muted px-1 py-0.5 rounded">import {"{ toast }"} from "sonner"</code></p>
                <p><code className="text-code bg-muted px-1 py-0.5 rounded">toast.success("Success", {"{ description }"})</code> — auto-dismiss 4s</p>
                <p><code className="text-code bg-muted px-1 py-0.5 rounded">toast.info("Info", {"{ description }"})</code> — auto-dismiss 4s</p>
                <p><code className="text-code bg-muted px-1 py-0.5 rounded">toast.warning("Warning", {"{ description }"})</code> — auto-dismiss 4s</p>
                <p className="mt-2 text-xs">Error notifications should use the <code className="text-code bg-muted px-1 py-0.5 rounded">Alert</code> component instead of toast.</p>
              </div>
            </div>

            <Separator />

            {/* ── 2. Banner (page/section level) ── */}
            <div className="space-y-4">
              <h4 className="text-body-sm font-bold uppercase text-primary">Banner</h4>
              <p className="text-sm text-muted-foreground">
                Page or section-level inline alerts. Persistent, placed at the top of the page or section. Supports optional close icon, link, and action button.
              </p>

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4">Variants</h5>
              <Banner variant="info" title="Information" description="Informational banner for updates or announcements." />
              <Banner variant="success" title="Success" description="Operation completed successfully." />
              <Banner variant="warning" title="Warning" description="Important notice that requires attention." />
              <Banner variant="error" title="Error" description="Something went wrong. Please try again." />

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">With Close Icon</h5>
              {dismissibleBannerVisible ? (
                <Banner
                  variant="info"
                  title="Dismissible Banner"
                  description="Click the X to dismiss this banner."
                  dismissible
                  onDismiss={() => setDismissibleBannerVisible(false)}
                />
              ) : (
                <Button size="sm" variant="outline" onClick={() => setDismissibleBannerVisible(true)}>
                  Show Dismissible Banner
                </Button>
              )}

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">With Link (via children)</h5>
              <Banner variant="info" title="Update Available">
                <p>A new version is available. <a href="#notifications" className="underline font-medium">View release notes</a></p>
              </Banner>

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">With Action Button</h5>
              <Banner
                variant="warning"
                title="Unsaved Changes"
                description="You have unsaved changes that will be lost."
                actions={
                  <Button variant="outline" size="sm">
                    Save Now
                  </Button>
                }
              />
            </div>

            <Separator />

            {/* ── 3. Inline Banner ── */}
            <div className="space-y-4">
              <h4 className="text-body-sm font-bold uppercase text-primary">Inline Banner</h4>
              <p className="text-sm text-muted-foreground">
                Field or text-level inline alerts. Persists until the user resolves the condition. No close icon, no action button. Available in default (body text) and small (constrained) sizes, each in full-width or width-constrained layout.
              </p>

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4">Default — Full Width</h5>
              <Banner variant="info" size="compact" description="This field is optional." />
              <Banner variant="success" size="compact" description="All answers saved." />
              <Banner variant="warning" size="compact" description="Changes will take effect immediately." />
              <Banner variant="error" size="compact" description="Please fix the errors above." />

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">Default — Width Constrained</h5>
              <Banner variant="info" size="compact" description="This field is optional." className="w-fit" />

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">Small — Full Width</h5>
              <Banner variant="info" size="compact-constrained" description="This field is optional." />

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">Small — Width Constrained</h5>
              <Banner variant="info" size="compact-constrained" description="This field is optional." className="w-fit" />
            </div>

            <Separator />

            {/* ── 4. Alert (floating) ── */}
            <div className="space-y-4">
              <h4 className="text-body-sm font-bold uppercase text-primary">Alert</h4>
              <p className="text-sm text-muted-foreground">
                High-priority floating alerts. Top-centered, persistent until dismissed. Solid background with white text. Close icon required. Supports optional link and action button. Use for critical system-level messages.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setAlertDemo("success")}>
                  Success Alert
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAlertDemo("info")}>
                  Info Alert
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAlertDemo("warning")}>
                  Warning Alert
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAlertDemo("error")}>
                  Error Alert
                </Button>
              </div>

              {alertDemo && (
                <Alert
                  variant={alertDemo}
                  title={alertDemo === "success" ? "Changes Saved" : alertDemo === "info" ? "System Update" : alertDemo === "warning" ? "Session Expiring" : "Connection Lost"}
                  description={alertDemo === "success" ? "Your changes have been saved successfully." : alertDemo === "info" ? "Scheduled maintenance tonight at 10 PM." : alertDemo === "warning" ? "Your session will expire in 5 minutes." : "Unable to reach the server. Please check your connection."}
                  onDismiss={() => setAlertDemo(null)}
                />
              )}

              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-6">Static Preview (all variants)</h5>
              <div className="space-y-3">
                <div className="alert-info rounded-lg p-4">
                  <div className="flex gap-2.5">
                    <Info className="h-5 w-5 shrink-0 text-on-color" />
                    <div className="flex-1">
                      <h5 className="font-semibold leading-tight tracking-tight text-on-color mb-1.5">Info Alert</h5>
                      <div className="text-on-color/90">Informational alert with solid background.</div>
                    </div>
                  </div>
                </div>
                <div className="alert-success rounded-lg p-4">
                  <div className="flex gap-2.5">
                    <CheckCircle className="h-5 w-5 shrink-0 text-on-color" />
                    <div className="flex-1">
                      <h5 className="font-semibold leading-tight tracking-tight text-on-color mb-1.5">Success Alert</h5>
                      <div className="text-on-color/90">Success alert with solid background.</div>
                    </div>
                  </div>
                </div>
                <div className="alert-warning rounded-lg p-4">
                  <div className="flex gap-2.5">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-on-color" />
                    <div className="flex-1">
                      <h5 className="font-semibold leading-tight tracking-tight text-on-color mb-1.5">Warning Alert</h5>
                      <div className="text-on-color/90">Warning alert with solid background.</div>
                    </div>
                  </div>
                </div>
                <div className="alert-error rounded-lg p-4">
                  <div className="flex gap-2.5">
                    <XCircle className="h-5 w-5 shrink-0 text-on-color" />
                    <div className="flex-1">
                      <h5 className="font-semibold leading-tight tracking-tight text-on-color mb-1.5">Error Alert</h5>
                      <div className="text-on-color/90">Error alert with solid background.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1 mt-4">
                <p><strong>Usage:</strong> <code className="text-code bg-muted px-1 py-0.5 rounded">import {"{ Alert }"} from "@/components/ui/alert"</code></p>
                <p><code className="text-code bg-muted px-1 py-0.5 rounded">{"<Alert variant=\"error\" title=\"...\" description=\"...\" onDismiss={...} />"}</code></p>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Shadows */}
        <Card id="shadows" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Shadows</CardTitle>
            <CardDescription>Elevation tokens for consistent depth across components</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Floating elements (Toast and Alert) share the <code className="text-code bg-muted px-1 py-0.5 rounded">shadow-float</code> elevation token for consistent depth above page content.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 shadow-md text-center">
                <p className="text-xs text-muted-foreground mb-1">shadow-md</p>
                <p className="text-sm font-medium">Cards &amp; panels</p>
              </div>
              <div className="rounded-lg border p-4 shadow-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">shadow-lg</p>
                <p className="text-sm font-medium">Dropdowns &amp; popovers</p>
              </div>
              <div className="rounded-lg border p-4 shadow-float text-center">
                <p className="text-xs text-muted-foreground mb-1">shadow-float</p>
                <p className="text-sm font-medium">Toast &amp; Alert</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 mt-4">
              <p><strong>CSS variable:</strong> <code className="text-code bg-muted px-1 py-0.5 rounded">--shadow-float</code></p>
              <p><strong>Tailwind class:</strong> <code className="text-code bg-muted px-1 py-0.5 rounded">shadow-float</code></p>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card id="badges" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status and labeling components in multiple variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-body-sm font-bold uppercase text-primary mb-3">Solid Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Primary</Badge>
                    <Badge showIcon>Primary with Icon</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="secondary" showIcon>
                      Secondary with Icon
                    </Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="destructive" showIcon>
                      Destructive with Icon
                    </Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="success" showIcon>
                      Success with Icon
                    </Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="warning" showIcon>
                      Warning with Icon
                    </Badge>
                    <Badge variant="admin">Admin</Badge>
                    <Badge variant="admin" showIcon>
                      Admin with Icon
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-body-sm font-bold uppercase text-primary mb-3">Hollow Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="hollow-primary">Primary</Badge>
                    <Badge variant="hollow-primary" showIcon>
                      Primary with Icon
                    </Badge>
                    <Badge variant="hollow-secondary">Secondary</Badge>
                    <Badge variant="hollow-secondary" showIcon>
                      Secondary with Icon
                    </Badge>
                    <Badge variant="hollow-destructive">Destructive</Badge>
                    <Badge variant="hollow-destructive" showIcon>
                      Destructive with Icon
                    </Badge>
                    <Badge variant="hollow-success">Success</Badge>
                    <Badge variant="hollow-success" showIcon>
                      Success with Icon
                    </Badge>
                    <Badge variant="hollow-warning">Warning</Badge>
                    <Badge variant="hollow-warning" showIcon>
                      Warning with Icon
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-body-sm font-bold uppercase text-primary mb-3">Soft Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="soft-primary">Primary</Badge>
                    <Badge variant="soft-primary" showIcon>
                      Primary with Icon
                    </Badge>
                    <Badge variant="soft-secondary">Secondary</Badge>
                    <Badge variant="soft-secondary" showIcon>
                      Secondary with Icon
                    </Badge>
                    <Badge variant="soft-destructive">Destructive</Badge>
                    <Badge variant="soft-destructive" showIcon>
                      Destructive with Icon
                    </Badge>
                    <Badge variant="soft-success">Success</Badge>
                    <Badge variant="soft-success" showIcon>
                      Success with Icon
                    </Badge>
                    <Badge variant="soft-warning">Warning</Badge>
                    <Badge variant="soft-warning" showIcon>
                      Warning with Icon
                    </Badge>
                    <Badge variant="soft-admin">Admin</Badge>
                    <Badge variant="soft-admin" showIcon>
                      Admin with Icon
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-body-sm font-bold uppercase text-primary mb-3">Ghost Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="ghost-primary">Primary</Badge>
                    <Badge variant="ghost-primary" showIcon>
                      Primary with Icon
                    </Badge>
                    <Badge variant="ghost-secondary">Secondary</Badge>
                    <Badge variant="ghost-secondary" showIcon>
                      Secondary with Icon
                    </Badge>
                    <Badge variant="ghost-destructive">Destructive</Badge>
                    <Badge variant="ghost-destructive" showIcon>
                      Destructive with Icon
                    </Badge>
                    <Badge variant="ghost-success">Success</Badge>
                    <Badge variant="ghost-success" showIcon>
                      Success with Icon
                    </Badge>
                    <Badge variant="ghost-warning">Warning</Badge>
                    <Badge variant="ghost-warning" showIcon>
                      Warning with Icon
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card id="progress" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Progress indicators and loading states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                  -10
                </Button>
                <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                  +10
                </Button>
                <span className="text-body-sm text-muted-foreground">{progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatars */}
        <Card id="avatars">
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>User avatar components with image and fallback support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        {/* Tables */}
        <Card id="tables">
          <CardHeader>
            <CardTitle>Tables</CardTitle>
            <CardDescription>Data tables with sorting, filtering, and expandable rows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">

              <Tabs defaultValue="basic">
                <TabsList>
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="sortable">Sortable</TabsTrigger>
                  <TabsTrigger value="filtered">With Filters</TabsTrigger>
                  <TabsTrigger value="statuses">With Statuses</TabsTrigger>
                  <TabsTrigger value="accordion">Accordion</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <Table>
                    <TableCaption>A simple data table</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Jane Smith</TableCell>
                        <TableCell>jane@example.com</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="sortable" className="space-y-4">
                  <Table>
                    <TableCaption>Sortable table with interactive headers</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead
                          column="name"
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                        >
                          Name
                        </SortableTableHead>
                        <SortableTableHead
                          column="email"
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                        >
                          Email
                        </SortableTableHead>
                        <SortableTableHead
                          column="department"
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                        >
                          Department
                        </SortableTableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedData.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="filtered" className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Search by name..." className="w-[200px]" />
                  </div>
                  <Table>
                    <TableCaption>Filtered table with search and dropdown filters</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>CJ</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Charlie Jones</div>
                              <div className="text-body-sm text-muted-foreground">charlie@example.com</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="hollow-primary">Manager</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">2 hours ago</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>DM</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Diana Miller</div>
                              <div className="text-body-sm text-muted-foreground">diana@example.com</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="warning">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="hollow-secondary">User</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">1 day ago</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="statuses" className="space-y-4">
                  <Table>
                    <TableCaption>Table with various status badges and progress indicators</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                          Project
                        </TableHead>
                        <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                          Progress
                        </TableHead>
                        <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                          Priority
                        </TableHead>
                        <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                          Assignee
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div>
                            <div className="font-medium">Website Redesign</div>
                            <div className="text-body-sm text-muted-foreground">Frontend improvements</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={75} className="w-[60px]" />
                            <div className="text-caption text-muted-foreground">75%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" showIcon>
                            Complete
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">High</Badge>
                        </TableCell>
                        <TableCell>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-caption">JS</AvatarFallback>
                          </Avatar>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div>
                            <div className="font-medium">Mobile App</div>
                            <div className="text-body-sm text-muted-foreground">iOS & Android development</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={45} className="w-[60px]" />
                            <div className="text-caption text-muted-foreground">45%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="warning" showIcon>
                            In Progress
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Medium</Badge>
                        </TableCell>
                        <TableCell>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-caption">AM</AvatarFallback>
                          </Avatar>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div>
                            <div className="font-medium">API Integration</div>
                            <div className="text-body-sm text-muted-foreground">Backend services</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={20} className="w-[60px]" />
                            <div className="text-caption text-muted-foreground">20%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="hollow-destructive" showIcon>
                            Blocked
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="hollow-warning">Low</Badge>
                        </TableCell>
                        <TableCell>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-caption">RK</AvatarFallback>
                          </Avatar>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="accordion" className="space-y-4">
                  <div className="rounded-lg p-6 border border-border-primary/50 shadow-sm">
                    <h4 className="text-body-sm font-medium mb-4">Collapsible Table Rows (Admin Pattern)</h4>
                    <Table>
                      <TableCaption>Employee table with expandable rows matching admin area pattern</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                            Employee
                          </TableHead>
                          <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                            Department
                          </TableHead>
                          <TableHead className="text-caption font-medium uppercase text-muted-foreground">
                            Status
                          </TableHead>
                          <TableHead className="text-right text-caption font-medium uppercase text-muted-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            id: "emp-1",
                            name: "Alice Johnson",
                            email: "alice@example.com",
                            department: "Engineering",
                            status: "Active",
                            role: "Senior Developer",
                            location: "San Francisco, CA",
                            manager: "John Smith",
                            skills: "React, TypeScript, Node.js",
                          },
                          {
                            id: "emp-2",
                            name: "Bob Wilson",
                            email: "bob@example.com",
                            department: "Marketing",
                            status: "Active",
                            role: "Marketing Manager",
                            location: "New York, NY",
                            manager: "Sarah Lee",
                            skills: "SEO, Analytics, Content Strategy",
                          },
                          {
                            id: "emp-3",
                            name: "Carol Smith",
                            email: "carol@example.com",
                            department: "Finance",
                            status: "On Leave",
                            role: "Senior Analyst",
                            location: "Chicago, IL",
                            manager: "Michael Chen",
                            skills: "Excel, Financial Modeling",
                          },
                        ].map((employee) => {
                          const isExpanded = expandedEmployees.has(employee.id);
                          return (
                            <React.Fragment key={employee.id}>
                              <TableRow
                                className={`group transition-colors ${isExpanded ? "border-b-0 bg-muted/50" : "hover:bg-muted"}`}
                              >
                                <TableCell className="py-3">
                                  <Collapsible
                                    open={isExpanded}
                                    onOpenChange={() => toggleEmployeeExpanded(employee.id)}
                                  >
                                    <CollapsibleTrigger asChild>
                                      <div className="flex items-center gap-3 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                          )}
                                          <div>
                                            <div className="font-medium">{employee.name}</div>
                                            <div className="text-body-sm text-muted-foreground">{employee.email}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </CollapsibleTrigger>
                                  </Collapsible>
                                </TableCell>

                                <TableCell className="py-3">
                                  <Badge
                                    variant={
                                      employee.department === "Engineering"
                                        ? "default"
                                        : employee.department === "Marketing"
                                          ? "secondary"
                                          : "hollow-primary"
                                    }
                                  >
                                    {employee.department}
                                  </Badge>
                                </TableCell>

                                <TableCell className="py-3">
                                  <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                                    {employee.status}
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-right py-3">
                                  <div className="flex gap-2 justify-end">
                                    <IconButtonWithTooltip
                                      icon={Edit}
                                      tooltip={getTooltipText("edit-item", {
                                        name: "John Doe",
                                      })}
                                      onClick={() => {}}
                                    />
                                    <IconButtonWithTooltip
                                      icon={Trash2}
                                      tooltip={getTooltipText("delete-item", {
                                        name: "John Doe",
                                      })}
                                      onClick={() => {}}
                                      className="text-destructive hover:text-destructive"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>

                              {isExpanded && (
                                <TableRow className="bg-muted/50">
                                  <TableCell colSpan={4} className="py-0">
                                    <Collapsible open={isExpanded}>
                                      <CollapsibleContent>
                                        <div className="px-4 pb-4 ml-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm border-l-2 border-muted pl-4">
                                            <div className="space-y-2">
                                              <p>
                                                <strong>Role:</strong> {employee.role}
                                              </p>
                                              <p>
                                                <strong>Location:</strong> {employee.location}
                                              </p>
                                              <p>
                                                <strong>Manager:</strong> {employee.manager}
                                              </p>
                                            </div>
                                            <div className="space-y-2">
                                              <p>
                                                <strong>Skills:</strong> {employee.skills}
                                              </p>
                                              <p>
                                                <strong>Last Login:</strong>{" "}
                                                {employee.id === "emp-1"
                                                  ? "2 hours ago"
                                                  : employee.id === "emp-2"
                                                    ? "1 day ago"
                                                    : "5 days ago"}
                                              </p>
                                              <p>
                                                <strong>Start Date:</strong>{" "}
                                                {employee.id === "emp-1"
                                                  ? "January 2020"
                                                  : employee.id === "emp-2"
                                                    ? "March 2019"
                                                    : "June 2021"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

          </CardContent>
        </Card>

        {/* Loading States */}
        <Card id="loading-states">
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
            <CardDescription>Skeleton loaders and placeholder content</CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingSkeleton />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Card id="dialogs">
          <CardHeader>
            <CardTitle>Dialogs</CardTitle>
            <CardDescription>Modal dialogs, confirmation prompts, and fullscreen overlays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="shadow-sm hover:shadow-md transition-shadow">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                  </DialogHeader>
                  <DialogScrollArea>
                    <div className="space-y-4">
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>
                        Dialog content goes here. The body now automatically has proper padding while the header and
                        footer extend full width with their own backgrounds.
                      </p>
                      <p>This is the last paragraph to test scrolling behavior.</p>
                    </div>
                  </DialogScrollArea>
                  <DialogFooter>
                    <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                      Cancel
                    </Button>
                    <Button className="shadow-sm hover:shadow-md transition-shadow">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="shadow-sm hover:shadow-md transition-shadow">
                    Open Fullscreen Dialog
                  </Button>
                </DialogTrigger>
                <FullscreenDialogContent>
                  <DialogHeader>
                    <DialogTitle>Fullscreen Dialog</DialogTitle>
                  </DialogHeader>
                  <DialogScrollArea>
                    <div className="space-y-4">
                      <p>
                        This fullscreen dialog fills the entire viewport with 8px spacing on mobile and 10px on larger
                        screens.
                      </p>
                      <p>
                        It's ideal for immersive content, detailed forms, media viewers, or any content that benefits
                        from maximum screen space.
                      </p>
                      <p>
                        The transparent overlay remains visible behind the dialog, maintaining visual context of the
                        underlying page.
                      </p>
                    </div>
                  </DialogScrollArea>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button className="shadow-sm hover:shadow-md transition-shadow">Save Changes</Button>
                  </DialogFooter>
                </FullscreenDialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                    Show Alert
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Important Information</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div>
                    <p>
                      This is an example of an alert dialog. It's perfect for showing important messages that require
                      user acknowledgment.
                    </p>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="shadow-sm hover:shadow-md transition-shadow">
                    Delete Item
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div>
                    <p>This action cannot be undone. This will permanently delete your data.</p>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          </CardContent>
        </Card>

        {/* Icons Gallery */}
        <Card id="icons">
          <CardHeader>
            <CardTitle>Icons</CardTitle>
            <CardDescription>Commonly used Lucide icons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 md:grid-cols-12 gap-4">
              {[
                Home,
                Settings,
                User,
                Bell,
                Search,
                Plus,
                Edit,
                Trash2,
                Download,
                Upload,
                Eye,
                EyeOff,
                AlertCircle,
                CheckCircle,
                Info,
                X,
              ].map((Icon, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center p-3 border rounded-lg hover:bg-muted transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{Icon.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card id="cards">
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Container components for grouping content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>More card content.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Third Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Even more content.</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card-muted border-card-muted-border">
                <CardHeader>
                  <CardTitle>Muted Card</CardTitle>
                  <CardDescription>Subtle gray surface for secondary content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Use <code className="text-code">bg-card-muted</code> with <code className="text-code">border-card-muted-border</code> for low-emphasis containers.</p>
                </CardContent>
              </Card>
              <Card className="bg-card-info border-card-info-border">
                <CardHeader>
                  <CardTitle>Info Card</CardTitle>
                  <CardDescription>Light blue surface for informational content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Use <code className="text-code">bg-card-info</code> with <code className="text-code">border-card-info-border</code> for highlighted or informational containers.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card id="tabs">
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Tabbed navigation for switching between content views</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <p>Content for tab 1</p>
              </TabsContent>
              <TabsContent value="tab2">
                <p>Content for tab 2</p>
              </TabsContent>
              <TabsContent value="tab3">
                <p>Content for tab 3</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Training Cards */}
        <Card id="training-cards">
          <CardHeader>
            <CardTitle>Training Cards</CardTitle>
            <CardDescription>
              Cards used on the employee dashboard to display assigned training content with progress, due dates, and
              quiz status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Example cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <TrainingCard
                video={{
                  id: "demo-not-started",
                  title: "Workplace Safety Basics",
                  description: "Introduction to workplace safety protocols and procedures.",
                  thumbnail: "/placeholder.svg",
                  duration: "10:00",
                  progress: 0,
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                }}
                onPlay={() => toast.info("Training Card", { description: "Playing: Workplace Safety Basics" })}
              />
              <TrainingCard
                video={{
                  id: "demo-completed",
                  title: "PPE Requirements",
                  description: "Proper selection and use of personal protective equipment.",
                  thumbnail: "/placeholder.svg",
                  duration: "12:00",
                  progress: 100,
                  completedAt: "2025-01-06T00:00:00Z",
                  quizSummary: { correct: 8, total: 10, percent: 80 },
                }}
                onPlay={() => toast.info("Training Card", { description: "Playing: PPE Requirements" })}
              />
            </div>

          </CardContent>
        </Card>

        {/* Badge Rules */}
        <Card id="badge-rules">
          <CardHeader>
            <CardTitle>Badge Rules</CardTitle>
            <CardDescription>Badge display logic for training cards — status, quiz scores, and other indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              {/* Status Badges */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Status Badges
                </h4>
                <p className="text-body-sm text-muted-foreground">
                  Displayed above the title, based on completion status and due date.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Badge</TableHead>
                      <TableHead>Appears When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-success" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Training is 100% complete</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-destructive" className="gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Due date has passed and training is not 100% done</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-warning">Due Today</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Due date is today and training is not 100% done</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-primary">Due in X days</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Due within 30 days, training not done</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-primary">Due MMM d</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Due date is 30+ days away, training not done</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <span className="text-body-sm text-muted-foreground italic">No badge</span>
                      </TableCell>
                      <TableCell className="text-body-sm">No due date set and not completed</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Quiz Score Badges */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Quiz Score Badges
                </h4>
                <p className="text-body-sm text-muted-foreground">
                  Displayed below the description when training is completed and quiz data is available.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Badge</TableHead>
                      <TableHead>Appears When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-success">Quiz: 90% (9/10)</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Score is 80% or above</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-warning">Quiz: 70% (7/10)</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Score is 60–79%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="soft-destructive">Quiz: 40% (4/10)</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">Score is below 60%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Other Indicators */}
              <div className="space-y-3">
                <h4 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Other Indicators
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Indicator</TableHead>
                      <TableHead>Appears When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="ghost-warning">Quiz Pending</Badge>
                      </TableCell>
                      <TableCell className="text-body-sm">
                        Video watched but quiz not yet taken (
                        <code className="text-caption bg-muted px-1 py-0.5 rounded">quizPending: true</code>)
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <span className="text-body-sm font-medium">Progress bar</span>
                      </TableCell>
                      <TableCell className="text-body-sm">
                        Always shown; color shifts based on completion percentage
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
          </CardContent>
        </Card>

        {/* Tooltips Section */}
        <Card id="tooltips" className="shadow-card hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Tooltips</CardTitle>
            <CardDescription>Arrow alignment variants — hover each button to see the arrow position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-8">
              {/* Center-aligned (default) */}
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Center (default)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Arrow is centered</TooltipContent>
                </Tooltip>
                <span className="text-caption text-muted-foreground">align="center"</span>
              </div>

              {/* Start-aligned */}
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Start-aligned</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    Arrow on the left
                  </TooltipContent>
                </Tooltip>
                <span className="text-caption text-muted-foreground">align="start"</span>
              </div>

              {/* End-aligned */}
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">End-aligned</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end">
                    Arrow on the right
                  </TooltipContent>
                </Tooltip>
                <span className="text-caption text-muted-foreground">align="end"</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-body-sm text-muted-foreground">
              <p>Components Gallery • Built with shadcn/ui and Radix UI</p>
              <p className="mt-2">Toggle between light and dark themes to see all variants</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
