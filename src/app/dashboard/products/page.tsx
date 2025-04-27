"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { Product } from "@/lib/db";
import {
  generateMockData,
  generateId,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useAuthorization } from "@/lib/useAuthorization";
import Unauthorized from "@/components/Unauthorized";
import { downloadCSV, prepareProductsForExport } from "@/lib/export";

// Generate mock products with non-nullable fields
const generateMockProducts = (count: number): Product[] => {
  const categories = ["Electronics", "Clothing", "Home", "Books", "Food"];
  return generateMockData(count, () => ({
    id: generateId(),
    name: `Product ${generateId(4)}`,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    price: Math.floor(Math.random() * 10000) / 100,
    imageUrl: `https://picsum.photos/seed/${generateId(4)}/200/200`,
    category: categories[Math.floor(Math.random() * categories.length)],
    inStock: Math.random() > 0.2,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    inStock: true,
    imageUrl: "",
  });

  // Add authorization check
  const {
    authorizeRoute,
    loading: authLoading,
    authorized,
  } = useAuthorization();

  useEffect(() => {
    // Check if user is authorized to access this page
    authorizeRoute("/dashboard/products");
  }, []);

  useEffect(() => {
    // Only load data if user is authorized
    if (!authLoading && authorized) {
      // Load mock products
      const timer = setTimeout(() => {
        setProducts(generateMockProducts(12));
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [authLoading, authorized]);

  // Show unauthorized component if the user doesn't have access
  if (!authorized && !authLoading) {
    return <Unauthorized />;
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Filter products by search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    const newSelectedProducts = new Set(selectedProducts);
    if (newSelectedProducts.has(productId)) {
      newSelectedProducts.delete(productId);
    } else {
      newSelectedProducts.add(productId);
    }
    setSelectedProducts(newSelectedProducts);
    setShowBulkActions(newSelectedProducts.size > 0);
  };

  // Bulk delete selected products
  const bulkDeleteProducts = () => {
    if (selectedProducts.size > 0) {
      setProducts(
        products.filter((product) => !selectedProducts.has(product.id))
      );
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    }
  };

  // Export products as CSV
  const exportProductsCSV = () => {
    let dataToExport;

    if (selectedProducts.size > 0) {
      // Export only selected products
      const selectedProductsList = products.filter((product) =>
        selectedProducts.has(product.id)
      );
      dataToExport = prepareProductsForExport(selectedProductsList);
    } else {
      // Export all filtered products
      dataToExport = prepareProductsForExport(filteredProducts);
    }

    downloadCSV(dataToExport, "products-export.csv");
  };

  // Handle edit product
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || "",
      inStock: product.inStock,
      imageUrl: product.imageUrl || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle delete product
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (selectedProduct && formData.name && formData.description) {
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      );
      setIsEditModalOpen(false);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setProducts(
        products.filter((product) => !selectedProducts.has(product.id!))
      );
      setIsDeleteModalOpen(false);
    }
  };

  // Handle add product
  const handleAddProduct = () => {
    if (formData.name && formData.description) {
      const newProduct: Product = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
      setIsAddModalOpen(false);
      // Reset form data
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        inStock: true,
        imageUrl: "",
      });
    }
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={exportProductsCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export{" "}
            {selectedProducts.size > 0 ? `(${selectedProducts.size})` : ""}
          </button>
          <button
            onClick={() => {
              setFormData({
                name: "",
                description: "",
                price: 0,
                category: "",
                inStock: true,
                imageUrl: "",
              });
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {showBulkActions && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <span className="font-medium text-indigo-700 dark:text-indigo-300">
              {selectedProducts.size} products selected
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={bulkDeleteProducts}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="relative rounded-md shadow-sm w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                viewMode === "grid"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                  : "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
              }`}
            >
              <ViewColumnsIcon className="h-4 w-4 mr-1" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                viewMode === "list"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                  : "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
              }`}
            >
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              List
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 relative"
              >
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                  />
                </div>
                <div className="h-48 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        No image
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 dark:text-indigo-400"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        onChange={() => {
                          // Use non-nullable ids only
                          const allIds = filteredProducts.map((p) => p.id);
                          if (selectedProducts.size === allIds.length) {
                            setSelectedProducts(new Set<string>());
                            setShowBulkActions(false);
                          } else {
                            setSelectedProducts(new Set<string>(allIds));
                            setShowBulkActions(true);
                          }
                        }}
                        checked={
                          selectedProducts.size === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  No img
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.category || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {/* ...existing delete modal code... */}

      {/* Edit Product Modal */}
      {/* ...existing edit modal code... */}

      {/* Add Product Modal */}
      {/* ...existing add modal code... */}
    </div>
  );
}
