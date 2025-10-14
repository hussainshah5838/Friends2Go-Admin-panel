import React from "react";

export default function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-10 w-16 rounded bg-white/10" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-32 sm:w-48 bg-white/10 rounded mb-2" />
        <div className="h-3 w-48 sm:w-64 bg-white/10 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-20 sm:w-24 bg-white/10 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-16 sm:w-20 bg-white/10 rounded-pill" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-20 sm:w-28 bg-white/10 rounded" />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="h-8 w-28 bg-white/10 rounded-pill ml-auto" />
      </td>
    </tr>
  );
}
