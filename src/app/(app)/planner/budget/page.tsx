"use client";
import React, { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  PieChart as PieIcon,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Save,
  Loader2,
  Calendar,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import currency from "currency.js";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: "accommodation" | "food" | "transport" | "activities" | "shopping" | "miscellaneous";
  date?: string;
  notes?: string;
}

interface Budget {
  _id?: string;
  tripName: string;
  destination: string;
  currency: string;
  totalBudget: number;
  expenses: Expense[];
}

const CATEGORY_CONFIG: Record<
  Expense["category"],
  { label: string; color: string; bg: string }
> = {
  accommodation: { label: "Accommodation", color: "#10B981", bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  food: { label: "Food & Dining", color: "#F59E0B", bg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  transport: { label: "Transport & Flights", color: "#3B82F6", bg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  activities: { label: "Activities & Tours", color: "#8B5CF6", bg: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
  shopping: { label: "Shopping", color: "#EC4899", bg: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300" },
  miscellaneous: { label: "Miscellaneous", color: "#64748B", bg: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
};

const EXCHANGE_RATES: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  JPY: { symbol: "¥", rate: 155.0 },
  AUD: { symbol: "A$", rate: 1.52 },
  CAD: { symbol: "C$", rate: 1.38 },
  INR: { symbol: "₹", rate: 84.0 },
};

export default function BudgetTrackerPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeBudget, setActiveBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form for adding expenses
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<Expense["category"]>("food");
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Currency conversion tool state
  const [convertAmount, setConvertAmount] = useState(100);
  const [convertFrom, setConvertFrom] = useState("USD");
  const [convertTo, setConvertTo] = useState("EUR");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setBudgets(data.data);
        setActiveBudget(data.data[0]);
      } else {
        // Create initial default budget in state
        const defaultBudget: Budget = {
          tripName: "My Dream Vacation",
          destination: "Tokyo, Japan",
          currency: "USD",
          totalBudget: 3000,
          expenses: [
            { id: "exp-1", title: "Hotel Booking (5 nights)", amount: 1200, category: "accommodation", date: "2026-08-10" },
            { id: "exp-2", title: "Roundtrip Flights", amount: 850, category: "transport", date: "2026-08-10" },
            { id: "exp-3", title: "Sushi Dinner & Ramen", amount: 150, category: "food", date: "2026-08-11" },
            { id: "exp-4", title: "Mt. Fuji Day Tour", amount: 180, category: "activities", date: "2026-08-12" },
          ],
        };
        setActiveBudget(defaultBudget);
      }
    } catch (e) {
      toast.error("Failed to load trip budgets");
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentBudget = async (updatedBudget: Budget) => {
    setActiveBudget(updatedBudget);
    setSaving(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBudget),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveBudget(data.data);
        setBudgets((prev) => {
          const index = prev.findIndex((b) => b._id === data.data._id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = data.data;
            return next;
          }
          return [data.data, ...prev];
        });
        toast.success("Budget saved successfully!");
      }
    } catch (e) {
      toast.error("Error saving budget");
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBudget || !newTitle.trim() || !newAmount || isNaN(Number(newAmount))) {
      toast.error("Please enter a valid expense title and amount.");
      return;
    }

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      amount: currency(newAmount).value,
      category: newCategory,
      date: newDate || undefined,
      notes: newNotes.trim() || undefined,
    };

    const updated = {
      ...activeBudget,
      expenses: [expense, ...activeBudget.expenses],
    };

    setNewTitle("");
    setNewAmount("");
    setNewNotes("");
    saveCurrentBudget(updated);
  };

  const handleDeleteExpense = (id: string) => {
    if (!activeBudget) return;
    const updated = {
      ...activeBudget,
      expenses: activeBudget.expenses.filter((e) => e.id !== id),
    };
    saveCurrentBudget(updated);
  };

  const handleUpdateTotalBudget = (amount: number) => {
    if (!activeBudget || isNaN(amount) || amount < 0) return;
    saveCurrentBudget({ ...activeBudget, totalBudget: amount });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Loading trip budgets...
          </p>
        </div>
      </div>
    );
  }

  if (!activeBudget) return null;

  const currentSymbol = EXCHANGE_RATES[activeBudget.currency]?.symbol || "$";
  const totalSpent = activeBudget.expenses.reduce((acc, e) => currency(acc).add(e.amount).value, 0);
  const remaining = currency(activeBudget.totalBudget).subtract(totalSpent).value;
  const spentPercentage = activeBudget.totalBudget > 0 ? Math.min(100, Math.round((totalSpent / activeBudget.totalBudget) * 100)) : 0;

  // Chart data calculation
  const categorySummary: Record<Expense["category"], number> = {
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    shopping: 0,
    miscellaneous: 0,
  };
  activeBudget.expenses.forEach((e) => {
    categorySummary[e.category] = currency(categorySummary[e.category]).add(e.amount).value;
  });

  const chartData = Object.entries(categorySummary)
    .filter(([_, amount]) => amount > 0)
    .map(([cat, amount]) => ({
      name: CATEGORY_CONFIG[cat as Expense["category"]].label,
      value: amount,
      color: CATEGORY_CONFIG[cat as Expense["category"]].color,
    }));

  // Currency converter output
  const convertedResult = (
    (convertAmount / (EXCHANGE_RATES[convertFrom]?.rate || 1)) *
    (EXCHANGE_RATES[convertTo]?.rate || 1)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Trip Budget Tracker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorize expenses, monitor spend vs budget, and convert currencies seamlessly
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeBudget.currency}
            onChange={(e) => saveCurrentBudget({ ...activeBudget, currency: e.target.value })}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.entries(EXCHANGE_RATES).map(([code, { symbol }]) => (
              <option key={code} value={code}>
                {code} ({symbol})
              </option>
            ))}
          </select>

          <Button
            onClick={() => saveCurrentBudget(activeBudget)}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 text-xs h-9 font-semibold"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : "Save Budget"}
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Budget Card */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Budget
              </span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentSymbol}{activeBudget.totalBudget.toLocaleString()}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                placeholder="New total..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateTotalBudget(Number((e.target as HTMLInputElement).value));
                  }
                }}
                className="w-28 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 italic">Press Enter to update</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent Card */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Spent
              </span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentSymbol}{totalSpent.toLocaleString()}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-500">{spentPercentage}% of total budget</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    spentPercentage > 90
                      ? "bg-red-500"
                      : spentPercentage > 70
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${spentPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remaining Balance Card */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Remaining Balance
              </span>
              <AlertCircle
                className={`h-4 w-4 ${remaining < 0 ? "text-red-500" : "text-emerald-600"}`}
              />
            </div>
            <div className="mt-2">
              <span
                className={`text-3xl font-extrabold ${
                  remaining < 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"
                }`}
              >
                {remaining < 0 ? "-" : ""}
                {currentSymbol}{Math.abs(remaining).toLocaleString()}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              {remaining < 0
                ? "⚠️ You are over your total trip budget!"
                : "✅ You are currently within your planned trip budget."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Currency Converter Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Card (2 Cols) */}
        <Card className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-emerald-600" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400">
                <PieIcon className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">No expenses logged yet. Add some below to see the breakdown chart!</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="h-64 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(val: any) => [`${currentSymbol}${Number(val || 0).toLocaleString()}`, "Spent"] as any}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend & Summary List */}
                <div className="w-full md:w-1/2 space-y-2.5">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {currentSymbol}{item.value.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 w-10 text-right">
                          {Math.round((item.value / totalSpent) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currency Converter Card (1 Col) */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-600" />
              Currency Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                Amount
              </label>
              <Input
                type="number"
                value={convertAmount}
                onChange={(e) => setConvertAmount(Number(e.target.value))}
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  From
                </label>
                <select
                  value={convertFrom}
                  onChange={(e) => setConvertFrom(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {Object.keys(EXCHANGE_RATES).map((code) => (
                    <option key={code} value={code}>
                      {code} ({EXCHANGE_RATES[code].symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  To
                </label>
                <select
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {Object.keys(EXCHANGE_RATES).map((code) => (
                    <option key={code} value={code}>
                      {code} ({EXCHANGE_RATES[code].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white text-center shadow-md">
              <span className="text-xs text-emerald-100 uppercase font-semibold">Converted Result</span>
              <div className="text-2xl font-extrabold mt-1">
                {EXCHANGE_RATES[convertTo]?.symbol}{convertedResult}{" "}
                <span className="text-xs font-normal text-emerald-100">{convertTo}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form & Expenses List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form Card */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm h-fit">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-600" />
              Log New Expense
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Expense Title *
                </label>
                <Input
                  placeholder="e.g. Shinkansen Train Ticket"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Amount ({activeBudget.currency}) *
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Expense["category"])}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {Object.entries(CATEGORY_CONFIG).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Date
                </label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-semibold gap-1.5 text-xs shadow-md shadow-emerald-600/20"
              >
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Expenses Table/List Card */}
        <Card className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              Logged Expenses ({activeBudget.expenses.length})
            </CardTitle>
            <span className="text-xs font-semibold text-slate-500">
              Total: {currentSymbol}{totalSpent.toLocaleString()}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {activeBudget.expenses.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center text-slate-400 p-6">
                <p className="text-sm">No expenses logged in this budget yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
                {activeBudget.expenses.map((exp) => {
                  const cat = CATEGORY_CONFIG[exp.category];
                  return (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${cat.bg}`}>
                          {cat.label}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {exp.title}
                          </p>
                          {exp.date && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" /> {exp.date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {currentSymbol}{exp.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
