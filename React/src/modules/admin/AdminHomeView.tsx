"use client";

import  { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltipContent,
} from '@/components/ui/chart';
import api from '@/api';
import ShowProductsTable from './chunks/ShowProductsTable';
import AddProductForm from './chunks/AddProductForm';
import { useAppSelector } from '@/store';
import ShowAllSalesTable from './chunks/ShowAllSalesTable';
import ShowAllUserTable from './chunks/ShowAllUserTable';


interface SalesByDate {
    [key: string]: {
        profit: number;
        cost: number;
        count: number;
    };
}


type ChartConfig = {
    [key: string]: {
        label: string;
        color: string;
    };
};

const chartConfig = {
    profit: {
        label: 'Profit',
        color: 'hsl(var(--chart-1))',
    },
    cost: {
        label: 'Cost',
        color: 'hsl(var(--chart-2))',
    },
    count: {
        label: 'Sales Count',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

const AdminHomeView = () => {
    const activeSidebar = useAppSelector((state) => state.adminSidebar.sidebar);
    
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState<Date>(new Date());


    const { data: sales = [], isLoading } = api.sale.GetAllSales.useQuery({
        select: (sales) =>
            sales.filter((sale) => {
                const saleDate = new Date(sale.saleDate);
                return saleDate >= startDate && saleDate <= endDate;
            }),
    });


    const chartData = useMemo(() => {
        const salesByDate: SalesByDate = sales.reduce((acc: SalesByDate, sale) => {
            const date = new Date(sale.saleDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
            if (!acc[date]) {
                acc[date] = { profit: 0, cost: 0, count: 0 };
            }
            acc[date].profit += sale.totalProfit;
            acc[date].cost += sale.totalCost;
            acc[date].count += sale.totalAmount;
            return acc;
        }, {});

 
        const allDates: string[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            allDates.push(
                currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
            );
            currentDate.setDate(currentDate.getDate() + 1);
        }

 
        return allDates.map((date) => ({
            date,
            profit: salesByDate[date]?.profit || 0,
            cost: salesByDate[date]?.cost || 0,
            count: salesByDate[date]?.count || 0,
        }));
    }, [sales, startDate, endDate]);


    const trend = useMemo(() => {
        if (chartData.length < 2) return 0;
        const lastTwo = chartData.slice(-2);
        const profitChange = lastTwo[0].profit !== 0
            ? ((lastTwo[1].profit - lastTwo[0].profit) / lastTwo[0].profit) * 100
            : 0;
        return profitChange.toFixed(1);
    }, [chartData]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2 min-h-full">

            <div className="col-span-1 sm:col-span-3 bg-black/20 rounded-2xl p-4 shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
   
                    <Card className='!bg-red'>
                        <CardHeader>
                            <CardTitle>Profit</CardTitle>
                            <CardDescription>
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p>Loading chart...</p>
                            ) : (
                                <ChartContainer config={{ profit: chartConfig.profit }}>
                                    <BarChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{ left: 12, right: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 6)}
                                        />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar
                                            dataKey="profit"
                                            fill="var(--color-profit)"
                                            radius={4}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cost</CardTitle>
                            <CardDescription>
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p>Loading chart...</p>
                            ) : (
                                <ChartContainer config={{ cost: chartConfig.cost }}>
                                    <BarChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{ left: 12, right: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 6)}
                                        />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar
                                            dataKey="cost"
                                            fill="var(--color-cost)"
                                            radius={4}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Amount</CardTitle>
                            <CardDescription>
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p>Loading chart...</p>
                            ) : (
                                <ChartContainer config={{ count: chartConfig.count }}>
                                    <BarChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{ left: 12, right: 12 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 6)}
                                        />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar
                                            dataKey="count"
                                            fill="var(--color-count)"
                                            radius={4}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="mb-4 flex flex-col sm:flex-row gap-4 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date || new Date())}
                            maxDate={endDate}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date || new Date())}
                            minDate={startDate}
                            maxDate={new Date()}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div className="flex gap-2 font-medium leading-none">
                    {Number(trend) > 0 ? `Trending up by ${trend}%` : `Trending down by ${Math.abs(Number(trend))}%`} this period
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing sales data for the selected date range
                </div>


            </div>

            <div className="col-span-1 sm:col-span-2 bg-black/20 rounded-2xl p-4 shadow">
            {
                activeSidebar === 'products' ? (
                    <>
                        <ShowProductsTable />
                    </>
                ) : activeSidebar === 'sales' ? (
                    <>
                        < ShowAllSalesTable/>
                    </>
                ) : activeSidebar === 'users' ? (
                    <>
                        < ShowAllUserTable/>
                    </>
                ): null
            }
          
            </div>
            <div className="col-span-1 bg-black/20 rounded-2xl p-4 shadow">
                <AddProductForm />
            </div>
        </div>
    );
};

export default AdminHomeView;