'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  AlertDialogCancel 
} from '@/components/ui/alert-dialog';
import { 
  AlertDialogAction 
} from '@/components/ui/alert-dialog';

import { 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Download,
  Upload,
  X,
  Check,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Package,
  Users,
  BarChart3,
  Settings,
  Home,
  FileText,
  Database,
  Shield,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Target,
  Layers,
  Zap,
  Lock,
  Unlock,
  EyeOff,
  Eye as EyeIcon,
  Save,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Copy,
  Share2,
  Printer,
  FilterX,
  Grid,
  List,
  View,
  Hide,
  Move,
  RotateCw,
  RotateCcw,
  CopyPlus,
  Trash,
  Edit,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Archive,
  Undo,
  Redo,
  RefreshCw as RefreshIcon,
  Settings as SettingsIcon,
  HelpCircle,
  Menu,
  Menu as MenuIcon,
  BarChart,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Target as TargetIcon,
  Layout,
  Calendar as CalendarIcon,
  File,
  Folder,
  FolderOpen,
  FileText as FileTextIcon,
  Image,
  Video,
  Music,
  Book,
  BookOpen,
  BookMarked,
  BookOpenCheck,
  BookUser,
  BookCheck,
  BookOpenUser,
  BookOpenCheckUser,
  BookOpenCheckUserCheck,
  BookOpenCheckUserCheckCheck,
  BookOpenCheckUserCheckCheckCheck
} from 'lucide-react';

export default function TableComponent({ data = [], columns = [], actions = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState(null);

  const filteredData = data.filter(item => {
    return Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === sortedData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedData.map((_, index) => index)));
    }
  };

  const toggleSelectItem = (index) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(index)) {
      newSelectedItems.delete(index);
    } else {
      newSelectedItems.add(index);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleAction = (action, item, index) => {
    if (action.type === 'dialog') {
      setDialogContent({
        title: action.title || 'Confirmation',
        description: action.description || 'Are you sure you want to perform this action?',
        onConfirm: () => action.onConfirm?.(item, index),
        onCancel: () => setIsDialogOpen(false)
      });
      setIsDialogOpen(true);
    } else if (action.type === 'alert') {
      setAlertContent({
        title: action.title || 'Confirmation',
        description: action.description || 'Are you sure you want to perform this action?',
        onConfirm: () => action.onConfirm?.(item, index),
        onCancel: () => setIsAlertOpen(false)
      });
      setIsAlertOpen(true);
    } else if (action.type === 'confirm') {
      const confirmed = window.confirm(action.message || 'Are you sure?');
      if (confirmed) {
        action.onConfirm?.(item, index);
      }
    } else {
      action.onConfirm?.(item, index);
    }
  };

  const renderCell = (item, column, rowIndex) => {
    if (column.render) {
      return column.render(item, rowIndex);
    }

    if (column.type === 'badge') {
      return (
        <Badge variant={item[column.key] === 'Active' ? 'default' : 'secondary'}>
          {item[column.key]}
        </Badge>
      );
    }

    if (column.type === 'status') {
      switch (item[column.key]) {
        case 'Active':
          return <Badge variant="default">Active</Badge>;
        case 'Inactive':
          return <Badge variant="secondary">Inactive</Badge>;
        case 'Pending':
          return <Badge variant="warning">Pending</Badge>;
        default:
          return <Badge variant="outline">{item[column.key]}</Badge>;
      }
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(item[column.key]);
    }

    if (column.type === 'date') {
      return new Date(item[column.key]).toLocaleDateString();
    }

    return item[column.key];
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {columns.length > 0 ? columns[0]?.title || 'Data Table' : 'Data Table'}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.length > 0 && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.size === sortedData.length && sortedData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.title}
                      {sortConfig.key === column.key && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0) + 1} className="h-24 text-center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((item, rowIndex) => (
                  <TableRow key={rowIndex} className={selectedItems.has(rowIndex) ? 'bg-muted' : ''}>
                    {columns.length > 0 && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(rowIndex)}
                          onChange={() => toggleSelectItem(rowIndex)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {renderCell(item, column, rowIndex)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => handleAction(action, item, rowIndex)}
                              >
                                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {selectedItems.size} of {sortedData.length} row(s) selected
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription>{dialogContent?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                dialogContent?.onConfirm();
                setIsDialogOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent?.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertContent?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alertContent?.onConfirm();
                setIsAlertOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

// Simple Checkbox component for table selection
function Checkbox({ checked, onChange }) {
  return (
    <div 
      className="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 cursor-pointer"
      onClick={onChange}
    >
      {checked && <Check className="h-3 w-3 text-gray-700" />}
    </div>
  );
}