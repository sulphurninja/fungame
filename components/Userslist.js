"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Userslist() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [userName, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get('/api/userlist');
      setUsers(data);
    }
    fetchUsers();
  }, []);

 

  const handleEdit = (user) => {
    setEditUser(user);
    setName(user.userName);
    setRole(user.role);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/userlist?id=${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put(`/api/userlist?id=${editUser._id}`, {
        userName,
        role,
      });
      console.log(data);
      setUsers(
        users.map((user) =>
          user._id === editUser._id ? { ...user, userName, role } : user
        )
      );
      setEditUser(null);
      setName('');
      setRole('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='text-center'>
        <h1 className='font-bold text-xl text-center text-red-800'>USERS</h1>
        <table className='font-bold text-xl w-full leading-loose text-white'>
          <thead>
            <tr className='bg-gray-400 border'>
              <th>Name</th>
              <th>Role</th>
              <th>Balance</th>
              <th>Winning Points</th>
              <th>Commision Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='border'>
            {users.map((user) => (
              <tr className='text-black border-2 border-black' key={user._id}>
                <td>{user.userName}</td>
                <td>{user.role}</td>
                <td>{user.balance}</td>
                <td>
                  {user.winningPoints}
                </td>
                <td>
                  {user.commissionPoints}
                </td>
                <td>
                  <button className='px-5' onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editUser && (
          <form
            className='bg-black h-[20%] w-full absolute text-white'
            onSubmit={handleSubmit}
          >
            <h2 className='font-bold mb-[5%]'>Edit User</h2>
            <label>
              Name:
              <input
                className='bg-white rounded-lg text-black'
                type='text'
                value={userName}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label>
              Role:
              <input
                className='bg-white rounded-lg text-black'
                type='text'
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />
            </label>
            <button
              className='bg-white w-[5%] text-black rounded-lg absolute ml-[10%]'
              type='submit'
            >
              Save
            </button>
            <button
              className='bg-white w-[5%] text-black rounded-lg absolute ml-[20%]'
              type='button'
              onClick={() => setEditUser(null)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </>
  );
}
