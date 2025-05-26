import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import AdminLayout from '../../components/Admin/AdminLayout';
import { productService } from '../../services/productService';
import './Products.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState('');
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    brand: '',
    category: '',
    type: '',
    stock: '',
    images: [],
    features: [],
    specifications: {},
    status: 'active'
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.getProducts({
        page: 1,
        limit: 50,
        sort: '-createdAt'
      });
      
      if (result.success) {
        setProducts(result.data.products || []);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!productForm.name.trim()) errors.name = 'Product name is required';
    if (!productForm.description.trim()) errors.description = 'Description is required';
    if (!productForm.price || productForm.price <= 0) errors.price = 'Valid price is required';
    if (!productForm.brand.trim()) errors.brand = 'Brand is required';
    if (!productForm.category.trim()) errors.category = 'Category is required';
    if (!productForm.type.trim()) errors.type = 'Type is required';
    if (!productForm.stock || productForm.stock < 0) errors.stock = 'Valid stock quantity is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Update product
        const result = await productService.updateProduct(editingProduct.id, productForm);
        if (result.success) {
          setMessage({ type: 'success', text: 'Product updated successfully!' });
          fetchProducts(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      } else {
        // Create new product
        const result = await productService.createProduct(productForm);
        if (result.success) {
          setMessage({ type: 'success', text: 'Product created successfully!' });
          fetchProducts(); // Refresh the list
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({ type: 'error', text: 'Failed to save product' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      brand: product.brand,
      category: product.category,
      type: product.type,
      stock: product.stock,
      status: product.status,
      images: product.images || [],
      features: product.features || [],
      specifications: product.specifications || {}
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    try {
      const result = await productService.deleteProduct(productId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        fetchProducts(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: result.error });
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      brand: '',
      category: '',
      type: '',
      stock: '',
      images: [],
      features: [],
      specifications: {},
      status: 'active'
    });
    setFormErrors({});
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge bg="success">Active</Badge> 
      : <Badge bg="secondary">Inactive</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="admin-products">
        {/* Header */}
        <div className="products-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-box me-2"></i>
                Products Management
              </h1>
              <p className="page-subtitle">
                Manage your product catalog and inventory
              </p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowModal(true)}
                className="add-product-btn"
              >
                <i className="fas fa-plus me-2"></i>
                Add New Product
              </Button>
            </Col>
          </Row>
        </div>

        {/* Alert Messages */}
        {message && (
          <Alert 
            variant={message.type === 'success' ? 'success' : 'danger'} 
            className="mb-4"
            dismissible
            onClose={() => setMessage('')}
          >
            {message.text}
          </Alert>
        )}

        {/* Products Table */}
        <Card className="products-table-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              All Products ({products.length})
            </h5>
            <div className="table-actions">
              <Button variant="outline-secondary" size="sm" className="me-2">
                <i className="fas fa-download me-1"></i>
                Export
              </Button>
              <Button variant="outline-primary" size="sm">
                <i className="fas fa-filter me-1"></i>
                Filter
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading products...</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info">
                          <strong>{product.name}</strong>
                          <br />
                          <small className="text-muted">{product.description}</small>
                        </div>
                      </td>
                      <td>{product.brand}</td>
                      <td>
                        <Badge bg="info" className="category-badge">
                          {product.type}
                        </Badge>
                      </td>
                      <td>
                        <div className="price-info">
                          <strong>{formatPrice(product.price)}</strong>
                          {product.originalPrice && (
                            <>
                              <br />
                              <small className="text-muted">
                                <del>{formatPrice(product.originalPrice)}</del>
                              </small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td>{product.updatedAt}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="me-1"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteConfirm(product)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Add/Edit Product Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className={`fas fa-${editingProduct ? 'edit' : 'plus'} me-2`}></i>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleFormChange}
                      placeholder="Enter product name"
                      isInvalid={!!formErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Brand *</Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={productForm.brand}
                      onChange={handleFormChange}
                      placeholder="Enter brand name"
                      isInvalid={!!formErrors.brand}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.brand}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={productForm.description}
                  onChange={handleFormChange}
                  placeholder="Enter product description"
                  isInvalid={!!formErrors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      name="category"
                      value={productForm.category}
                      onChange={handleFormChange}
                      isInvalid={!!formErrors.category}
                    >
                      <option value="">Select Category</option>
                      <option value="pens">Pens & Writing</option>
                      <option value="notebooks">Notebooks & Paper</option>
                      <option value="organizers">Organizers</option>
                      <option value="art">Art & Craft</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type *</Form.Label>
                    <Form.Control
                      type="text"
                      name="type"
                      value={productForm.type}
                      onChange={handleFormChange}
                      placeholder="e.g., Gel Pens"
                      isInvalid={!!formErrors.type}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.type}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={productForm.status}
                      onChange={handleFormChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price *</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      isInvalid={!!formErrors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Original Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="originalPrice"
                      value={productForm.originalPrice}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock Quantity *</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleFormChange}
                      placeholder="0"
                      min="0"
                      isInvalid={!!formErrors.stock}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.stock}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="modal-actions d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className={`fas fa-${editingProduct ? 'save' : 'plus'} me-2`}></i>
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)}>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirm Delete
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this product?</p>
            {deleteConfirm && (
              <div className="delete-product-info">
                <strong>{deleteConfirm.name}</strong>
                <br />
                <small className="text-muted">{deleteConfirm.description}</small>
              </div>
            )}
            <Alert variant="warning" className="mt-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              This action cannot be undone!
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleDelete(deleteConfirm.id)}
            >
              <i className="fas fa-trash me-2"></i>
              Delete Product
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
