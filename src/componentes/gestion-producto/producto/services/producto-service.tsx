import axios from "axios";
import axiosConfig from "../../../../utils/axiosConfig";

import { createCrudService } from "../../../../utils/crudFactory";
import { FormValues } from "../interfaces/interfaces-validaciones-item-prod-alternativo";
import ApiService from "../../../../utils/apiService";


import {
  ActualizarPreciosMasivoDto,
  ActualizarPreciosProductoDto,
} from "../../../../interfaces/gestion-producto/producto/interfaces-producto";

const apiUrl = axiosConfig.apiUrl;

const baseService = createCrudService<FormValues>("producto");

const ProductoService = {
  ...baseService,
   obtenerSugerencias: (texto: string, take = 8) =>
    ApiService.get("/producto/search-sugerencias", { texto, take }),

  buscarPorTexto: (filtros: any) =>
    ApiService.get("/producto/search-texto", filtros),
  actualizarPreciosMasivo: async (
    payload: ActualizarPreciosMasivoDto
  ): Promise<{ mensaje: string }> => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.put<{ mensaje: string }>(
        `${apiUrl}/producto/actualizar-precios-masivo`,
        payload,
        { headers }
      );
      return data;
    } catch (error) {
      console.error("Error al actualizar precios masivamente:", error);
      throw error;
    }
  },

  
  obtenerMobile: async (filtros: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${apiUrl}/producto/search-by-mobile`, { headers, params: filtros });

      return data;
    } catch (error) {
      throw error;
    }
  },

  actualizarPreciosProducto: async (id: number, payload: ActualizarPreciosProductoDto) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.patch(`${apiUrl}/producto/${id}/precios`, payload, { headers });
      return data;
    } catch (error) {
      throw error;
    }
  },

  calcularPreciosConPorcentaje: async (
    productoId: number,
    baseImponible: number,
    porcentajeOcasional: number,
    porcentajeMayorista: number,
    porcentajeCliente: number,
  ) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      const body = {
        productoId,
        baseImponible,
        porcentajeOcasional,
        porcentajeMayorista,
        porcentajeCliente,
      };

      const { data } = await axios.post(`${apiUrl}/producto/calcular-precio-item`, body, { headers });

      console.log("Respuesta de la API en calcular importes:", data);
      return data;
    } catch (error) {
      console.error("Error al calcular precios:", error);
      return null;
    }
  },

  calcularPreciosEnCrearProducto: async (
    alicuotaIva: number,
    baseImponible: number,
    porcentajeOcasional: number,
    porcentajeMayorista: number,
    porcentajeCliente: number,
  ) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      const body = {
        alicuotaIva,
        baseImponible,
        porcentajeOcasional,
        porcentajeMayorista,
        porcentajeCliente,
      };

      const { data } = await axios.post(`${apiUrl}/producto/calcular-precio-item-from-nuevo`, body, { headers });

      console.log("Respuesta de la API en calcular importes:", data);
      return data;
    } catch (error) {
      console.error("Error al calcular precios:", error);
      return null;
    }
  },

  calcularPrecioConFlete: async (
    precio: number,
    tipo: number,
    valor: number,
  ): Promise<{ precioConFlete: number }> => {
    const token = localStorage.getItem("Token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(
      `${apiUrl}/producto/calcular-precio-con-flete`,
      { precio, tipo, valor },
      { headers },
    );
    return data;
  },
};

export default ProductoService;
