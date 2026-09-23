import { createCrudService } from "../../../../utils/crudFactory";
import ApiService from "../../../../utils/apiService";
import { FormValues } from "../interfaces/interfaces-validaciones-superlinea";

const baseService = createCrudService<FormValues>("superlinea");

const SuperlineaService = {
  ...baseService,

  obtenerLineas: (id: number) => ApiService.get(`/superlinea/${id}/lineas`),
};

export default SuperlineaService;