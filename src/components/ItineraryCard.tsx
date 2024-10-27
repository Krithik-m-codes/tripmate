import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, MapPin, Activity, DollarSign, Compass, Clock } from 'lucide-react'
import colors from '@/utils/colorData'
import dayjs from 'dayjs'

interface TravelDetails {
    destination: string
    days: {
        from: string
        to: string
    }
    activities: string[]
    budget: string
    travelStyle: string
    itinerary: string[]
}

export default function Component({ travelDetails }: { travelDetails: TravelDetails }) {
    const {
        destination,
        days,
        activities,
        budget,
        travelStyle,
        itinerary
    } = travelDetails

    const [cardColor, setCardColor] = useState('');

    // Generate a random minimalistic color
    useEffect(() => {
        setCardColor(colors[Math.floor(Math.random() * colors.length)]);
    }, []);

    // Calculate duration in days
    const duration = dayjs(days.to).diff(dayjs(days.from), 'day') + 1; // Adding 1 to include the start day

    return (
        <Card className="w-[350px] shadow-lg" style={{ backgroundColor: cardColor }}>
            <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{destination}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span>{dayjs(days.from).format('MMM D')} - {dayjs(days.to).format('MMM D, YYYY')} ({duration} days)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                        <span>{activities.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span>{budget}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Compass className="h-5 w-5 text-muted-foreground" />
                        <span>{travelStyle}</span>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">View Itinerary</Button>
                        </PopoverTrigger>
                        <PopoverContent className="max-h-80 overflow-y-auto w-full p-4 max-w-sm sm:max-w-sm shadow-sm">
                            <h4 className="font-medium mb-2">Itinerary</h4>
                            <pre className="text-sm whitespace-pre-wrap">{itinerary}</pre>
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
        </Card>
    )
}
