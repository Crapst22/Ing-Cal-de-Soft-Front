import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrarActualizarPresentacionForm from "./registrar-actualizar-presentacion";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

vi.mock("../../../../utils/auth", () => ({
  getUsuarioId: () => 7,
}));

const serviceMock = vi.hoisted(() => ({
  nuevo: vi.fn(),
  actualizar: vi.fn(),
}));

vi.mock("../services/presentacion-service", () => ({
  default: serviceMock,
}));

const presentacionEdicion: Presentacion = {
  id: 3,
  tipo: "volume",
  quantity: null,
  volumen: 1,
  unidad: "l",
  denominacion: "1l",
  sistema: 0,
  deletedAt: null,
};

const presentacionSistema: Presentacion = {
  ...presentacionEdicion,
  sistema: 1,
};

describe("RegistrarActualizarPresentacionForm", () => {
  beforeEach(() => {
    serviceMock.nuevo.mockReset();
    serviceMock.actualizar.mockReset();
  });

  it("renderiza el formulario de alta con sus campos", () => {
    render(
      <RegistrarActualizarPresentacionForm onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    expect(screen.getByText("Presentación")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantidad por pack")).toBeInTheDocument();
    expect(screen.getByLabelText("Volumen")).toBeInTheDocument();
    expect(screen.getByLabelText("Unidad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrar" })).toBeInTheDocument();
  });

  it("registra una presentación nueva llamando al servicio", async () => {
    serviceMock.nuevo.mockResolvedValue({
      mensaje: "Presentación creada con éxito con denominacion: Pack x6 de 500ml",
    });
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(
      <RegistrarActualizarPresentacionForm onClose={vi.fn()} onSuccess={onSuccess} />,
    );

    await user.type(screen.getByLabelText("Cantidad por pack"), "6");
    await user.type(screen.getByLabelText("Volumen"), "500");
    await user.type(screen.getByLabelText("Unidad"), "ml");
    await user.click(screen.getByRole("button", { name: "Registrar" }));

    await waitFor(() => {
      expect(serviceMock.nuevo).toHaveBeenCalledWith({
        tipo: "pack",
        quantity: 6,
        volumen: 500,
        unidad: "ml",
        usuarioCreatedId: 7,
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "Presentación creada con éxito con denominacion: Pack x6 de 500ml",
      );
    });
  });

  it("precarga los datos en modo edición y actualiza con el id", async () => {
    serviceMock.actualizar.mockResolvedValue({
      mensaje: "Presentación editada con éxito con denominacion: 1l",
    });
    const user = userEvent.setup();

    render(
      <RegistrarActualizarPresentacionForm
        presentacion={presentacionEdicion}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByText("Actualizar Presentación")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("l")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actualizar" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(serviceMock.actualizar).toHaveBeenCalledWith(3, {
        tipo: "volume",
        quantity: null,
        volumen: 1,
        unidad: "l",
        usuarioUpdatedId: 7,
      });
    });
  });

  it("deshabilita los campos cuando la presentación es del sistema", () => {
    render(
      <RegistrarActualizarPresentacionForm
        presentacion={presentacionSistema}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Cantidad por pack")).toBeDisabled();
    expect(screen.getByLabelText("Volumen")).toBeDisabled();
    expect(screen.getByLabelText("Unidad")).toBeDisabled();
  });

  it("muestra el error del backend cuando el alta falla", async () => {
    serviceMock.nuevo.mockRejectedValue({
      response: { data: { message: "El volumen es obligatorio." } },
    });
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <RegistrarActualizarPresentacionForm onClose={onClose} onSuccess={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Registrar" }));

    await waitFor(() => {
      expect(screen.getByText("El volumen es obligatorio.")).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});