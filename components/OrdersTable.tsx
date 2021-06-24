export type OrdersTableProps = {
  orders: {
    id: string;
    market: string;
    price: string;
  }[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-800 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Market
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, orderIndex) => (
                  <tr
                    key={order.id}
                    className={
                      orderIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {order.market}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm ordinal slashed-zero tabular-nums text-gray-300">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 5,
                        minimumFractionDigits: 5,
                      }).format(parseInt(order.price, 10) / Math.pow(10, 5))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
