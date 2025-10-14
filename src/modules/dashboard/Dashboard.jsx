import React, { useEffect, useState } from "react";
import {
  getSummary,
  getTrends,
  getRecentUsers,
  getRecentOrders,
} from "./api/dashboard.service";
import StatCard from "./components/StatCard";
import SkeletonStat from "./components/SkeletonStat";
import { RecentUsersTable, RecentOrdersTable } from "./components/RecentTable";
import {
  MdPeople,
  MdSubscriptions,
  MdStorefront,
  MdStadium,
} from "react-icons/md";

export default function Dashboard() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  async function loadStats() {
    setLoadingStats(true);
    try {
      const [s, t] = await Promise.all([getSummary(), getTrends()]);
      setSummary(s);
      setTrends(t);
    } finally {
      setLoadingStats(false);
    }
  }

  async function loadLists() {
    setLoadingUsers(true);
    setLoadingOrders(true);
    try {
      const [u, o] = await Promise.all([getRecentUsers(8), getRecentOrders(8)]);
      setRecentUsers(u);
      setRecentOrders(o);
    } finally {
      setLoadingUsers(false);
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    loadStats();
    loadLists();
  }, []);

  return (
    <div className="space-y-5">
      {/* KPI grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loadingStats && [0, 1, 2, 3].map((i) => <SkeletonStat key={i} />)}
        {!loadingStats && summary && trends && (
          <>
            <StatCard
              label="Total Users"
              value={summary.users}
              delta={12}
              trend={trends.users}
              icon={<MdPeople className="text-primary" />}
            />
            <StatCard
              label="Subscribers"
              value={summary.subscribers}
              delta={7}
              trend={trends.subscribers}
              icon={<MdSubscriptions className="text-primary" />}
            />
            <StatCard
              label="Monthly Revenue"
              value={summary.revenue}
              delta={5}
              trend={trends.revenue}
              icon={<MdStorefront className="text-primary" />}
            />
            <StatCard
              label="Live Matches"
              value={summary.liveMatches}
              delta={-2}
              trend={[5, 7, 6, 5, 8, 9, 7, 6, 6, 5, 7, 6]}
              icon={<MdStadium className="text-primary" />}
            />
          </>
        )}
      </div>

      {/* Two-column recent tables */}
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentUsersTable loading={loadingUsers} items={recentUsers} />
        <RecentOrdersTable loading={loadingOrders} items={recentOrders} />
      </div>
    </div>
  );
}
