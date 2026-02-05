"use client"

import { Package, DollarSign, ShoppingCart } from "lucide-react"
import Counter from "@/components/counter"
import { StaggerContainer, StaggerItem } from "@/components/stagger-container"
import { motion } from "framer-motion"

interface DashboardData {
  productsCount: number
  ordersCount: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    amount: number
    createdAt: Date
    product: {
      title: string
      price: number
    }
  }>
  recentProducts: Array<{
    id: string
    title: string
    price: number
    createdAt: Date
  }>
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-3">
        <StaggerItem>
          <motion.div
            className="rounded-xl bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 p-6 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              <Counter value={data.totalRevenue} decimals={2} prefix="$" />
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            className="rounded-xl bg-white/5 p-6 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-400">Active Products</h3>
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              <Counter value={data.productsCount} />
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            className="rounded-xl bg-white/5 p-6 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-400">Total Sales</h3>
              <ShoppingCart className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              <Counter value={data.ordersCount} />
            </div>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div
          className="col-span-4 rounded-xl bg-white/5 backdrop-blur-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-white mb-4">Recent Sales</h3>
          {data.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="h-10 w-10 text-white/20 mb-4" />
              <p className="text-gray-400 text-sm">No sales yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="flex items-center justify-between py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      {order.product.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">
                    ${order.amount.toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="col-span-3 rounded-xl bg-white/5 backdrop-blur-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-white mb-4">Recent Products</h3>
          {data.recentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-10 w-10 text-white/20 mb-4" />
              <p className="text-gray-400 text-sm">No products yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="py-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <p className="text-sm font-medium text-white truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-emerald-400 mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
