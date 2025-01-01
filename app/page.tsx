"use client";

import Link from "next/link";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  // Static demo data
  const stats = {
    properties: {
      total: 25,
      approved: 20,
      pending: 5,
    },
    users: 100,
  };

  // Bar Chart Data
  const barChartData = {
    labels: ["Approved Listings", "Pending Approvals"],
    datasets: [
      {
        label: "Properties",
        data: [stats.properties.approved, stats.properties.pending],
        backgroundColor: ["#4CAF50", "#FF9800"],
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Properties", "Users"],
    datasets: [
      {
        label: "Distribution",
        data: [stats.properties.total, stats.users],
        backgroundColor: ["#2196F3", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options for static display
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Agenagn Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Link href="/users">
            <span className="text-blue-600 hover:underline font-medium">Manage Users</span>
          </Link>
          <Link href="/propertiesToApprove">
            <span className="text-blue-600 hover:underline font-medium">Manage Properties</span>
          </Link>
<button className="w-[100px] bg-green-500 px-2 py-1 rounded-lg">          
    <Link href="/adminsignin">Sign In</Link>
</button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Approved Listings */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full">
            <img
              src="/check-mark.png"
              alt="Approved Listings Icon"
              width={40}
              height={40}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Approved Listings</h2>
            <p className="text-2xl font-bold text-green-600">{stats.properties.approved}</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-100 flex items-center justify-center rounded-full">
            <img
              src="/clock.png"
              alt="Pending Approvals Icon"
              width={40}
              height={40}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Pending Approvals</h2>
            <p className="text-2xl font-bold text-orange-600">{stats.properties.pending}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Bar Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Properties Overview</h2>
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">User vs Properties</h2>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

