import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import AdminLayout from '../../components/Admin/AdminLayout';
import './Users.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock users data
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+91 9876543210',
            isAdmin: false,
            status: 'active',
            joinDate: '2024-01-10',
            lastLogin: '2024-01-15',
            ordersCount: 5,
            totalSpent: 2500,
            address: {
              street: '123 Main Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001'
            }
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+91 9876543211',
            isAdmin: false,
            status: 'active',
            joinDate: '2024-01-08',
            lastLogin: '2024-01-14',
            ordersCount: 3,
            totalSpent: 1800,
            address: {
              street: '456 Oak Avenue',
              city: 'Delhi',
              state: 'Delhi',
              pincode: '110001'
            }
          },
          {
            id: 3,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@smartpick.com',
            phone: '+91 9876543212',
            isAdmin: true,
            status: 'active',
            joinDate: '2024-01-01',
            lastLogin: '2024-01-15',
            ordersCount: 0,
            totalSpent: 0,
            address: null
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      setMessage({ type: 'success', text: `User status updated successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' });
    }
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

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.isAdmin).length
  };

  return (
    <AdminLayout>
      <div className="admin-users">
        {/* Header */}
        <div className="users-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-users me-2"></i>
                Users Management
              </h1>
              <p className="page-subtitle">
                Manage customer accounts and administrators
              </p>
            </Col>
          </Row>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-primary">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{userStats.total}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-success">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{userStats.active}</h3>
                    <p>Active Users</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-secondary">
                    <i className="fas fa-user-times"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{userStats.inactive}</h3>
                    <p>Inactive Users</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-warning">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{userStats.admins}</h3>
                    <p>Administrators</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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

        {/* Users Table */}
        <Card className="users-table-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              All Users ({filteredUsers.length})
            </h5>
            <div className="table-actions">
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading users...</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                            <br />
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.phone}</td>
                      <td>
                        <Badge bg={user.isAdmin ? 'danger' : 'info'}>
                          {user.isAdmin ? 'Admin' : 'Customer'}
                        </Badge>
                      </td>
                      <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td>
                        <Badge bg="primary">{user.ordersCount}</Badge>
                      </td>
                      <td>
                        <strong>{formatPrice(user.totalSpent)}</strong>
                      </td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                            className="me-1"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button
                            variant={user.status === 'active' ? 'outline-warning' : 'outline-success'}
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            disabled={user.isAdmin}
                          >
                            <i className={`fas fa-${user.status === 'active' ? 'ban' : 'check'}`}></i>
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

        {/* User Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-user me-2"></i>
              User Details
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            {selectedUser && (
              <Row>
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Role:</strong> {selectedUser.isAdmin ? 'Administrator' : 'Customer'}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>
                </Col>
                
                <Col md={6}>
                  <h6>Account Information</h6>
                  <p><strong>Join Date:</strong> {new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                  <p><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                  <p><strong>Total Orders:</strong> {selectedUser.ordersCount}</p>
                  <p><strong>Total Spent:</strong> {formatPrice(selectedUser.totalSpent)}</p>
                </Col>
                
                {selectedUser.address && (
                  <Col xs={12}>
                    <h6 className="mt-3">Address</h6>
                    <p>
                      {selectedUser.address.street}<br />
                      {selectedUser.address.city}, {selectedUser.address.state}<br />
                      PIN: {selectedUser.address.pincode}
                    </p>
                  </Col>
                )}
              </Row>
            )}
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
