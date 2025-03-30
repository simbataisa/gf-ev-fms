import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  year: number;
  licensePlate: string;
  vin: string;
  batteryCapacity: number;
  range: number;
  status: string;
  currentCharge: number;
  drivers?: any[];
}

export const useVehicles = () => {
  const queryClient = useQueryClient();

  const useGetVehicles = () => {
    return useQuery<Vehicle[]>('vehicles', async () => {
      const { data } = await axios.get('/api/vehicles');
      return data.docs;
    });
  };

  const useCreateVehicle = () => {
    return useMutation(
      async (vehicleData: Partial<Vehicle>) => {
        const { data } = await axios.post('/api/vehicles', vehicleData);
        return data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('vehicles');
        },
      }
    );
  };

  const useUpdateVehicle = () => {
    return useMutation(
      async ({ id, ...vehicleData }: Partial<Vehicle> & { id: string }) => {
        const { data } = await axios.patch(`/api/vehicles/${id}`, vehicleData);
        return data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('vehicles');
        },
      }
    );
  };

  const useDeleteVehicle = () => {
    return useMutation(
      async (id: string) => {
        await axios.delete(`/api/vehicles/${id}`);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('vehicles');
        },
      }
    );
  };

  return {
    useGetVehicles,
    useCreateVehicle,
    useUpdateVehicle,
    useDeleteVehicle,
  };
};