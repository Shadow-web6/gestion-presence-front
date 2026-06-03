const ResponsiveTable = ({ headers, children, emptyMessage = "Aucune donnée" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-4 lg:px-6 py-3 text-left text-gray-600 text-sm font-medium whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveTable;