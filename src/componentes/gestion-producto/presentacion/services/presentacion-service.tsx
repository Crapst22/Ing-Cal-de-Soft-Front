import { createCrudService } from "../../../../utils/crudFactory";
import { FormValues } from "../interfaces/interfaces-validaciones-presentacion";

const baseService = createCrudService<FormValues>("presentacion");

const PresentacionService = {
  ...baseService,
};

export default PresentacionService;