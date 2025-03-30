import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Vehicle } from '../types';

export const useVehicles = () => {
  const queryClient = useQueryClient();

  const getVehicles = async (): Promise<Vehicle[]> => {
    const response = await axios.get('/api/vehicles');
    return response.data.docs;
  };

  const getVehicle = async (id: string): Promise<Vehicle> => {
    const response = await axios.get(`/api/vehicles/${id}`);
    return response.data;
  };

  const createVehicle = async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await axios.post('/api/vehicles', vehicle);
    return response.data;
  };

  const updateVehicle = async ({ id, ...vehicle }: Partial<Vehicle> & { id: string }): Promise<Vehicle> => {
    const response = await axios.patch(`/api/vehicles/${id}`, vehicle);
    return response.data;
  };

  const deleteVehicle = async (id: string): Promise<void> => {
    await axios.delete(`/api/vehicles/${id}`);
  };

  const useGetVehicles = () => useQuery('vehicles', getVehicles);
  
  const useGetVehicle = (id: string) => useQuery(['vehicle', id], () => getVehicle(id));

  const useCreateVehicle = () => useMutation(createVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
    },
  });

  const useUpdateVehicle = () => useMutation(updateVehicle, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('vehicles');
      queryClient.invalidateQueries(['vehicle', data.id]);
    },
  });

  const useDeleteVehicle = () => useMutation(deleteVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
    },
  });

  return {
    useGetVehicles,
    useGetVehicle,
    useCreateVehicle,
    useUpdateVehicle,
    useDeleteVehicle,
  };
};