"use client"

import { useState } from "react"
import { Search, Eye, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/types"

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false)

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setIsCustomerDetailOpen(true)
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Customers</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isCustomerDetailOpen} onOpenChange={setIsCustomerDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Customer Details - {selectedCustomer?.firstName} {selectedCustomer?.lastName}
            </DialogTitle>
            <DialogDescription>
              Customer since {selectedCustomer && new Date(selectedCustomer.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedCustomer.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {selectedCustomer.role}
                      </p>
                      <p>
                        <strong>Email Verified:</strong> {selectedCustomer.isEmailVerified ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Member Since:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History */}

              {/* Addresses */}
              {selectedCustomer.addresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Saved Addresses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCustomer.addresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-600">

                                {address.city}, {address.state} {address.pincode}
                                <br />
                                {address.area}
                              </p>
                              <Badge variant="outline" className="mt-2">
                                {address.type}
                              </Badge>
                            </div>
                            {address.isDefault && <Badge variant="secondary">Default</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
