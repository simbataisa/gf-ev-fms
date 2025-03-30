import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { MaintenanceRecord } from '../types';

export const useMaintenanceRecords = () => {
  const queryClient = useQueryClient();

  const useGetMaintenanceRecords = () => {
    return useQuery<MaintenanceRecord[]>('maintenanceRecords', async () => {
      const { data } = await axios.get('/api/maintenance-records');
      return data.docs;
    });
  };

  const useCreateMaintenanceRecord = () => {
    return useMutation(
      async (recordData: Partial<MaintenanceRecord>) => {
        const { data } = await axios.post('/api/maintenance-records', recordData);
        return data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('maintenanceRecords');
        },
      }
    );
  };

  const useUpdateMaintenanceRecord = () => {
    return useMutation(
      async ({ id, ...recordData }: Partial<MaintenanceRecord> & { id: string }) => {
        const { data } = await axios.patch(`/api/maintenance-records/${id}`, recordData);
        return data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('maintenanceRecords');
        },
      }
    );
  };

  const useDeleteMaintenanceRecord = () => {
    return useMutation(
      async (id: string) => {
        await axios.delete(`/api/maintenance-records/${id}`);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('maintenanceRecords');
        },
      }
    );
  };

  return {
    useGetMaintenanceRecords,
    useCreateMaintenanceRecord,
    useUpdateMaintenanceRecord,
    useDeleteMaintenanceRecord,
  };
};