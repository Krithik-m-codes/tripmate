const SkeletonDashboard = () => {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Header */}
      <div className="h-10 bg-gray-300 rounded"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-24 bg-gray-300 rounded"></div>
        <div className="h-24 bg-gray-300 rounded"></div>
        <div className="h-24 bg-gray-300 rounded"></div>
        <div className="h-24 bg-gray-300 rounded"></div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-gray-300 rounded"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>

      {/* Recent Activity */}
      <div className="h-48 bg-gray-300 rounded"></div>

      {/* Footer */}
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  );
};

export default SkeletonDashboard;
