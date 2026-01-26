import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Sales Overview -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold text-gray-700 mb-4">Total Sales</h3>
            <div class="h-48 flex items-end justify-between space-x-2">
                <div class="bg-blue-200 w-full h-[60%] rounded-t"></div>
                <div class="bg-blue-400 w-full h-[80%] rounded-t"></div>
                <div class="bg-blue-600 w-full h-[40%] rounded-t"></div>
                <div class="bg-blue-300 w-full h-[70%] rounded-t"></div>
            </div>
            <p class="text-center mt-2 text-gray-500 text-sm">Last 4 Weeks</p>
        </div>

        <!-- Visitor Traffic -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold text-gray-700 mb-4">Visitor Traffic</h3>
            <div class="h-48 flex items-center justify-center">
                 <div class="w-32 h-32 rounded-full border-8 border-purple-100 border-t-purple-500 animate-spin-slow"></div>
            </div>
             <p class="text-center mt-2 text-gray-500 text-sm">Real-time Visitors: 124</p>
        </div>

        <!-- Conversion Rate -->
        <div class="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
                <h3 class="font-bold text-gray-700">Conversion Rate</h3>
                <p class="text-4xl font-extrabold text-green-600 mt-2">3.2%</p>
                <p class="text-sm text-green-500">↑ 0.5% from last month</p>
            </div>
             <div class="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                 <div class="bg-green-500 h-2.5 rounded-full" style="width: 32%"></div>
             </div>
        </div>
      </div>
      
      <!-- Detailed Report Placeholder -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="font-bold text-gray-700 mb-4">Detailed Performance Report</h3>
        <p class="text-gray-500">Select a date range to view detailed analytics.</p>
        <!-- Add more complex charts/tables here in future -->
      </div>
    </div>
  `
})
export class AnalyticsComponent { }
