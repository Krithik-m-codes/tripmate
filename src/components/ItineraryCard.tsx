import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Activity, DollarSign, Compass, Clock, Mail, Check, Loader2, Share2, Trash2, Edit2 } from 'lucide-react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useSession } from "@/lib/authClient"
import PDFDownloadButton from "@/components/PDFDownloadButton"

interface TravelDetails {
    _id?: string
    destination: string
    days?: {
        from?: string
        to?: string
        [key: string]: any
    } | any
    activities?: string[]
    budget?: string
    travelStyle?: string
    itinerary?: string[] | any
    onDelete?: (id: string) => void
}

export default function Component({ travelDetails }: { travelDetails: TravelDetails }) {
    const {
        _id,
        destination,
        days,
        activities = [],
        budget = 'Moderate',
        travelStyle = 'Explore',
        itinerary = [],
        onDelete
    } = travelDetails

    const { data: session } = useSession();
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [shared, setShared] = useState(false);

    // Calculate duration in days
    const duration = days?.to && days?.from ? dayjs(days.to).diff(dayjs(days.from), 'day') + 1 : 3;

    const handleShare = async () => {
        if (!_id) {
            toast.error("Save this itinerary first to share it.");
            return;
        }
        setSharing(true);
        try {
            const res = await fetch(`/api/itineraries/${_id}/share`, { method: "POST" });
            const data = await res.json();
            if (data.success && data.shareToken) {
                const shareUrl = `${window.location.origin}/i/${data.shareToken}`;
                await navigator.clipboard.writeText(shareUrl);
                setShared(true);
                toast.success("Public share link copied to clipboard!");
                setTimeout(() => setShared(false), 4000);
            } else {
                toast.error(data.message || "Failed to generate share link");
            }
        } catch (e) {
            toast.error("Error connecting to server");
        } finally {
            setSharing(false);
        }
    };

    const handleSendEmail = async () => {
        if (!session?.user?.email) {
            toast.error("You must be logged in with a valid email to send summaries.");
            return;
        }
        setSendingEmail(true);
        try {
            const res = await fetch("/api/emails/send-trip-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session.user.email,
                    userName: session.user.name || "Traveler",
                    tripDestination: destination,
                    itineraryData: Array.isArray(itinerary) ? itinerary.join("\n\n") : typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary, null, 2),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setEmailSent(true);
                toast.success(`Trip summary sent to ${session.user.email} via Brevo!`);
                setTimeout(() => setEmailSent(false), 5000);
            } else {
                toast.error(data.error || "Failed to send email");
            }
        } catch (e) {
            toast.error("Error connecting to email service");
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <Card className="glass-card w-full shadow-md border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 transition-all hover:shadow-xl hover:border-emerald-500/50">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white truncate">{destination}</CardTitle>
                    {days?.from && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {dayjs(days.from).format('MMM D')} - {dayjs(days.to).format('MMM D, YYYY')} ({duration} days)
                        </p>
                    )}
                </div>
                {_id && onDelete && (
                    <button
                        onClick={() => onDelete(_id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete itinerary"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    {activities && activities.length > 0 && (
                        <div className="flex items-start space-x-2.5">
                            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{activities.join(', ')}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{budget} Budget</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <span className="badge-active capitalize !text-xs !py-0.5 !px-2.5">{travelStyle}</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1 min-w-[100px] rounded-xl border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-xs h-8">
                                    View Details
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-h-96 overflow-y-auto w-80 p-4 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm border-b pb-2">Full Day-by-Day Itinerary</h4>
                                <pre className="text-xs whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
                                    {Array.isArray(itinerary) ? itinerary.join("\n\n") : typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary, null, 2)}
                                </pre>
                            </PopoverContent>
                        </Popover>

                        {_id && (
                            <Link href={`/planner/edit/${_id}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-xs h-8 px-2.5 gap-1 text-emerald-700 dark:text-emerald-400"
                                    title="Customize & Edit Itinerary with Drag & Drop"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </Button>
                            </Link>
                        )}

                        <PDFDownloadButton
                            destination={destination}
                            dates={days?.from ? `${dayjs(days.from).format('MMM D')} - ${dayjs(days.to).format('MMM D, YYYY')}` : undefined}
                            budget={budget}
                            travelStyle={travelStyle}
                            activities={activities}
                            itineraryData={itinerary}
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs h-8"
                        />

                        {_id && (
                            <Button
                                onClick={handleShare}
                                disabled={sharing}
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-xs h-8 px-2.5"
                                title="Share public link"
                            >
                                {sharing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                                ) : shared ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                    <Share2 className="w-3.5 h-3.5" />
                                )}
                            </Button>
                        )}

                        <Button
                            onClick={handleSendEmail}
                            disabled={sendingEmail}
                            variant="secondary"
                            size="sm"
                            className="rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900 px-2.5 h-8 text-xs font-semibold flex items-center gap-1"
                            title="Email trip summary via Brevo"
                        >
                            {sendingEmail ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : emailSent ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                                <Mail className="w-3.5 h-3.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
