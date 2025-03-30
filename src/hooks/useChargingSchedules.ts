import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { ChargingSchedule } from '../types';

export const useChargingSchedules = () => {
  const queryClient = useQueryClient();

  const getChargingSchedules = async (): Promise<ChargingSchedule[]> => {
    const response = await axios.get('/api/charging-schedules');
    return response.data.docs;
  };

  const getChargingSchedule = async (id: string): Promise<ChargingSchedule> => {
    const response = await axios.get(`/api/charging-schedules/${id}`);
    return response.data;
  };

  const createChargingSchedule = async (schedule: Partial<ChargingSchedule>): Promise<ChargingSchedule> => {
    const response = await axios.post('/api/charging-schedules', schedule);
    return response.data;
  };

  const updateChargingSchedule = async ({ id, ...schedule }: Partial<ChargingSchedule> & { id: string }): Promise<ChargingSchedule> => {
    const response = await axios.patch(`/api/charging-schedules/${id}`, schedule);
    return response.data;
  };

  const deleteChargingSchedule = async (id: string): Promise<void> => {
    await axios.delete(`/api/charging-schedules/${id}`);
  };

  const useGetChargingSchedules = () => useQuery('chargingSchedules', getChargingSchedules);
  
  const useGetChargingSchedule = (id: string) => useQuery(['chargingSchedule', id], () => getChargingSchedule(id));

  const useCreateChargingSchedule = () => useMutation(createChargingSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('chargingSchedules');
    },
  });

  const useUpdateChargingSchedule = () => useMutation(updateChargingSchedule, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('chargingSchedules');
      queryClient.invalidateQueries(['chargingSchedule', data.id]);
    },
  });

  const useDeleteChargingSchedule = () => useMutation(deleteChargingSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('chargingSchedules');
    },
  });

  return {
    useGetChargingSchedules,
    useGetChargingSchedule,
    useCreateChargingSchedule,
    useUpdateChargingSchedule,
    useDeleteChargingSchedule,
  };
};