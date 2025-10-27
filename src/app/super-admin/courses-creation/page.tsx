// app/(admin)/course-audit-logs/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchCourseAuditLogs,
  fetchAuditLogStats,
  setFilters,
  clearFilters,
  setPage,
  AuditLogFilters,
  AuditLog,
} from '@/store/slices/adminslice/auditcourselog';
import { format } from 'date-fns';

export default function CourseAuditLogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs, pagination, filters, loading, stats, statsLoading, error } = useSelector(
    (state: RootState) => state.courseAuditLogs
  );

  const [showStats, setShowStats] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    search: '',
    action: '',
    course_id: '',
    user_id: '',
    from_date: '',
    to_date: '',
    is_active_status: '',
    sort: '-action_timestamp',
  });

  useEffect(() => {
    dispatch(fetchCourseAuditLogs(filters));
    if (showStats) {
      dispatch(fetchAuditLogStats());
    }
  }, [dispatch, filters, showStats]);

  const handleApplyFilters = () => {
    const filtersToApply: AuditLogFilters = {
      page: 1,
      limit: 20,
      sort: localFilters.sort,
    };

    if (localFilters.search) filtersToApply.search = localFilters.search;
    if (localFilters.action) filtersToApply.action = localFilters.action;
    if (localFilters.course_id) filtersToApply.course_id = parseInt(localFilters.course_id);
    if (localFilters.user_id) filtersToApply.user_id = parseInt(localFilters.user_id);
    if (localFilters.from_date) filtersToApply.from_date = localFilters.from_date;
    if (localFilters.to_date) filtersToApply.to_date = localFilters.to_date;
    if (localFilters.is_active_status)
      filtersToApply.is_active_status = localFilters.is_active_status === 'true';

    dispatch(setFilters(filtersToApply));
    dispatch(fetchCourseAuditLogs(filtersToApply));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      action: '',
      course_id: '',
      user_id: '',
      from_date: '',
      to_date: '',
      is_active_status: '',
      sort: '-action_timestamp',
    });
    dispatch(clearFilters());
    dispatch(fetchCourseAuditLogs({ page: 1, limit: 20, sort: '-action_timestamp' }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(fetchCourseAuditLogs({ ...filters, page: newPage }));
  };

  const handleRefresh = () => {
    dispatch(fetchCourseAuditLogs(filters));
    if (showStats) {
      dispatch(fetchAuditLogStats());
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      created: 'bg-blue-100 text-blue-800',
      updated: 'bg-gray-100 text-gray-800',
      activated: 'bg-green-100 text-green-800',
      deactivated: 'bg-yellow-100 text-yellow-800',
      deleted: 'bg-red-100 text-red-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const renderPagination = () => {
    if (!pagination) return null;
    
    const page = pagination.current_page;
    const totalPages = pagination.total_pages;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            i === page ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 border rounded hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 border rounded hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  // Mock stats data - replace with actual API call
  const mockStats = {
    total_logs: pagination?.total_records || 0,
    recent_activity_24h: auditLogs.filter(log => {
      const logDate = new Date(log.action_timestamp);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return logDate > yesterday;
    }).length,
    actions_breakdown: Object.entries(
      auditLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([action, count]) => ({ action, count })),
    top_users: Object.entries(
      auditLogs.reduce((acc, log) => {
        if (log.user_name) {
          acc[log.user_name] = (acc[log.user_name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([user_name, action_count]) => ({ user_name, action_count }))
      .sort((a, b) => b.action_count - a.action_count)
      .slice(0, 3),
  };

  const displayStats = stats || mockStats;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Audit Logs</h1>
            <p className="text-gray-600 mt-1">
              Track all course-related activities and changes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              {showStats ? 'Hide' : 'Show'} Statistics
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">
            {error.code} {error.message ? `: ${error.message}` : ''}
          </p>
        </div>
      )}

      {/* Statistics */}
      {showStats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-600">Total Logs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{displayStats.total_logs}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-600">Recent Activity (24h)</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{displayStats.recent_activity_24h}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-600">Actions Breakdown</h3>
            <div className="mt-2 space-y-1">
              {displayStats.actions_breakdown.map((item) => (
                <div key={item.action} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600">{item.action}:</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-600">Top Active User</h3>
            {displayStats.top_users[0] ? (
              <div className="mt-2">
                <p className="font-semibold text-gray-900">{displayStats.top_users[0].user_name}</p>
                <p className="text-sm text-gray-600">{displayStats.top_users[0].action_count} actions</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No user data</p>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Course or user name..."
              value={localFilters.search}
              onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={localFilters.action}
              onChange={(e) => setLocalFilters({ ...localFilters, action: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="activated">Activated</option>
              <option value="deactivated">Deactivated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
            <input
              type="number"
              placeholder="Enter course ID..."
              value={localFilters.course_id}
              onChange={(e) => setLocalFilters({ ...localFilters, course_id: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="number"
              placeholder="Enter user ID..."
              value={localFilters.user_id}
              onChange={(e) => setLocalFilters({ ...localFilters, user_id: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={localFilters.from_date}
              onChange={(e) => setLocalFilters({ ...localFilters, from_date: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={localFilters.to_date}
              onChange={(e) => setLocalFilters({ ...localFilters, to_date: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
            <select
              value={localFilters.is_active_status}
              onChange={(e) => setLocalFilters({ ...localFilters, is_active_status: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={localFilters.sort}
              onChange={(e) => setLocalFilters({ ...localFilters, sort: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="-action_timestamp">Newest First</option>
              <option value="action_timestamp">Oldest First</option>
              <option value="-course_id">Course ID (High to Low)</option>
              <option value="course_id">Course ID (Low to High)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">
            Course Audit Logs ({pagination?.total_records || 0} {pagination?.total_records === 1 ? 'entry' : 'entries'})
          </h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : auditLogs.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{log.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.course_title}</p>
                        <p className="text-sm text-gray-500">ID: {log.course_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.user_name ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.user_name}</p>
                          {log.user_id && <p className="text-sm text-gray-500">ID: {log.user_id}</p>}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">System</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.is_active_status === null ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          N/A
                        </span>
                      ) : log.is_active_status ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{format(new Date(log.action_timestamp), 'PPP')}</p>
                        <p className="text-gray-500">{format(new Date(log.action_timestamp), 'p')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No course audit logs found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && renderPagination()}
      </div>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">Course Audit Log Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Log ID</label>
                <p className="text-lg font-semibold">#{selectedLog.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Course</label>
                <p className="text-lg">{selectedLog.course_title}</p>
                <p className="text-sm text-gray-500">ID: {selectedLog.course_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Action</label>
                <p className="text-lg capitalize">{selectedLog.action}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Performed By</label>
                <p className="text-lg">{selectedLog.user_name || 'System'}</p>
                {selectedLog.user_id && <p className="text-sm text-gray-500">User ID: {selectedLog.user_id}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Timestamp</label>
                <p className="text-lg">{format(new Date(selectedLog.action_timestamp), 'PPP p')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Active Status</label>
                <p className="text-lg capitalize">
                  {selectedLog.is_active_status === null 
                    ? 'N/A' 
                    : selectedLog.is_active_status 
                    ? 'Active' 
                    : 'Inactive'
                  }
                </p>
              </div>
              {selectedLog.changed_fields && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Changed Fields</label>
                  <pre className="mt-2 p-4 bg-gray-50 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.changed_fields, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}