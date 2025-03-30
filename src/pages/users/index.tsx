import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import AppLayout from '../../components/Layout';
import { User } from '../../types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const UsersPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  
  // Users API hooks
  const getUsers = async (): Promise<User[]> => {
    const response = await axios.get('/api/users');
    return response.data.docs;
  };

  const createUser = async (user: Partial<User> & { password: string }): Promise<User> => {
    const response = await axios.post('/api/users', user);
    return response.data;
  };

  const updateUser = async ({ id, ...user }: Partial<User> & { id: string }): Promise<User> => {
    const response = await axios.patch(`/api/users/${id}`, user);
    return response.data;
  };

  const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`/api/users/${id}`);
  };

  const updatePassword = async ({ id, password }: { id: string; password: string }): Promise<void> => {
    await axios.post(`/api/users/${id}/update-password`, { password });
  };

  const { data: users = [], isLoading } = useQuery('users', getUsers);
  
  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
  
  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
  
  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
  
  const updatePasswordMutation = useMutation(updatePassword, {
    onSuccess: () => {
      message.success('Password updated successfully');
    },
  });

  const showCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
    setIsModalVisible(true);
  };

  const showPasswordModal = (user: User) => {
    setEditingUser(user);
    form.resetFields(['password', 'confirmPassword']);
    setIsPasswordModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        await updateUserMutation.mutateAsync({ 
          id: editingUser.id, 
          ...values 
        });
        message.success('User updated successfully');
      } else {
        await createUserMutation.mutateAsync(values);
        message.success('User created successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await form.validateFields(['password', 'confirmPassword']);
      
      if (editingUser) {
        await updatePasswordMutation.mutateAsync({ 
          id: editingUser.id, 
          password: values.password 
        });
      }
      
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteUserMutation.mutateAsync(id);
          message.success('User deleted successfully');
        } catch (error) {
          message.error('Failed to delete user');
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'green';
        if (role === 'admin') color = 'red';
        if (role === 'fleet-manager') color = 'blue';
        if (role === 'maintenance') color = 'orange';
        
        return (
          <Tag color={color}>
            {role.toUpperCase().replace('-', ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          />
          <Button 
            icon={<LockOutlined />} 
            onClick={() => showPasswordModal(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Users</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          Add User
        </Button>
      </div>
      
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading}
      />
      
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createUserMutation.isLoading || updateUserMutation.isLoading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="fleet-manager">Fleet Manager</Select.Option>
              <Select.Option value="driver">Driver</Select.Option>
              <Select.Option value="maintenance">Maintenance Staff</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="Update Password"
        visible={isPasswordModalVisible}
        onCancel={handlePasswordCancel}
        onOk={handlePasswordSubmit}
        confirmLoading={updatePasswordMutation.isLoading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, message: 'Please enter new password' }]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default UsersPage;