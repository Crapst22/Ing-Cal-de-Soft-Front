import axios from "axios";
import axiosConfig from "../../../../utils/axiosConfig";
import { DtoConsultarHistorialPrecios } from "../../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios";

const apiUrl = axiosConfig.apiUrl;

const HistorialPreciosService = {
  obtenerHistorial: async (
    skip: number,
    take: number,
    productoId?: number,
  ): Promise<DtoConsultarHistorialPrecios> => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const params: any = { skip, take };
      if (productoId) params.productoId = productoId;

      const { data } = await axios.get(`${apiUrl}/producto/historial-precios`, {
        headers,
        params,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default HistorialPreciosService;