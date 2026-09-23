import { FormValues } from "../interfaces/interfaces-validaciones-presentacion";
import { createCrudService } from "../../../../utils/crudFactory";

const baseService = createCrudService<FormValues>("presentacion");

const PresentacionService = {
  ...baseService,
};

export default PresentacionService;