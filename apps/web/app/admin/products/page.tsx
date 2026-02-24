"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Star,
  Image as ImageIcon,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/toaster";

interface Shirt {
  id: number;
  name: string;
  description: string;
  price: number;
  point_cost: number;
  shirt_image?: string;
  is_available: boolean;
  is_featured: boolean;
  stock_quantity: number;
  category: string;
  sizes_available: string[];
  colors_available: string[];
  total_orders: number;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Shirt | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Shirt>>({
    name: "",
    description: "",
    price: 0,
    point_cost: 0,
    stock_quantity: 0,
    category: "apparel",
    is_available: true,
    is_featured: false,
    sizes_available: ["S", "M", "L", "XL"],
    colors_available: ["Black", "White"],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await apiClient("/shirts/");
      setProducts(data.results || data || []);
    } catch (error) {
      toast.error("Failed to load products");
      // Mock data
      setProducts([
        {
          id: 1,
          name: "Altrue Classic Tee",
          description: "Premium cotton t-shirt with Altrue logo",
          price: 29.99,
          point_cost: 500,
          shirt_image: "/shirts/classic.jpg",
          is_available: true,
          is_featured: true,
          stock_quantity: 150,
          category: "apparel",
          sizes_available: ["S", "M", "L", "XL", "XXL"],
          colors_available: ["Black", "White", "Navy"],
          total_orders: 45,
          created_at: "2024-01-10",
        },
        {
          id: 2,
          name: "Giving Back Hoodie",
          description: "Comfortable hoodie for chilly days",
          price: 49.99,
          point_cost: 800,
          shirt_image: "/shirts/hoodie.jpg",
          is_available: true,
          is_featured: false,
          stock_quantity: 75,
          category: "apparel",
          sizes_available: ["S", "M", "L", "XL"],
          colors_available: ["Gray", "Black"],
          total_orders: 23,
          created_at: "2024-01-15",
        },
        {
          id: 3,
          name: "Charity Champion Cap",
          description: "Snapback cap with embroidered logo",
          price: 24.99,
          point_cost: 350,
          is_available: false,
          is_featured: false,
          stock_quantity: 0,
          category: "accessories",
          sizes_available: ["One Size"],
          colors_available: ["Black", "Navy"],
          total_orders: 12,
          created_at: "2024-02-01",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setFormData({
      name: "",
      description: "",
      price: 0,
      point_cost: 0,
      stock_quantity: 0,
      category: "apparel",
      is_available: true,
      is_featured: false,
      sizes_available: ["S", "M", "L", "XL"],
      colors_available: ["Black", "White"],
    });
    setIsAddModalOpen(true);
  }

  function handleEdit(product: Shirt) {
    setSelectedProduct(product);
    setFormData(product);
    setIsEditModalOpen(true);
  }

  async function handleSave() {
    try {
      if (isEditModalOpen && selectedProduct) {
        await apiClient(`/shirts/${selectedProduct.id}/`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        toast.success("Product updated successfully");
      } else {
        await apiClient("/shirts/", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        toast.success("Product created successfully");
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product");
      // Update locally for demo
      if (isEditModalOpen && selectedProduct) {
        setProducts(prev =>
          prev.map(p => (p.id === selectedProduct.id ? { ...p, ...formData } as Shirt : p))
        );
      } else {
        const newProduct = {
          ...formData,
          id: Date.now(),
          total_orders: 0,
          created_at: new Date().toISOString(),
        } as Shirt;
        setProducts(prev => [...prev, newProduct]);
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      toast.success("Product saved (local)");
    }
  }

  async function handleDelete() {
    if (!selectedProduct) return;
    
    try {
      await apiClient(`/shirts/${selectedProduct.id}/`, {
        method: "DELETE",
      });
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    } catch (error) {
      toast.error("Failed to delete product");
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    }
    setIsDeleteDialogOpen(false);
  }

  async function toggleAvailability(product: Shirt) {
    try {
      await apiClient(`/shirts/${product.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_available: !product.is_available }),
      });
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, is_available: !p.is_available } : p
        )
      );
      toast.success(`Product ${product.is_available ? "disabled" : "enabled"}`);
    } catch (error) {
      toast.error("Failed to update availability");
    }
  }

  async function toggleFeatured(product: Shirt) {
    try {
      await apiClient(`/shirts/${product.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_featured: !product.is_featured }),
      });
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
        )
      );
      toast.success(`Product ${product.is_featured ? "unfeatured" : "featured"}`);
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = products.reduce(
    (sum, p) => sum + p.price * p.total_orders,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage shirts, rewards, and merchandise
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <ToggleRight className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.is_available).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.is_featured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#D4AF37]">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Point Cost</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {product.shirt_image ? (
                            <img
                              src={product.shirt_image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{product.name}</p>
                            {product.is_featured && (
                              <Badge className="bg-yellow-500/10 text-yellow-600">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="text-[#D4AF37] font-medium">
                        {product.point_cost} pts
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock_quantity < 10
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>{product.total_orders}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {product.is_available ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <span
                          className={
                            product.is_available
                              ? "text-green-600 text-sm"
                              : "text-gray-500 text-sm"
                          }
                        >
                          {product.is_available ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFeatured(product)}
                          className={
                            product.is_featured ? "text-yellow-500" : ""
                          }
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen
                ? "Update product details and inventory"
                : "Create a new product for the rewards store"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="apparel">Apparel</option>
                  <option value="accessories">Accessories</option>
                  <option value="digital">Digital</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="point_cost">Point Cost</Label>
                <Input
                  id="point_cost"
                  type="number"
                  value={formData.point_cost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      point_cost: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_quantity: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sizes Available</Label>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const current = formData.sizes_available || [];
                      const updated = current.includes(size)
                        ? current.filter((s) => s !== size)
                        : [...current, size];
                      setFormData({ ...formData, sizes_available: updated });
                    }}
                    className={`px-3 py-1 rounded text-sm border transition-colors ${
                      (formData.sizes_available || []).includes(size)
                        ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) =>
                    setFormData({ ...formData, is_available: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>Available for purchase</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>Featured on homepage</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditModalOpen ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedProduct?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
